import React from 'react'
import Homepage from './pages/Homepage'
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackendPanel from './pages/BackendPanel';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './pages/NotFound';
import SalesProfilePage from './pages/SalesProfile';
import OperationalProfilePage from './pages/OperationalPage';

const App = () => {
  return (
    <Router>
      <Toaster/>
      <Routes>
      <Route 
    path="/login" 
    element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    } 
  />     
   <Route 
          path="/" 
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <Homepage/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sales/profile" 
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <SalesProfilePage/>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/operational/profile" 
          element={
            <ProtectedRoute allowedRoles={['operational']}>
              <OperationalProfilePage/>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/internal-user" 
          element={
            <ProtectedRoute allowedRoles={['management']}>
              <BackendPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  )
}

export default App