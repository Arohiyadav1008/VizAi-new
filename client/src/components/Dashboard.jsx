import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, LayoutDashboard, Search, Loader2 } from 'lucide-react';
import ChartContainer from './ChartContainer';
import { cn } from '../lib/utils';

const Dashboard = ({ dataset, queries, loading }) => {
  if (!dataset) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-8 bg-muted/30 rounded-full border border-border/50 shadow-inner">
          <LayoutDashboard className="w-16 h-16 text-muted-foreground opacity-20" />
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">No Active Workspace</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ready to dive into your data? Start by uploading a CSV file. Our AI will automatically detect headers and prepare your workspace.
          </p>
        </div>
        <button className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/90 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-accent/20">
          Explore Sample Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-black tracking-tight tracking-tighter">Analyzer</h1>
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">Enterprise</span>
          </div>
          <p className="text-muted-foreground font-medium">Currently analyzing: <span className="text-foreground">{dataset.name}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          {loading && (
            <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-2 text-accent text-sm font-bold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Query...
            </div>
          )}
          <div className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            Active Session
          </div>
        </div>
      </header>

      {/* Dynamic Dashboard Grid */}
      {queries.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          <div className="lg:col-span-3 p-12 bg-card border border-border/50 rounded-3xl border-dashed flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-xl font-bold">Ask your first question</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Type something like "How many rows are in this dataset?" or "Summarize the sales by month" in the sidebar.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {queries.map((q, idx) => (
            <div 
              key={q._id || idx} 
              className={cn(
                "p-6 bg-card border border-border rounded-3xl h-[480px] flex flex-col shadow-sm transition-all hover:shadow-xl hover:shadow-accent/5 hover:border-accent/20 group",
                idx === 0 && "lg:col-span-2"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-xl group-hover:text-accent transition-colors">{q.response.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Ref: {q.prompt}</p>
                </div>
                <div className="flex items-center gap-2 self-start ring-1 ring-border p-1 rounded-lg">
                   <div className="px-2 py-1 bg-muted rounded-md text-[10px] uppercase font-bold tracking-tighter">
                     {q.response.chartType}
                   </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ChartContainer 
                  type={q.response.chartType} 
                  data={q.response.chartData}
                  metrics={q.response.metrics}
                  dimensions={q.response.dimensions}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
