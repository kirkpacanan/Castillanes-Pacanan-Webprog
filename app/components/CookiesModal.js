"use client";

import React from "react";

export default function CookiesModal({ open, onClose }) {
  if (!open) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookies-title"
    >
      <div className="glass w-full max-w-sm sm:max-w-md h-[55vh] sm:h-[60vh] md:h-[62vh] overflow-hidden rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <h2 id="cookies-title" className="text-lg font-semibold text-white">
            Cookies Policy
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-white/50 hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 min-h-0">
          <div className="h-full mx-auto overflow-hidden rounded-xl bg-slate-900/30 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 modal-scroll">
              <div className="px-3 sm:px-5 py-3 space-y-5">
                <section>
                  <h3 className="text-sm font-semibold text-white/80">Overview</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    This Cookies Policy explains how Feelvie uses cookies and similar technologies to recognize you
                    when you visit our service. It explains what these technologies are and why we use them.
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/80">Types of Cookies</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                    <li>Essential cookies required for core functionality.</li>
                    <li>Analytics cookies to understand usage and improve the experience.</li>
                    <li>Preference cookies that remember your settings.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/80">Your Choices</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    You can manage cookie preferences in your browser settings. Disabling certain cookies may
                    impact the functionality of the service.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
