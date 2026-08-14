import { useData } from '../../hooks/DataContext.jsx'

export default function OfflineBanner() {
  const { offline, reload } = useData()
  if (!offline) return null
  return (
    <div className="wmd-offline">
      ⚠️ kitchen&rsquo;s offline — showing the last saved data.{' '}
      <button
        onClick={reload}
        style={{
          border: 'none',
          background: 'transparent',
          textDecoration: 'underline',
          fontWeight: 800,
          padding: 0,
          color: 'inherit',
        }}
      >
        retry
      </button>
    </div>
  )
}
