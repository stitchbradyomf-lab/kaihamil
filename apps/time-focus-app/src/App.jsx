import { useState } from 'react';
import AuthGate from './components/AuthGate.jsx';
import Layout from './components/Layout.jsx';
import DailyEntry from './components/DailyEntry.jsx';
import WeeklyView from './components/WeeklyView.jsx';
import MonthlyView from './components/MonthlyView.jsx';
import QuarterlyView from './components/QuarterlyView.jsx';
import ReportingDashboard from './components/ReportingDashboard.jsx';
import GoodDayFramework from './components/GoodDayFramework.jsx';

export default function App() {
  const [tab, setTab] = useState('daily');

  return (
    <AuthGate>
      <Layout activeTab={tab} onTabChange={setTab}>
        {tab === 'daily'     && <DailyEntry />}
        {tab === 'weekly'    && <WeeklyView />}
        {tab === 'monthly'   && <MonthlyView />}
        {tab === 'quarterly' && <QuarterlyView />}
        {tab === 'framework' && <GoodDayFramework />}
        {tab === 'reports'   && <ReportingDashboard />}
      </Layout>
    </AuthGate>
  );
}
