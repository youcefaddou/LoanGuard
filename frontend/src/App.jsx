import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SelectBank from './pages/SelectBank';
import Loans from './pages/Loans'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/select-bank" element={<SelectBank />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Router>
  );
}

export default App;