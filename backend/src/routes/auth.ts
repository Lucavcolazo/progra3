import { Router } from 'express';
import { z } from 'zod';
import { SiweMessage } from 'siwe';
import { signJwt } from '../middleware/auth.js';
import { randomBytes } from 'crypto';
import { getAddress, isAddress } from 'viem';

export const authRouter = Router();

// En memoria simple para challenge por address checksum (en producción usar Redis/db)
const nonceStore = new Map<string, string>();

// POST /auth/message -> genera mensaje SIWE a firmar
authRouter.post('/message', (req, res) => {
  try {
    const schema = z.object({ address: z.string() });
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'address inválido' });
    const raw = parse.data.address;
    if (!isAddress(raw)) return res.status(400).json({ error: 'address inválido' });
    const address = getAddress(raw); // normaliza a checksum

    // Construir el mensaje SIWE
    const domain = (req.hostname || 'localhost').toString(); // solo host, sin puerto, requerido por EIP-4361
    const hostWithPort = (req.headers.host ?? 'localhost').toString();
    const uri = `http://${hostWithPort}`; // URI puede incluir puerto
    const nonce = randomBytes(16).toString('hex');
    nonceStore.set(address, nonce);

    const message = new SiweMessage({
      domain,
      address,
      // Usar solo ASCII en statement para evitar fallos del parser SIWE
      statement: 'Sign in with Ethereum to use the Faucet',
      uri,
      version: '1',
      chainId: 11155111,
      nonce,
    }).prepareMessage();

    return res.json({ message, address });
  } catch (e: any) {
    console.error('Error en /auth/message:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});

// POST /auth/signin -> valida firma y genera JWT
authRouter.post('/signin', async (req, res) => {
  const schema = z.object({ message: z.string(), signature: z.string() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'payload inválido' });
  let { message, signature } = parse.data;
  // Normaliza fin de línea por seguridad
  message = message.replace(/\r\n/g, '\n');

  try {
    console.log('Mensaje SIWE recibido:\n', message);
    const siweMessage = new SiweMessage(message);
    // Validación con dominio y nonce esperados para evitar desincronización
    const parsed = siweMessage; // ya contiene domain/nonce del mensaje
    const verifyDomain = (req.hostname || 'localhost').toString();
    const fields = await siweMessage.verify({ signature, domain: verifyDomain, nonce: parsed.nonce });
    const address = getAddress(fields.data.address);
    const expectedNonce = nonceStore.get(address);
    if (!expectedNonce || expectedNonce !== fields.data.nonce) {
      return res.status(400).json({ error: 'nonce inválido' });
    }
    // limpiar nonce una vez usado
    nonceStore.delete(address);
    const token = signJwt(address);
    return res.json({ token, address });
  } catch (err: any) {
    console.error('Error en /auth/signin:', err?.message || err);
    return res.status(401).json({ error: 'firma inválida' });
  }
});

// (nonce por randomBytes en la ruta)


