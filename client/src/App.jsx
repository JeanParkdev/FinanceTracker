import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Goals from './pages/Goals.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '2rem' }}>
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Layout><Transactions /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/budgets" element={
          <ProtectedRoute>
            <Layout><Budgets /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <Layout><Goals /></Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;