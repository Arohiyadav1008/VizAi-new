import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import UploadModal from './components/UploadModal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';


// The main authenticated layout containing sidebar and dashboard
function DashboardLayout() {
  const [currentDataset, setCurrentDataset] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (prompt) => {
    if (!currentDataset) return;
    setLoading(true);
      // The backend route is /api/query, not /api/query/process
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt, datasetId: currentDataset._id })
      });

      const data = await response.json();
      setQueries([data, ...queries]);
    } catch (err) {
      console.error("Query failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar 
          currentDataset={currentDataset} 
          onDatasetSelect={setCurrentDataset} 
          onUploadClick={() => setIsUploadModalOpen(true)}
          queries={queries}
          onQuerySubmit={handleQuerySubmit}
          loading={loading}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <Dashboard 
            dataset={currentDataset} 
            queries={queries} 
            loading={loading}
          />
        </main>
      </div>


      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(dataset) => {
          setCurrentDataset(dataset);
          setQueries([]); // Reset queries for new dataset
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
