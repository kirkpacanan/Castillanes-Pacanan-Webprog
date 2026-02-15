"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = (e) => {
    setCursorGlow({ x: e.clientX, y: e.clientY });
    setCursorVisible(true);
  };
  const handleMouseLeave = () => setCursorVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputFieldClass = "flex flex-col gap-1.5";
  const labelClass =
    "text-sm font-medium text-slate-700 dark:text-white/90";
  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 dark:border-[#444444] dark:bg-[#252525] dark:text-white dark:placeholder:text-white/40 dark:focus:border-red-500/50 dark:focus:ring-red-500/20";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-[#350A0A]"
      style={{ fontFamily: "Inter, sans-serif" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Red gradient lights (fade to black) + cursor-follow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="contact-page-red-glow contact-page-red-glow-1" aria-hidden />
        <div className="contact-page-red-glow contact-page-red-glow-2" aria-hidden />
        <div
          className="contact-page-red-glow contact-page-red-glow-cursor"
          aria-hidden
          style={{
            left: cursorGlow.x,
            top: cursorGlow.y,
            opacity: cursorVisible ? 0.5 : 0,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Hero: pill slightly past viewport so it reads wider (overflow hidden by parent) */}
      <section className="relative z-10 -mt-12 md:-mt-14 pb-8 md:pb-10 left-1/2 -translate-x-1/2 px-0 w-[105vw] max-w-none">
        <div className="w-full">
          {/* Wrapper for hover so animation transform doesn’t block it */}
          <div className="contact-pill-hover">
            <div
              className="contact-hero-drop flex flex-col items-center justify-center rounded-[195px] bg-slate-800 px-0 pt-14 pb-10 dark:bg-[#05050A] md:pt-16 md:pb-12 lg:pt-20 lg:pb-14"
            >
          <h1
            className="text-center font-bold leading-[160%] text-white drop-shadow text-3xl md:text-4xl lg:text-5xl"
            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Contact Us
            <br />
            <span className="font-bold">We&apos;d love to hear from you.</span>
          </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="relative z-20 px-4 pb-24 pt-2 md:px-6 md:pt-4">
        <div className="mx-auto w-full max-w-2xl">
          {submitted ? (
            <div className="contact-form-hover">
              <div className="contact-form-in rounded-3xl bg-slate-200 px-6 py-10 text-center shadow-lg dark:bg-[#040404] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[2rem] md:px-10 md:py-12">
                <p className="text-lg text-slate-800 dark:text-white/95">
                  Thanks for your message. We&apos;ll get back to you soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="contact-form-hover">
            <div className="contact-form-in overflow-hidden rounded-3xl bg-slate-200 shadow-lg dark:bg-[#040404] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[2rem]">
              <div className="border-b border-slate-200/80 px-6 py-6 dark:border-white/10 md:px-8 md:py-7">
                <h2 className="text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
                  Contact Form
                </h2>
                <p className="mt-1 text-center text-sm text-slate-500 dark:text-white/60">
                  Send us a message and we&apos;ll get back to you.
                </p>
              </div>

              <div className="rounded-b-3xl border border-t-0 border-slate-200/80 bg-slate-50 p-6 dark:border-white/10 dark:bg-[#0d0d0d] md:rounded-b-[2rem] md:p-8">
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
                      className="w-full rounded-xl py-3.5 text-base font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#0d0d0d] sm:w-auto sm:min-w-[140px] sm:px-8"
                      style={{
                        background: "#8E1B1B",
                        boxShadow: "0 2px 8px rgba(142, 27, 27, 0.35)",
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
      </section>
    </div>
  );
}
