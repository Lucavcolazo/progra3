// Servicio API para comunicarse con el backend
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

export async function postAuthMessage(address: string) {
  const res = await fetch(`${API_URL}/auth/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) throw new Error('No se pudo obtener el mensaje de SIWE');
  return res.json() as Promise<{ message: string; address: string }>;
}

export async function postSignin(message: string, signature: string) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature }),
  });
  if (!res.ok) throw new Error('Firma inválida');
  return res.json() as Promise<{ token: string; address: string }>;
}

export async function getFaucetStatus(address: string, token: string) {
  const res = await fetch(`${API_URL}/faucet/status/${address}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudo obtener el estado del faucet');
  return res.json() as Promise<{
    hasClaimed: boolean;
    balance: string;
    users: string[];
    contract: {
      name: string;
      symbol: string;
      totalSupply: string;
      faucetAmount: string;
      owner: string;
      address: string;
    };
  }>;
}

export async function postFaucetClaim(token: string) {
  const res = await fetch(`${API_URL}/faucet/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'No se pudo reclamar');
  }
  return res.json() as Promise<{ txHash: string; success: boolean }>;
}


