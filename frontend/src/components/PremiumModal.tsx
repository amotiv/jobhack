import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import api from "../lib/api";
import { Crown, Star, Zap } from "lucide-react";

export default function PremiumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const upgrade = async () => {
    try {
      const { data } = await api.post("/billing/checkout-session/");
      if (data?.url) window.location.href = data.url;
    } catch (e:any) {
      alert(e?.response?.data?.detail || "Upgrade failed");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <motion.div
            role="dialog" 
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl border bg-white dark:bg-black dark:border-white/10 shadow-soft overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Crown size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Unlock Premium Features</h2>
              <p className="text-amber-100 text-sm">
                Get the most out of your job search
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Job Sorting</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sort jobs by match percentage to find the best opportunities first</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Detailed Insights</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">See exact match percentages and keyword matches for every job</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$9.99</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={onClose} 
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={upgrade} 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Upgrade Now
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cancel anytime. No commitment required.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
