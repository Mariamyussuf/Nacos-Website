import React, { useState, useCallback, useContext, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto px-5 py-3.5 rounded-2xl border backdrop-blur-xl text-sm font-semibold flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-sm ${
                toast.type === "success"
                  ? "bg-[#0CCF00]/10 border-[#0CCF00]/25 text-[#0CCF00]"
                  : toast.type === "error"
                  ? "bg-[#FF2D6B]/10 border-[#FF2D6B]/25 text-[#FF2D6B]"
                  : "bg-[#111111]/90 border-white/10 text-white/80"
              }`}
            >
              <i
                className={`ti text-base ${
                  toast.type === "success"
                    ? "ti-circle-check"
                    : toast.type === "error"
                    ? "ti-alert-circle"
                    : "ti-info-circle"
                }`}
              />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
