import { useData } from '../../hooks/DataContext.jsx'
import Chip from './Chip.jsx'

export default function PrepMethodChips({ value, onChange }) {
  const { taxonomyByKind } = useData()
  const methods = taxonomyByKind.prep_method ?? []

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {methods.map((m) => (
        <Chip key={m.id} selected={value === m.id} onClick={() => onChange(m.id)}>
          <span>{m.metadata?.emoji}</span> {m.label}
        </Chip>
      ))}
    </div>
  )
}
