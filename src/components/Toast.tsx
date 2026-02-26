"use client";

import { useState, useEffect } from "react";

export interface ToastData {
  id: number;
  type: "success" | "error" | "loading";
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onClose: (id: number) => void;
}

export function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        const bg = toast.type === "success" ? "bg-emerald-600" : toast.type === "error" ? "bg-red-600" : "bg-neutral-800";
        const Icon = () => {
          if (toast.type === 'success') return <svg className="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
          if (toast.type === 'error') return <svg className="w-5 h-5 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
          return <div className="w-4 h-4 border-2 border-neutral-300 border-t-white rounded-full animate-spin"></div>;
        };

        return (
          <div
            key={toast.id}
            className={`${bg} text-white p-4 rounded-xl shadow-lg flex items-start gap-3 transition-all duration-300 animate-slide-in-up`}
          >
            <div className="flex-shrink-0 mt-0.5"><Icon /></div>
            <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
            <button onClick={() => onClose(toast.id)} className="flex-shrink-0 text-white/70 hover:text-white ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// 需要在 globals.css 中添加简单的动画
// @keyframes slide-in-up {
//   from { transform: translateY(20px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }
// .animate-slide-in-up { animation: slide-in-up 0.3s ease-out; }