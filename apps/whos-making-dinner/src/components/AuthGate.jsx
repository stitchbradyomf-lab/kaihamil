import { useState } from 'react'
import { useData } from '../hooks/DataContext.jsx'

export default function AuthGate() {
  const { login, mode } = useData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
    } catch {
      setError("that didn't work — check your email and password")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wmd-shell" style={{ paddingTop: '13vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="wmd-wordmark" style={{ fontSize: '2.15rem' }}>
          who&rsquo;s making dinner<span className="q">?</span>
        </div>
        <div className="wmd-stripe" style={{ margin: '10px auto 0', width: 190, height: 7 }} aria-hidden="true">
          <span /><span /><span />
        </div>
        <p className="wmd-muted" style={{ marginTop: 12 }}>
          the nightly question, finally answered
        </p>
      </div>
      <form className="wmd-card" onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <input
          className="wmd-input"
          type="email"
          placeholder="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="wmd-input"
          type="password"
          placeholder="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="wmd-muted" style={{ color: 'var(--danger)' }}>
            {error}
          </div>
        )}
        <button className="wmd-btn" disabled={busy || (!email && mode !== 'mock')}>
          {busy ? 'signing in…' : mode === 'mock' ? 'enter the demo kitchen' : 'sign in'}
        </button>
      </form>
      <p className="wmd-muted" style={{ textAlign: 'center', marginTop: 14, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        filmed before a live studio audience
      </p>
      {mode === 'mock' && (
        <p className="wmd-muted" style={{ textAlign: 'center', marginTop: 6 }}>
          demo mode — no real account needed, just tap the button
        </p>
      )}
    </div>
  )
}
