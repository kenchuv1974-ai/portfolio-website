import { AnimatePresence, motion } from 'framer-motion';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

export default function ToastNotification({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className={`pointer-events-auto rounded-lg p-3.5 shadow-2xl backdrop-blur-xl border flex items-start gap-3 text-sm ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/50'
                : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-100 shadow-black/60'
            }`}
          >
            <span className="text-lg leading-none mt-0.5">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <div className="flex-1">
              {t.title && <div className="font-semibold text-xs tracking-wider uppercase mb-0.5">{t.title}</div>}
              <div>{t.message}</div>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-xs opacity-60 hover:opacity-100 px-1 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
