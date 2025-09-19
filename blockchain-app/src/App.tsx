import { WalletButton } from './components/WalletButton'
import { FaucetCard } from './components/FaucetCard'
import { UserList } from './components/UserList'

function App() {
  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      {/* Header minimalista */}
      <header
        style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="fade-in-up">
          <h1 style={{ fontSize: '28px', margin: 0 }}>
            🚰 Faucet Token
          </h1>
        </div>
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '60px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div 
          className="fade-in-up" 
          style={{ 
            textAlign: 'center', 
            marginBottom: '60px',
            animationDelay: '0.4s'
          }}
        >
          <h2 style={{ 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Reclama tokens del faucet en Sepolia
          </h2>
          <p style={{ 
            color: 'var(--gray-medium)', 
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Conecta tu wallet y reclama 1,000,000 tokens FAUCET gratis
          </p>
        </div>

        {/* Grid de componentes */}
        <div
          style={{
            display: 'grid',
            gap: '40px',
            gridTemplateColumns: '1fr',
            alignItems: 'start',
          }}
        >
          <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
            <FaucetCard />
          </div>
          <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
            <UserList />
          </div>
        </div>

        {/* Footer minimalista */}
        <footer
          className="fade-in-up"
          style={{
            marginTop: '80px',
            padding: '32px',
            textAlign: 'center',
            color: 'var(--gray-medium)',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            animationDelay: '1s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <p style={{ margin: '8px 0' }}>
              💡 Necesitas ETH para gas? Obtén tokens de prueba en{' '}
              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sepolia Faucet
              </a>
            </p>
            <p style={{ margin: '8px 0' }}>
              🔗 Contrato desplegado en{' '}
              <a
                href="https://sepolia.etherscan.io/address/0x3E2117C19A921507EaD57494BbF29032F33C7412"
                target="_blank"
                rel="noopener noreferrer"
              >
                Etherscan
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
