import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useToastStore } from '../../store/toastStore';

const ToastItem = ({ toast, isLeaving, onExited }) => {
  const ref = useRef(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || enteredRef.current) return;
    enteredRef.current = true;

    gsap.fromTo(
      el,
      { y: 14, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'power3.out' }
    );
  }, [toast.id]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isLeaving) return;

    const tween = gsap.to(el, {
      y: 8,
      opacity: 0,
      scale: 0.98,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => onExited(toast.id),
    });

    return () => tween.kill();
  }, [isLeaving, onExited, toast.id]);

  return (
    <div ref={ref} className="max-w-sm w-full bg-neutral-900/95 border border-white/10 rounded-lg p-3 text-sm text-white shadow-lg flex items-start gap-3">
      <div className="flex-1">
        <div className="font-medium">{toast.title || 'Notification'}</div>
        <div className="text-neutral-300 text-xs mt-1">{toast.message}</div>
      </div>
      {toast.actionLabel && (
        <button
          onClick={() => {
            try {
              toast.onAction && toast.onAction();
            } catch (e) {
              // ignore
            }
            useToastStore.getState().removeToast(toast.id);
          }}
          className="text-xs px-2 py-1 rounded bg-white/5 text-cyan-300 hover:bg-white/10"
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);
  const [visibleToasts, setVisibleToasts] = useState([]);

  useEffect(() => {
    setVisibleToasts((prev) => {
      const incomingById = new Map(toasts.map((t) => [t.id, t]));
      const next = prev.map((item) => {
        const latest = incomingById.get(item.id);
        if (latest) return { ...item, ...latest, isLeaving: false };
        return item.isLeaving ? item : { ...item, isLeaving: true };
      });

      toasts.forEach((t) => {
        if (!prev.some((p) => p.id === t.id)) {
          next.push({ ...t, isLeaving: false });
        }
      });

      return next;
    });
  }, [toasts]);

  const handleExited = (id) => {
    setVisibleToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-3 pointer-events-none">
      {visibleToasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} isLeaving={Boolean(t.isLeaving)} onExited={handleExited} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
