"use client";

import { useState, useEffect, useRef } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openBubble, setOpenBubble] = useState(null); // null | "before" | "helps"
  const beforeRef = useRef(null);
  const helpsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openBubble &&
        beforeRef.current && !beforeRef.current.contains(e.target) &&
        helpsRef.current && !helpsRef.current.contains(e.target)
      ) {
        setOpenBubble(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openBubble]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputFieldClass = "flex flex-col gap-1.5";
  const labelClass =
    "text-sm font-medium text-white/90";
  const inputClass =
    "feelvie-input w-full min-w-0 rounded-xl border border-[#444444] bg-[#252525] px-4 py-3 text-base text-white placeholder:text-white/40 outline-none transition-all duration-300 ease-out hover:border-white/40 hover:bg-[#323232] focus:ring-2 focus:bg-[#2a2a2a]";

  return (
    <div
      className="feelvie-page relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#350A0A]"
    >
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>

      {/* Hero */}
      <section className="relative z-10 -mt-8 sm:-mt-10 md:-mt-12 pb-4 sm:pb-6 md:pb-8 left-1/2 -translate-x-1/2 px-0 w-[110vw] sm:w-[108vw] md:w-[105vw] max-w-none">
        <div className="w-full">
          <div className="contact-pill-hover">
            <div
              className="contact-hero-drop flex flex-col items-center justify-center rounded-[80px] sm:rounded-[120px] md:rounded-[195px] bg-[#05050A] px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8 md:pt-14 md:pb-10 lg:pt-16 lg:pb-12"
            >
              <h1 className="feelvie-title text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[150%] text-white drop-shadow">
                Contact us
                <br />
                <span className="font-semibold text-white/80">We would love to hear from you.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form: centered, floating notification circles */}
      <section className="relative z-20 flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 md:pb-24">
        <div className="relative flex min-h-[420px] w-full max-w-5xl flex-col items-center justify-center pt-16 lg:pt-0 xl:max-w-6xl">
          {/* Floating bubble: Before you send (left) */}
          <div ref={beforeRef} className="contact-bubble contact-bubble-left">
            <button
              type="button"
              onClick={() => setOpenBubble((v) => (v === "before" ? null : "before"))}
              className="contact-bubble-circle contact-bubble-circle-left"
              aria-expanded={openBubble === "before"}
              aria-label="Before you send - tips"
            >
              <span className="contact-bubble-dot" />
              <svg className="h-5 w-5 text-white/90 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {openBubble === "before" && (
              <div className="contact-bubble-card contact-bubble-card-left">
                <div className="feelvie-card flex flex-col gap-5 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Before you send</p>
                    <button type="button" onClick={() => setOpenBubble(null)} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors" aria-label="Close">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="feelvie-chip px-3 py-1.5 text-xs font-semibold">Support</span>
                    <span className="feelvie-chip px-3 py-1.5 text-xs font-semibold">Feedback</span>
                    <span className="feelvie-chip px-3 py-1.5 text-xs font-semibold">Collaboration</span>
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-white/75">
                    <p>Share your goal and the mood you are exploring so we can respond faster.</p>
                    <p>We read every message and keep your information private.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating bubble: What helps us most (right) */}
          <div ref={helpsRef} className="contact-bubble contact-bubble-right">
            <button
              type="button"
              onClick={() => setOpenBubble((v) => (v === "helps" ? null : "helps"))}
              className="contact-bubble-circle contact-bubble-circle-right"
              aria-expanded={openBubble === "helps"}
              aria-label="What helps us most - tips"
            >
              <span className="contact-bubble-dot" />
              <svg className="h-5 w-5 text-white/90 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
            {openBubble === "helps" && (
              <div className="contact-bubble-card contact-bubble-card-right">
                <div className="feelvie-card flex flex-col gap-5 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">What helps us most</p>
                    <button type="button" onClick={() => setOpenBubble(null)} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors" aria-label="Close">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm text-white/75">
                    <li>What you were trying to find</li>
                    <li>Your preferred mood or theme</li>
                    <li>Any issues you ran into</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Form: center */}
          <div className="contact-form-wrap relative z-10 w-full min-w-0 max-w-md shrink-0 lg:max-w-[420px] xl:max-w-[440px]">
            {submitted ? (
              <div className="contact-form-hover">
                <div className="contact-form-in rounded-3xl bg-[#040404] px-6 py-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[2rem] md:px-10 md:py-12">
                  <p className="text-lg text-white/95">
                    Thanks for your message. We will get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <div className="contact-form-hover">
                <div className="contact-form-in overflow-hidden rounded-3xl bg-[#040404] shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[2rem]">
                  <div
                    className="rounded-t-3xl border-b border-white/10 bg-transparent px-6 py-6 md:rounded-t-[2rem] md:px-8 md:py-7"
                    style={{ boxShadow: "0 2px 8px rgba(178, 34, 34, 0.25)" }}
                  >
                    <h2 className="text-center text-xl font-semibold tracking-tight text-white md:text-2xl">
                      Contact form
                    </h2>
                    <p className="mt-1 text-center text-sm text-white/60">
                      Send us a message and we will get back to you.
                    </p>
                  </div>

                  <div className="rounded-b-3xl border border-t-0 border-white/10 bg-[#0d0d0d] p-6 md:rounded-b-[2rem] md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className={inputFieldClass}>
                          <label htmlFor="contact-name" className={labelClass}>
                            Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className={`h-11 ${inputClass}`}
                          />
                        </div>
                        <div className={inputFieldClass}>
                          <label htmlFor="contact-surname" className={labelClass}>
                            Surname
                          </label>
                          <input
                            id="contact-surname"
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Your surname"
                            className={`h-11 ${inputClass}`}
                          />
                        </div>
                      </div>

                      <div className={inputFieldClass}>
                        <label htmlFor="contact-email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className={`h-11 ${inputClass}`}
                        />
                      </div>

                      <div className={inputFieldClass}>
                        <label htmlFor="contact-topic" className={labelClass}>
                          Topic
                        </label>
                        <div className="relative">
                          <select
                            id="contact-topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className={`h-11 appearance-none ${inputClass}`}
                          >
                            <option value="general">General question</option>
                            <option value="feedback">Product feedback</option>
                            <option value="support">Support</option>
                            <option value="collaboration">Collaboration</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className={inputFieldClass}>
                        <label htmlFor="contact-message" className={labelClass}>
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Your message..."
                          rows={4}
                          className={`min-h-[128px] resize-y ${inputClass} py-3`}
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="feelvie-button w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d0d0d] active:scale-95 active:brightness-90 sm:w-auto sm:min-w-[140px] sm:px-8"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
