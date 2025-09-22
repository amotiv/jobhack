import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus, User, Lock, Mail } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register/", { username, email, password });
      toast.success("Account created successfully! Please sign in.");
      window.location.href = "/login";
    } catch (e: any) {
      const error = e?.response?.data;
      if (error?.username) {
        toast.error("Username already exists");
      } else if (error?.email) {
        toast.error("Email already exists");
      } else {
        toast.error("Registration failed. Please try again.");
      }
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
            <UserPlus size={24} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="heading-responsive font-bold tracking-tight">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-responsive">
            Join JobHack to find your perfect job match
          </p>
        </div>

        {/* Registration Form */}
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
                  placeholder="Choose a username"
                  value={username} 
                  onChange={e=>setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  id="email"
                  type="email"
                  className="w-full border rounded-xl pl-10 pr-3 py-3 dark:bg-black dark:border-white/10 text-sm focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all" 
                  placeholder="Enter your email"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)}
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
                  placeholder="Create a password" 
                  type="password"
                  value={password} 
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  id="confirmPassword"
                  className="w-full border rounded-xl pl-10 pr-3 py-3 dark:bg-black dark:border-white/10 text-sm focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all" 
                  placeholder="Confirm your password" 
                  type="password"
                  value={confirmPassword} 
                  onChange={e=>setConfirmPassword(e.target.value)}
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-black dark:text-white hover:opacity-80 transition-opacity">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}



