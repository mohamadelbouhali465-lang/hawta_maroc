import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification, language } = useAppContext();
  const isRTL = language === 'العربية';

  return (
    <div className={`fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-[100] flex flex-col gap-2 pointer-events-none ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-lg shadow-xl border min-w-[300px] ${
              n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              n.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {n.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {n.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
            
            <p className="text-sm font-medium flex-grow">{n.message}</p>
            
            <button 
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
