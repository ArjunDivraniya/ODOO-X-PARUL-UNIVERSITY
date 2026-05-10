import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0A1622] border border-white/10 rounded-[24px] shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-lg font-heading font-bold text-secondary-bg">{title}</h3>
                <button onClick={onCancel} className="p-2 text-neutral-text hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <LuX className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-neutral-text">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 text-neutral-text hover:text-white rounded-[12px] text-sm font-medium transition-colors"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-[12px] text-sm font-semibold transition-colors"
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
