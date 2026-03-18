import React from 'react';
import { BarChart3, Zap, Database, Brain, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">VizAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            {user ? (
              <Link 
                to="/dashboard"
                className="px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-semibold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                <Link 
                  to="/signup"
                  className="px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-semibold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide">
              Revolutionizing BI with AI
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Turn Your Data Into <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent italic">
              Dashboard Conversations
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Empower your team to ask business questions in plain English and get 
            instant, beautiful, interactive dashboards. No SQL, no complexity, just insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to={user ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto px-10 py-4 bg-accent text-accent-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-accent/30"
            >
              {user ? "Go to Dashboard" : "Start for Free"} <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Play className="w-5 h-5 fill-current" /> Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Natural Language Queries', 
                desc: 'Ask questions like "What are our top regions by revenue?" and get instant charts.',
                icon: Brain,
                color: 'text-blue-500'
              },
              { 
                title: 'Smart Visualization', 
                desc: 'Our AI automatically selects the best chart type for your data—from heatmaps to line graphs.',
                icon: Zap,
                color: 'text-amber-500'
              },
              { 
                title: 'Instant Integration', 
                desc: 'Upload CSVs or connect your database. VizAI maps your schema automatically.',
                icon: Database,
                color: 'text-emerald-500'
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group">
                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-accent/10 group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold">VizAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 VizAI Technologies. Built for the future of BI.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
