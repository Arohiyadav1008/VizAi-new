import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // The backend route is /api/upload, not /api/upload/csv
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }


      const data = await response.json();
      onUploadSuccess(data);
      onClose();
    } catch (err) {
      setError('Failed to upload dataset. Ensure the server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              Upload Dataset
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            {!file ? (
              <div 
                className={cn(
                  "border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer group",
                  error && "border-red-500/50 bg-red-500/5"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Drop your CSV here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="bg-muted/50 border border-border rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-muted/30 flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-6 py-3 border border-border rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-[2] px-6 py-3 bg-accent text-accent-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Upload'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadModal;
