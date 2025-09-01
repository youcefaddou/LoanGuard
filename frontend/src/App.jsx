import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Pages critiques (chargées directement)
import Login from './pages/Login';
import SelectBank from './pages/SelectBank';

// Pages lazy (chargées à la demande)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Loans = lazy(() => import('./pages/Loans'));
const Companies = lazy(() => import('./pages/Companies'));
const LoanDetail = lazy(() => import('./pages/LoanDetail'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Settings = lazy(() => import('./pages/Settings'));

// Composant de loading simple
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/select-bank" element={<SelectBank />} />
      <Route path="/dashboard" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      } />
      <Route path="/loans" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Loans />
        </Suspense>
      } />
      <Route path="/companies" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Companies />
        </Suspense>
      } />
      <Route path="/loans/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoanDetail />
        </Suspense>
      } />
      <Route path="/simulator" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Simulator />
        </Suspense>
      } />
      <Route path="/alerts" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Alerts />
        </Suspense>
      } />
      <Route path="/settings" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Settings />
        </Suspense>
      } />
    </Routes>
  );
}

export default App;