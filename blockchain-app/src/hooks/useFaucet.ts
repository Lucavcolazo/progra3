import { useAccount } from 'wagmi';
import type { UserData, ContractData } from '../types/contract';
import { getFaucetStatus, postFaucetClaim } from '../services/api';
import { useEffect, useMemo, useState } from 'react';

// Ahora el frontend no toca el contrato. Usa el backend.

export function useFaucet() {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('jwt') : null), [isConnected, typeof window !== 'undefined' ? localStorage.getItem('jwt') : null]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!address || !token) return;
      try {
        const data = await getFaucetStatus(address, token);
        if (ignore) return;
        setUserData({
          address,
          balance: BigInt(data.balance),
          hasClaimed: data.hasClaimed,
          isOwner: data.contract.owner.toLowerCase() === address.toLowerCase(),
        });
        setContractData({
          name: data.contract.name,
          symbol: data.contract.symbol,
          decimals: 18,
          totalSupply: BigInt(data.contract.totalSupply),
          faucetAmount: BigInt(data.contract.faucetAmount),
          faucetUsers: data.users as any,
          owner: data.contract.owner as any,
        });
      } catch (e: any) {
        setError(new Error(e?.message || 'Error al cargar estado'));
      }
    }
    load();
    return () => { ignore = true; };
  }, [address, token]);

  const claimTokens = async () => {
    if (!isConnected) {
      setError(new Error('🔗 Conecta tu wallet para continuar'));
      return;
    }
    if (!token) {
      setError(new Error('✍️ Debes autenticarte (firmar SIWE) antes de reclamar'));
      return;
    }
    setError(null);
    setIsPending(true);
    setIsConfirming(false);
    setIsConfirmed(false);
    try {
      await postFaucetClaim(token);
      setIsPending(false);
      setIsConfirming(true);
      // Espera corta y recarga estado
      setTimeout(async () => {
        setIsConfirming(false);
        setIsConfirmed(true);
        if (address) {
          const data = await getFaucetStatus(address, token);
          setUserData({
            address,
            balance: BigInt(data.balance),
            hasClaimed: data.hasClaimed,
            isOwner: data.contract.owner.toLowerCase() === address.toLowerCase(),
          });
          setContractData({
            name: data.contract.name,
            symbol: data.contract.symbol,
            decimals: 18,
            totalSupply: BigInt(data.contract.totalSupply),
            faucetAmount: BigInt(data.contract.faucetAmount),
            faucetUsers: data.users as any,
            owner: data.contract.owner as any,
          });
        }
      }, 2000);
    } catch (e: any) {
      setIsPending(false);
      setIsConfirming(false);
      setIsConfirmed(false);
      setError(new Error(e?.message || 'Error al reclamar'));
    }
  };

  return {
    isConnected,
    address,
    userData,
    contractData,
    claimTokens,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash: undefined,
  };
}
