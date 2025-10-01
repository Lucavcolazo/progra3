import { createWalletClient, http, createPublicClient, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const RPC_URL = process.env.RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '';

if (!PRIVATE_KEY) {
  throw new Error('Falta PRIVATE_KEY en variables de entorno');
}

export const account = privateKeyToAccount(`0x${PRIVATE_KEY.replace(/^0x/, '')}`);

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

export const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL),
});

export type { Address };


