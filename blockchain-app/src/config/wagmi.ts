import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), // Para MetaMask y otras wallets inyectadas
    metaMask(), // Específicamente para MetaMask
  ],
  transports: {
    [sepolia.id]: http(),
  },
});
