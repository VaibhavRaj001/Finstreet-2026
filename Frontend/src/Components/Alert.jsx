import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Alert = ({ isOpen, type, message, onClose }) => {
  const isSuccess = type === "success";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-sm rounded-2xl border bg-[#1a1a1d] p-6 shadow-2xl overflow-hidden ${
              isSuccess ? "border-green-500/20" : "border-red-500/20"
            }`}
          >
            {/* Background Glow Effects */}
            <div
              className={`absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl pointer-events-none ${
                isSuccess ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            />
            <div
              className={`absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl pointer-events-none ${
                isSuccess ? "bg-green-500/5" : "bg-red-500/5"
              }`}
            />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div
                className={`p-4 rounded-full ${
                  isSuccess
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle size={48} />
                ) : (
                  <AlertCircle size={48} />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {isSuccess ? "Success!" : "Something went wrong"}
                </h3>
                <p className="text-white/60 font-light">{message}</p>
              </div>
              <button
                onClick={onClose}
                className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-all active:scale-95 ${
                  isSuccess
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
                    : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                }`}
              >
                {isSuccess ? "Continue" : "Try Again"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Alert;
