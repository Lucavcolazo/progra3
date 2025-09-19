/// <reference types="vite/client" />

// Tipos para MetaMask
interface Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>;
    isMetaMask?: boolean;
  };
}
