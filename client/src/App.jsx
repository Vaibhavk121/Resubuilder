import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import CreateResumePage from './pages/CreateResumePage';
import ViewResumePage from './pages/ViewResumePage';
import ViewResume from './components/resume/ViewResume';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/create-resume" 
            element={
              <PrivateRoute>
                <CreateResumePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit-resume/:id" 
            element={
              <PrivateRoute>
                <CreateResumePage />
              </PrivateRoute>
            } 
          />
          <Route path="/view-resume/:id" element={<ViewResume />} />
          <Route path="/create-resume" element={<PrivateRoute><CreateResumePage /></PrivateRoute>} />
          <Route path="/view-resume/:shareToken" element={<ViewResumePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
