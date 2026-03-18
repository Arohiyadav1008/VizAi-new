import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import UploadModal from './components/UploadModal';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (prompt) => {
    if (!currentDataset) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/query/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
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

export default App;
