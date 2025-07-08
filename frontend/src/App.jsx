import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SelectBank from './pages/SelectBank';
import Loans from './pages/Loans';
import Companies from './pages/Companies';
import LoanDetail
 from './pages/LoanDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/select-bank" element={<SelectBank />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/loans/:id" element={<LoanDetail />} />
      </Routes>
    </Router>
  );
}

export default App;