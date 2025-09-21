import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import ToggleTheme from "./ToggleTheme";

export default function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(40%_60%_at_70%_0%,#eef2ff,transparent),linear-gradient(#fff,#fafafa)] dark:bg-[linear-gradient(#0b0b0c,#0f1115)] text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/30 border-b border-black/5 dark:border-white/10">
        <div className="container-responsive h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-semibold tracking-tight flex items-center gap-2 text-lg sm:text-xl">
            <Briefcase size={20} className="sm:w-5 sm:h-5"/> 
            <span className="hidden sm:inline">JobHack</span>
            <span className="sm:hidden">JH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:opacity-80 transition-opacity">Jobs</Link>
            <Link to="/upload" className="hover:opacity-80 transition-opacity">Resume</Link>
          </div>

          {/* Right side - Auth & Theme */}
          <div className="flex items-center gap-3">
            <Link to="/register" className="hidden sm:inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              Sign Up
            </Link>
            <Link to="/login" className="hidden sm:inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <LogIn size={16}/> Login
            </Link>
            <ToggleTheme />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur"
            >
              <div className="container-responsive py-4 space-y-3">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:opacity-80 transition-opacity"
                >
                  Jobs
                </Link>
                <Link 
                  to="/upload" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:opacity-80 transition-opacity"
                >
                  Resume
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:opacity-80 transition-opacity"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <LogIn size={16}/> Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="container-responsive py-4 sm:py-6 lg:py-8">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.1 } }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/10">
        <div className="container-responsive">
          © {new Date().getFullYear()} JobHack
        </div>
      </footer>
    </div>
  );
}
