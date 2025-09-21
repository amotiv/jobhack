import { useState } from "react";
import api from "../lib/api";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn, User, Lock } from "lucide-react";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      toast.success("Signed in successfully");
      window.location.href = "/";
    } catch { 
      toast.error("Login failed. Please check your credentials."); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="heading-responsive font-bold tracking-tight">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-responsive">
            Sign in to access your personalized job recommendations
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="w-full space-y-4 border rounded-2xl p-6 sm:p-8 bg-white dark:bg-black dark:border-white/10 shadow-soft">
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  id="username"
                  className="w-full border rounded-xl pl-10 pr-3 py-3 dark:bg-black dark:border-white/10 text-sm focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all" 
                  placeholder="Enter your username"
                  value={username} 
                  onChange={e=>setU(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  id="password"
                  className="w-full border rounded-xl pl-10 pr-3 py-3 dark:bg-black dark:border-white/10 text-sm focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all" 
                  placeholder="Enter your password" 
                  type="password"
                  value={password} 
                  onChange={e=>setP(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Demo Info */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo: Use any username/password to test
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
