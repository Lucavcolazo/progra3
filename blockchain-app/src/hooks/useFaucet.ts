import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../utils/constants';
import type { UserData, ContractData } from '../types/contract';
import { sepolia } from 'viem/chains';

// ABI del contrato FaucetToken (simplificado para las funciones que necesitamos)
const FAUCET_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "hasAddressClaimed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFaucetUsers",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFaucetAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useFaucet() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Leer datos del contrato
  const { data: contractName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: contractSymbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: contractDecimals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'decimals',
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: faucetAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'getFaucetAmount',
  });

  const { data: faucetUsers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'getFaucetUsers',
  });

  const { data: contractOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'owner',
  });

  // Leer datos del usuario (solo si está conectado)
  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: hasUserClaimed } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FAUCET_TOKEN_ABI,
    functionName: 'hasAddressClaimed',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Función para reclamar tokens
  const claimTokens = async () => {
    if (!isConnected) {
      throw new Error('Wallet no conectada');
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: FAUCET_TOKEN_ABI,
      functionName: 'claimTokens',
      chainId: sepolia.id,
    });
  };

  // Preparar datos del usuario
  const userData: UserData | null = address ? {
    address,
    balance: userBalance || 0n,
    hasClaimed: hasUserClaimed || false,
    isOwner: contractOwner === address,
  } : null;

  // Preparar datos del contrato
  const contractData: ContractData | null = {
    name: contractName || '',
    symbol: contractSymbol || '',
    decimals: contractDecimals || 18,
    totalSupply: totalSupply || 0n,
    faucetAmount: faucetAmount || 0n,
    faucetUsers: faucetUsers || [],
    owner: contractOwner || '0x0000000000000000000000000000000000000000',
  };

  return {
    // Estado de conexión
    isConnected,
    address,
    
    // Datos del usuario
    userData,
    
    // Datos del contrato
    contractData,
    
    // Funciones
    claimTokens,
    
    // Estados de transacciones
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
