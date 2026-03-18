import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">VizAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="/#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
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
  );
};

export default Navbar;
