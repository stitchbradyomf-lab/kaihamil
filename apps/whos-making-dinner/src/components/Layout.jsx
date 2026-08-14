import { useData } from '../hooks/DataContext.jsx'
import { TABS } from '../utils/constants.js'
import Avatar from './common/Avatar.jsx'
import OfflineBanner from './common/OfflineBanner.jsx'

export default function Layout({ tab, onNavigate, children }) {
  const { user, myMember, activeMembers, logout } = useData()
  const memberIndex = myMember
    ? Math.max(0, activeMembers.findIndex((m) => m.id === myMember.id))
    : 0

  return (
    <div className="wmd-shell">
      <header className="wmd-header">
        <div>
          <div className="wmd-wordmark">
            who&rsquo;s making dinner<span className="q">?</span>
          </div>
          <div className="wmd-stripe" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
        {user && (
          <button
            onClick={logout}
            title="sign out"
            style={{ border: 'none', background: 'transparent', padding: 0 }}
          >
            <Avatar name={myMember?.name ?? user.name} index={memberIndex} />
          </button>
        )}
      </header>

      <OfflineBanner />

      <main>{children}</main>

      <nav className="wmd-tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`wmd-tab ${t.id === tab ? 'active' : ''}`}
            onClick={() => onNavigate(t.id)}
          >
            <span className="emoji">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
