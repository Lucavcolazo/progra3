import { useAccount, useDisconnect } from 'wagmi';

export function WalletButton() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Abrir MetaMask directamente
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' });
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
