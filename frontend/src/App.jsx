import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SelectBank from './pages/SelectBank';
import Loans from './pages/Loans';
import Companies from './pages/Companies';
import LoanDetail from './pages/LoanDetail';
import Simulator from './pages/Simulator';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/select-bank" element={<SelectBank />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/loans/:id" element={<LoanDetail />} />
      <Route path="/simulator" element={<Simulator />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;