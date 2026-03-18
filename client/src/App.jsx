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


import { toast } from 'react-hot-toast';

// The main authenticated layout containing sidebar and dashboard
function DashboardLayout() {
  const [currentDataset, setCurrentDataset] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setDatasets(data);
        // Auto-select first dataset if none selected
        if (!currentDataset && data.length > 0) {
          setCurrentDataset(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch datasets", err);
    }
  };

  const fetchQueries = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/query?datasetId=${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setQueries(data);
      }
    } catch (err) {
      console.error("Failed to fetch queries", err);
    }
  };

  React.useEffect(() => {
    fetchDatasets();
  }, []);

  React.useEffect(() => {
    if (currentDataset?._id) {
      fetchQueries(currentDataset._id);
    } else {
      setQueries([]);
    }
  }, [currentDataset?._id]);


  const handleQuerySubmit = async (prompt) => {
    if (!currentDataset) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt, datasetId: currentDataset._id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Query failed');
      setQueries([data, ...queries]);
    } catch (err) {
      toast.error(err.message || 'Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success("Dataset deleted");
        setDatasets(datasets.filter(d => d._id !== id));
        if (currentDataset?._id === id) {
          setCurrentDataset(null);
          setQueries([]);
        }
      }
    } catch (err) {
      toast.error("Failed to delete dataset");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar 
          datasets={datasets}
          currentDataset={currentDataset} 
          onDatasetSelect={setCurrentDataset} 
          onDatasetDelete={handleDeleteDataset}
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
          setDatasets([...datasets, dataset]);
          setCurrentDataset(dataset);
          setQueries([]);
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
