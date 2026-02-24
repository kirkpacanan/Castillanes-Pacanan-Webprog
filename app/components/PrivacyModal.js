"use client";

import React from "react";

export default function PrivacyModal({ open, onClose }) {
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
      aria-labelledby="privacy-title"
    >
      <div className="glass w-full max-w-sm sm:max-w-md h-[55vh] sm:h-[60vh] md:h-[62vh] overflow-hidden rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <h2 id="privacy-title" className="text-lg font-semibold text-white">Privacy Policy</h2>
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
                <h3 className="text-sm font-semibold text-white/80">Overview</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  This Privacy Policy explains how Feelvie collects, uses, and discloses information when you use our service.
                  It also explains your rights and choices regarding your information.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Information We Collect</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  We may collect account information (such as username and email), usage data, and device identifiers to provide and
                  improve the service. We do not sell personal information to third parties.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">How We Use Data</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  <li>To operate and maintain the service.</li>
                  <li>To personalize content and recommendations.</li>
                  <li>To communicate updates, security notices, and support messages.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Your Choices</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  You may request access to or deletion of your personal information by contacting support. You can also manage certain
                  preferences in your account settings.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white/80">Security</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">We employ reasonable security measures to protect your information, but cannot guarantee absolute security.</p>
              </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
