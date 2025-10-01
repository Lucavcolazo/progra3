import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { walletClient, publicClient } from '../lib/viem.js';
import { FAUCET_TOKEN_ABI } from '../lib/abi.js';
import { sepolia } from 'viem/chains';

const CONTRACT_ADDRESS = (process.env.CONTRACT_ADDRESS ?? '').toLowerCase() as `0x${string}`;
if (!CONTRACT_ADDRESS) {
  throw new Error('Falta CONTRACT_ADDRESS en variables de entorno');
}

export const faucetRouter = Router();

// POST /faucet/claim (protegido)
faucetRouter.post('/claim', requireAuth, async (req, res) => {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: FAUCET_TOKEN_ABI,
      functionName: 'claimTokens',
      chain: sepolia,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return res.json({ txHash: hash, success: receipt.status === 'success' });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? 'Tx fallida' });
  }
});

// GET /faucet/status/:address (protegido)
faucetRouter.get('/status/:address', requireAuth, async (req, res) => {
  const schema = z.object({ address: z.string().toLowerCase() });
  const parse = schema.safeParse(req.params);
  if (!parse.success) return res.status(400).json({ error: 'address inválido' });
  const { address } = parse.data as { address: `0x${string}` };

  try {
    const [hasClaimed, balance, users, name, symbol, totalSupply, faucetAmount, owner] = await Promise.all([
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'hasAddressClaimed', args: [address] }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'balanceOf', args: [address] }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'getFaucetUsers' }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'name' }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'symbol' }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'totalSupply' }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'getFaucetAmount' }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: FAUCET_TOKEN_ABI, functionName: 'owner' })
    ]);
    return res.json({
      hasClaimed,
      balance: balance.toString(),
      users,
      contract: {
        name,
        symbol,
        totalSupply: totalSupply.toString(),
        faucetAmount: faucetAmount.toString(),
        owner,
        address: CONTRACT_ADDRESS,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? 'Error al leer estado' });
  }
});


