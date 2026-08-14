import { DataProvider, useData } from './hooks/DataContext.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import AuthGate from './components/AuthGate.jsx'
import Layout from './components/Layout.jsx'
import Tonight from './components/tonight/Tonight.jsx'
import History from './components/history/History.jsx'
import MealLibrary from './components/meals/MealLibrary.jsx'
import PlanAhead from './components/plan/PlanAhead.jsx'
import ShoppingList from './components/shopping/ShoppingList.jsx'

const VIEWS = {
  tonight: Tonight,
  history: History,
  meals: MealLibrary,
  plan: PlanAhead,
  shopping: ShoppingList,
}

function Shell() {
  const { user, loading } = useData()
  const [tab, navigate] = useHashRoute()

  if (!user) return <AuthGate />

  const View = VIEWS[tab] ?? Tonight

  return (
    <Layout tab={tab} onNavigate={navigate}>
      {loading ? (
        <div className="wmd-empty">
          <div className="big">📺</div>
          rolling the opening credits…
        </div>
      ) : (
        <View />
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <DataProvider>
      <Shell />
    </DataProvider>
  )
}
