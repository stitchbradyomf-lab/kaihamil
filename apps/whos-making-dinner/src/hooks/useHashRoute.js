import { useEffect, useState } from 'react'
import { TABS } from '../utils/constants.js'

const DEFAULT_TAB = 'tonight'
const VALID = new Set(TABS.map((t) => t.id))

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return VALID.has(raw) ? raw : DEFAULT_TAB
}

export function useHashRoute() {
  const [tab, setTab] = useState(readHash)

  useEffect(() => {
    const onHash = () => setTab(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (id) => {
    window.location.hash = `/${id}`
  }

  return [tab, navigate]
}
