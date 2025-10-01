import { useAccount, useDisconnect } from 'wagmi';
import { postAuthMessage, postSignin } from '../services/api';

export function WalletButton() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
      localStorage.removeItem('jwt');
    } else {
      // Abrir MetaMask directamente
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        const selected = (accounts && accounts[0]) ? accounts[0] : address;
        if (!selected) {
          alert('No se pudo obtener la dirección de la wallet');
          return;
        }
        // Flujo SIWE con la dirección obtenida del provider
        const { message } = await postAuthMessage(selected);
        // @ts-ignore
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, selected],
        });
        const { token } = await postSignin(message, signature as string);
        localStorage.setItem('jwt', token);
      } else {
        alert('MetaMask no está instalado. Por favor instálalo desde https://metamask.io');
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      className={isConnected ? 'btn-secondary' : 'btn-primary'}
      style={{
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '160px',
        justifyContent: 'center'
      }}
    >
      {isConnected ? (
        <>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
            }}
          />
          <span style={{ fontFamily: 'monospace' }}>
            {formatAddress(address!)}
          </span>
        </>
      ) : (
        <>
          <span>🦊</span>
          Conectar MetaMask
        </>
      )}
    </button>
  );
}
