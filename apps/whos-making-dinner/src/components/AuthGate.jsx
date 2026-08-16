import { useState } from 'react'
import { useData } from '../hooks/DataContext.jsx'
import { HOUSEHOLD_EMAIL } from '../utils/constants.js'
import { MEMBERS } from '../data/seed.js'
import Avatar from './common/Avatar.jsx'

/**
 * One household, one account. The family IS the account — no email typing,
 * just the shared password. Once in, the session persists (and refreshes)
 * so the app stays unlocked on this device.
 */
export default function AuthGate() {
  const { login, mode } = useData()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(HOUSEHOLD_EMAIL, password)
    } catch (err) {
      setError(
        err?.status === 400
          ? 'wrong password — try again'
          : 'can’t reach the kitchen server — check the connection and try again',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wmd-shell" style={{ paddingTop: '11vh' }}>
      <div className="wmd-stage" aria-hidden="true" />
      <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative' }}>
        <div className="wmd-wordmark" style={{ fontSize: '2.15rem' }}>
          who&rsquo;s making dinner<span className="q">?</span>
        </div>
        <div className="wmd-stripe" style={{ margin: '10px auto 0', width: 190, height: 7 }} aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>

      <form className="wmd-card" onSubmit={submit} style={{ display: 'grid', gap: 14, position: 'relative' }}>
        {/* the one and only account: the household */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {MEMBERS.map((m, i) => (
              <span key={m.name} style={{ marginLeft: i ? -8 : 0 }}>
                <Avatar name={m.name} index={i} size={40} />
              </span>
            ))}
          </div>
          <div style={{ fontWeight: 800, marginTop: 8 }}>the family account</div>
          <div className="wmd-muted" style={{ fontSize: '0.78rem' }}>
            one login for the whole table — pick who&rsquo;s cooking later
          </div>
        </div>

        {mode !== 'mock' && (
          <input
            className="wmd-input"
            type="password"
            placeholder="household password"
            value={password}
            autoComplete="current-password"
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        {error && (
          <div className="wmd-muted" style={{ color: 'var(--danger)' }}>
            {error}
          </div>
        )}
        <button className="wmd-btn" disabled={busy || (mode !== 'mock' && !password)}>
          {busy ? 'unlocking…' : mode === 'mock' ? 'enter the demo kitchen' : 'into the kitchen →'}
        </button>
      </form>

      <p className="wmd-muted" style={{ textAlign: 'center', marginTop: 14, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', position: 'relative' }}>
        filmed before a live studio audience
      </p>
      {mode === 'mock' && (
        <p className="wmd-muted" style={{ textAlign: 'center', marginTop: 6, position: 'relative' }}>
          demo mode — no password needed, just tap the button
        </p>
      )}
    </div>
  )
}
