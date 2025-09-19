import { useFaucet } from '../hooks/useFaucet';

export function UserList() {
  const { contractData, userData } = useFaucet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!contractData || contractData.faucetUsers.length === 0) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h3 style={{ 
          color: 'var(--white)', 
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          👥 Usuarios del Faucet
        </h3>
        <div style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <p style={{ 
            color: 'var(--gray-medium)',
            fontSize: '16px',
            margin: 0
          }}>
            Aún no hay usuarios que hayan reclamado tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h3 style={{ 
        color: 'var(--white)', 
        marginBottom: '24px',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        👥 Usuarios del Faucet ({contractData.faucetUsers.length})
      </h3>
      
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {contractData.faucetUsers.map((address, index) => (
          <div
            key={address}
            style={{
              padding: '16px 20px',
              borderBottom: index < contractData.faucetUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: address === userData?.address 
                ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 140, 66, 0.1) 100%)'
                : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--white)',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }}
              >
                {index + 1}
              </div>
              <div>
                <div style={{ 
                  color: 'var(--white)', 
                  fontSize: '15px', 
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>
                  {formatAddress(address)}
                </div>
                {address === userData?.address && (
                  <div style={{ 
                    color: 'var(--orange-primary)', 
                    fontSize: '12px',
                    fontWeight: '500',
                    marginTop: '2px'
                  }}>
                    (Tú)
                  </div>
                )}
              </div>
            </div>
            
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22c55e',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ✅ Reclamado
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '24px', 
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <p style={{ 
          margin: '0 0 12px 0',
          fontSize: '14px', 
          color: 'var(--gray-medium)',
          lineHeight: '1.5'
        }}>
          💡 Cada usuario puede reclamar tokens una sola vez
        </p>
        <p style={{ 
          margin: 0,
          fontSize: '14px', 
          color: 'var(--gray-medium)'
        }}>
          🔗 Ver contrato en{' '}
          <a
            href={`https://sepolia.etherscan.io/address/${contractData.owner}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Etherscan
          </a>
        </p>
      </div>
    </div>
  );
}
