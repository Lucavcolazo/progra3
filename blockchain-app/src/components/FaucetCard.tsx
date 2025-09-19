import { useFaucet } from '../hooks/useFaucet';
import { formatEther } from 'viem';

export function FaucetCard() {
  const {
    isConnected,
    userData,
    contractData,
    claimTokens,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useFaucet();

  const handleClaim = async () => {
    try {
      await claimTokens();
    } catch (err) {
      console.error('Error al reclamar tokens:', err);
    }
  };

  const formatTokenAmount = (amount: bigint) => {
    const formatted = formatEther(amount);
    return parseFloat(formatted).toLocaleString();
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-secondary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '24px'
      }}>
        🚰 Faucet Token
      </h2>

      {/* Información del contrato */}
      {contractData && (
        <div style={{ 
          marginBottom: '32px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ 
            color: 'var(--white)', 
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📊 Información del Token
          </h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Nombre:</span>
              <span style={{ color: 'var(--white)', fontWeight: '500' }}>{contractData.name}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Símbolo:</span>
              <span style={{ color: 'var(--white)', fontWeight: '500' }}>{contractData.symbol}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Total Supply:</span>
              <span style={{ color: 'var(--white)', fontWeight: '500' }}>
                {formatTokenAmount(contractData.totalSupply)} {contractData.symbol}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Cantidad por reclamo:</span>
              <span style={{ 
                color: 'var(--orange-primary)', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {formatTokenAmount(contractData.faucetAmount)} {contractData.symbol}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Información del usuario */}
      {isConnected && userData && (
        <div style={{ 
          marginBottom: '32px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ 
            color: 'var(--white)', 
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            👤 Tu Información
          </h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Balance:</span>
              <span style={{ color: 'var(--white)', fontWeight: '500' }}>
                {formatTokenAmount(userData.balance)} {contractData?.symbol}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0'
            }}>
              <span style={{ color: 'var(--gray-medium)' }}>Estado:</span>
              <span
                style={{
                  color: userData.hasClaimed ? '#ef4444' : '#22c55e',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: userData.hasClaimed 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${userData.hasClaimed ? '#ef4444' : '#22c55e'}`
                }}
              >
                {userData.hasClaimed ? 'Ya reclamaste' : 'Puedes reclamar'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botón de reclamar */}
      <div style={{ textAlign: 'center' }}>
        {!isConnected ? (
          <div style={{ 
            padding: '24px',
            background: 'rgba(255, 107, 53, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            marginBottom: '16px'
          }}>
            <p style={{ 
              color: 'var(--orange-primary)', 
              margin: 0,
              fontSize: '16px',
              fontWeight: '500'
            }}>
              🔗 Conecta tu wallet para reclamar tokens
            </p>
          </div>
        ) : userData?.hasClaimed ? (
          <div style={{ 
            padding: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            marginBottom: '16px'
          }}>
            <p style={{ 
              color: '#ef4444', 
              margin: 0,
              fontSize: '16px',
              fontWeight: '500'
            }}>
              ⚠️ Ya has reclamado tokens del faucet
            </p>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className="btn-primary"
            style={{
              padding: '16px 40px',
              fontSize: '16px',
              minWidth: '240px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isPending
              ? '⏳ Enviando transacción...'
              : isConfirming
              ? '⏳ Confirmando...'
              : isConfirmed
              ? '✅ ¡Tokens reclamados!'
              : '🚰 Reclamar Tokens'}
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}
        >
          ❌ Error: {error.message}
        </div>
      )}

      {/* Mensaje de éxito */}
      {isConfirmed && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}
        >
          🎉 ¡Tokens reclamados exitosamente!
        </div>
      )}
    </div>
  );
}
