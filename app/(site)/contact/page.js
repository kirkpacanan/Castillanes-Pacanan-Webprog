"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputFieldClass = "flex flex-col gap-1.5";
  const labelClass =
    "text-sm font-medium text-white/90";
  const inputClass =
    "w-full min-w-0 rounded-xl border border-[#444444] bg-[#252525] px-4 py-3 text-base text-white placeholder:text-white/40 outline-none transition-all duration-300 ease-out hover:border-white/40 hover:bg-[#323232] focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:bg-[#2a2a2a]";

  return (
    <div
      className="feelvie-page relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#350A0A]"
    >
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>

      {/* Hero: pill slightly past viewport so it reads wider (overflow hidden by parent) */}
      <section className="relative z-10 -mt-12 sm:-mt-12 md:-mt-14 pb-6 sm:pb-8 md:pb-10 left-1/2 -translate-x-1/2 px-0 w-full sm:w-[105vw] max-w-none">
        <div className="w-full">
          {/* Wrapper for hover so animation transform doesn't block it */}
          <div className="contact-pill-hover">
            <div
              className="contact-hero-drop flex flex-col items-center justify-center rounded-[80px] sm:rounded-[120px] md:rounded-[195px] bg-[#05050A] px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10 md:pt-16 md:pb-12 lg:pt-20 lg:pb-14"
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

      {/* Contact form */}
      <section className="relative z-20 px-3 sm:px-4 md:px-6 pb-16 sm:pb-24 pt-2 md:pt-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
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
                            className="w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 hover:shadow-[0_0_30px_rgba(178,34,34,0.7)] focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-[#0d0d0d] active:scale-95 active:brightness-90 sm:w-auto sm:min-w-[140px] sm:px-8"
                            style={{
                              background: "#B22222",
                              boxShadow: "0 2px 8px rgba(178, 34, 34, 0.35)",
                            }}
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

            <aside className="flex flex-col gap-6">
              <div className="feelvie-card flex flex-col gap-5 p-6 md:p-8 transition-all duration-300 ease-out hover:shadow-[0_8px_24px_rgba(178,34,34,0.3)] hover:border-red-500/30">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Before you send</p>
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
              <div className="feelvie-card-muted flex flex-col gap-4 p-6 transition-all duration-300 ease-out hover:border-red-500/30 hover:shadow-[0_4px_12px_rgba(178,34,34,0.2)] hover:bg-white/[0.08]">
                <p className="text-sm font-semibold text-white">What helps us most</p>
                <ul className="flex flex-col gap-2 text-sm text-white/70">
                  <li>What you were trying to find</li>
                  <li>Your preferred mood or theme</li>
                  <li>Any issues you ran into</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
