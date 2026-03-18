import React, { useState } from 'react';
import { MessageSquare, History, Upload, Plus, Send, FileText, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = ({ currentDataset, onDatasetSelect, onUploadClick, queries, onQuerySubmit, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onQuerySubmit(query);
      setQuery('');
    }
  };

  return (
    <aside className="w-80 border-r border-border bg-card flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          VizAI
        </h1>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Plus className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Dataset Selection */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Datasets
          </h3>
          <button 
            onClick={onUploadClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border hover:border-accent/40 hover:bg-accent/5 transition-all group mb-2"
          >
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Upload CSV</span>
          </button>
          
          {currentDataset && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <FileText className="w-5 h-5 text-accent" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentDataset.name}</p>
                <p className="text-xs text-muted-foreground tracking-tight">{currentDataset.columns.length} columns detected</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="flex flex-col border border-border rounded-2xl bg-muted/20 overflow-hidden shadow-inner">
          <div className="bg-muted/40 p-2 text-[10px] font-bold text-center border-b border-border text-muted-foreground uppercase tracking-widest">
            AI Data Assistant
          </div>
          <div className="h-48 p-3 space-y-3 overflow-y-auto text-sm custom-scrollbar bg-gradient-to-b from-transparent to-muted/10">
            {queries.length === 0 ? (
              <div className="bg-card p-3 rounded-2xl rounded-tl-none border border-border text-muted-foreground italic">
                {currentDataset ? "I'm ready. What would you like to know about this data?" : "Upload a dataset to start the conversation."}
              </div>
            ) : (
              [...queries].reverse().map((q, i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-accent/10 p-2.5 rounded-2xl rounded-tr-none border border-accent/20 text-xs ml-4">
                    {q.prompt}
                  </div>
                  <div className="bg-card p-2.5 rounded-2xl rounded-tl-none border border-border text-xs mr-4">
                    {q.response.title}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 p-3 text-muted-foreground animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-2 bg-card border-t border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me anything..."
                disabled={!currentDataset}
                className="w-full bg-muted/50 border border-border rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!query.trim() || !currentDataset || loading}
                className="absolute right-1 top-1 bottom-1 px-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all disabled:opacity-0 shadow-lg shadow-accent/20"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Query History */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            History
          </h3>
          <div className="space-y-1">
            {queries.slice(0, 5).map((q, i) => (
              <button key={i} className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 group">
                <History className="w-3.5 h-3.5 shrink-0 group-hover:text-accent transition-colors" />
                <span className="truncate">{q.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Account</p>
            <p className="text-xs text-muted-foreground">Admin Access</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
