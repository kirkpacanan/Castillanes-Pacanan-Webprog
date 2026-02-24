"use client";

import React from "react";

export default function TermsModal({ open, onClose }) {
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
      aria-labelledby="terms-title"
    >
      <div className="glass w-full max-w-sm sm:max-w-md h-[55vh] sm:h-[60vh] md:h-[62vh] overflow-hidden rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <h2 id="terms-title" className="text-lg font-semibold text-white">Terms of Service</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-white/50 hover:bg-slate-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 min-h-0">
          <div className="h-full mx-auto overflow-hidden rounded-xl bg-slate-900/30 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 modal-scroll">
              <div className="px-3 sm:px-5 py-3 space-y-5">
              <section>
                <h3 className="text-sm font-semibold text-white/80">Introduction</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  These Terms of Service ("Terms") govern your access to and use of the Feelvie service. By creating an account
                  or using the service you agree to be bound by these Terms. If you do not agree, do not use the service.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Use of Service</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Feelvie grants you a limited, non-exclusive, non-transferable license to access the service for personal, non-commercial purposes.
                  You agree not to misuse the service, attempt to reverse engineer it, or engage in behavior that interferes with other users.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">User Conduct</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  <li>Provide accurate information when creating your account.</li>
                  <li>Respect intellectual property rights and third-party content.</li>
                  <li>Do not engage in harmful, abusive, or illegal activities while using the service.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Disclaimer & Limitation of Liability</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The service is provided "as is" without warranties of any kind. To the fullest extent permitted by law, Feelvie
                  and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from
                  your use of the service.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Governing Law</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  These Terms are governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes
                  arising under these Terms will be resolved in the appropriate courts as set forth in the full Terms.
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
