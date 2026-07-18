import type { MouseEvent, ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {
  function stop(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={stop}
      >
        {children}
      </div>
    </div>
  );
}
