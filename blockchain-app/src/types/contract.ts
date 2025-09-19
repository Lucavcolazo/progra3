// Tipos para el contrato FaucetToken
export interface FaucetTokenContract {
  // Funciones de lectura (view/pure)
  balanceOf: (address: `0x${string}`) => Promise<bigint>;
  hasAddressClaimed: (address: `0x${string}`) => Promise<boolean>;
  getFaucetUsers: () => Promise<readonly `0x${string}`[]>;
  getFaucetAmount: () => Promise<bigint>;
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  totalSupply: () => Promise<bigint>;
  owner: () => Promise<`0x${string}`>;
  
  // Funciones de escritura (transacciones)
  claimTokens: () => Promise<`0x${string}`>;
  transfer: (to: `0x${string}`, amount: bigint) => Promise<`0x${string}`>;
  approve: (spender: `0x${string}`, amount: bigint) => Promise<`0x${string}`>;
  allowance: (owner: `0x${string}`, spender: `0x${string}`) => Promise<bigint>;
}

// Tipos para los datos del usuario
export interface UserData {
  address: `0x${string}`;
  balance: bigint;
  hasClaimed: boolean;
  isOwner: boolean;
}

// Tipos para los datos del contrato
export interface ContractData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  faucetAmount: bigint;
  faucetUsers: readonly `0x${string}`[];
  owner: `0x${string}`;
}

// Tipos para los estados de la aplicación
export interface AppState {
  isConnected: boolean;
  isConnecting: boolean;
  userData: UserData | null;
  contractData: ContractData | null;
  error: string | null;
}
