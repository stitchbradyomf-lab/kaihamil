const TABS = [
  { key: 'daily',    label: 'Daily' },
  { key: 'weekly',   label: 'Weekly' },
  { key: 'monthly',  label: 'Monthly' },
  { key: 'quarterly',label: 'Quarterly' },
  { key: 'reports',  label: 'Reports' },
];

export default function Layout({ activeTab, onTabChange, children }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-cream)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-sm font-medium py-3 pr-4 shrink-0" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--brown-dark)' }}>
              Time &amp; Focus
            </span>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors"
                style={{
                  borderColor: activeTab === tab.key ? 'var(--gold)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--gold)' : 'var(--brown-mid)',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
