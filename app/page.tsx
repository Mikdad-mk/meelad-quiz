"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type QuizOption = {
  id: string;
  label: string;
};

type QuizQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
};

export default function Home() {
  const questions: QuizQuestion[] = useMemo(
    () => [
      {
        id: "q1",
        title: "How would you like to make change happen?",
        subtitle: "Select only one",
        options: [
          { id: "diy", label: "D.I.Y." },
          { id: "contractor", label: "Contractor" },
          { id: "manager", label: "Property Manager" },
        ],
      },
      {
        id: "q2",
        title: "What is your project timeline?",
        subtitle: "Select only one",
        options: [
          { id: "now", label: "Right away" },
          { id: "soon", label: "1–3 months" },
          { id: "later", label: "3+ months" },
        ],
      },
      {
        id: "q3",
        title: "What is your budget range?",
        subtitle: "Select only one",
        options: [
          { id: "low", label: "Under $1,000" },
          { id: "med", label: "$1,000 – $5,000" },
          { id: "high", label: "$5,000+" },
        ],
      },
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [participant, setParticipant] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const current = questions[stepIndex];
  const total = questions.length;
  const isLast = stepIndex === total - 1;

  function handleSelect(optionId: string) {
    setAnswers(prev => ({ ...prev, [current.id]: optionId }));
  }

  async function handleNext() {
    if (!answers[current.id]) return;
    if (isLast) {
      try {
        await fetch("/api/participants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...participant!, answers }),
        });
      } catch {}
      alert("Thanks! " + JSON.stringify(answers, null, 2));
      return;
    }
    setStepIndex(i => Math.min(i + 1, total - 1));
  }

  function handleBack() {
    setStepIndex(i => Math.max(i - 1, 0));
  }

  function handleClose() {
    setStepIndex(0);
    setAnswers({});
    setParticipant(null);
  }

  if (!participant) {
    return (
      <div
        className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(1200px_700px_at_50%_100%,#ffffff_0%,#f6fff9_45%,#eafbf3_85%)] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Mobile full image */}
        <div className="absolute inset-0 md:hidden">
          <Image src="/mosque-final.png" alt="Background scene" fill priority className="object-cover object-center opacity-100 select-none pointer-events-none" />
        </div>
        {/* Desktop left image */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%]">
          <Image src="/mosque-final.png" alt="Background scene" fill priority className="object-cover object-left-top opacity-100 select-none pointer-events-none" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-900/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 md:hidden bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(255,255,255,0)_80%)] mix-blend-overlay" />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "48vh",
            clipPath: "ellipse(130% 58% at 50% 0%)",
          }}
        />

        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl z-10 mr-0 lg:mr-12 xl:mr-20">
          <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-400/50 via-emerald-300/30 to-emerald-200/20 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.35)]">
            <div className="rounded-[27px] bg-white/85 backdrop-blur-xl border border-emerald-100 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-wide text-emerald-700 font-medium">Get started</div>
              </div>

              <h1 className="mt-2 text-xl font-semibold text-neutral-900 leading-snug">Welcome</h1>
              <p className="text-sm text-neutral-600 mt-1">Please share your details to begin the quiz.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-neutral-600">Name</label>
                  <input className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="e.g. Mikdad" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Email</label>
                  <input className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="you@example.com" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Phone</label>
                  <input className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="e.g. +1 555 0123" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone: e.target.value }))} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={()=> setParticipant({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })}
                  disabled={!form.name || !form.email || !form.phone}
                  className="px-5 py-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-neutral-900 font-medium disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  Start quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(1200px_700px_at_50%_100%,#ffffff_0%,#f6fff9_45%,#eafbf3_85%)] flex items-center justify-center lg:justify-end p-4 sm:p-6"
      onMouseMove={(e) => {
        // Disable parallax on small screens for performance and touch UX
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
          const { innerWidth, innerHeight } = window;
          const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
          const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
          setParallax({ x, y });
        }
      }}
    >
      {/* Mobile: full-bleed image centered behind card */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/mosque-final.png"
          alt="Background scene"
          fill
          priority
          className="object-cover object-center opacity-100 select-none pointer-events-none"
        />
      </div>
      {/* Desktop: image fixed to left side with soft fade */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%] will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 6}px, 0) scale(1.08)`,
          transition: "transform 120ms linear",
          WebkitMaskImage:
            "linear-gradient(to right, black 70%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to right, black 70%, rgba(0,0,0,0) 100%)",
        }}
          >
            <Image
          src="/mosque-final.png"
          alt="Background scene"
          fill
          priority
          className="object-cover object-left-top opacity-100 select-none pointer-events-none"
        />
        </div>
      {/* Vignette + gradient overlays tuned to emerald theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-900/20 to-transparent" />
      {/* Mobile readability overlay */}
      <div className="pointer-events-none absolute inset-0 md:hidden bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
      {/* Emerald tint from left to right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-transparent mix-blend-multiply" />
      {/* Removed split right-side panel to keep one continuous background */}
      {/* Subtle grid texture in theme colors */}
      <div className="pointer-events-none absolute inset-0 opacity-15 [background:radial-gradient(rgba(16,185,129,0.15)_1px,transparent_1px)] [background-size:18px_18px] mix-blend-overlay" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.0) 60%)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-500/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-24 right-0 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-lime-300/30 to-emerald-400/20 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
      {/* Layered curved panels at bottom for a richer footer shape */}
      <div
            aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "vh",
          clipPath: "ellipse(130% 58% at 50% 0%)",
        }}
      />
      <div
            aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "48vh",
          clipPath: "ellipse(140% 52% at 50% 3%)",
          boxShadow: "0 -8px 30px rgba(16,185,129,0.08) inset",
        }}
      />

      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl z-10 mr-0 lg:mr-12 xl:mr-20">
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-white/10 backdrop-blur-sm shadow-sm" />
        <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-400/50 via-emerald-300/30 to-emerald-200/20 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.35)]">
          <div className="rounded-[27px] bg-white/85 backdrop-blur-xl border border-emerald-100 p-6 sm:p-8 lg:p-10 min-h-[460px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 w-full max-w-[220px]" aria-label="progress">
              {questions.map((q, idx) => (
                <span
                  key={q.id}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx < stepIndex
                      ? "bg-emerald-600"
                      : idx === stepIndex
                      ? "bg-emerald-700"
                      : "bg-emerald-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="h-7 w-7 grid place-items-center rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              ×
            </button>
          </div>

          <div className="mt-6 text-xs tracking-wide text-neutral-500 font-medium">
            {`QUESTION ${String(stepIndex + 1).padStart(2, "0")}`}
          </div>
          <h1 className="mt-2 text-xl font-semibold text-neutral-900 leading-snug">
            {current.title}
          </h1>
          {current.subtitle && (
            <p className="mt-4 text-xs uppercase text-neutral-400">{current.subtitle}</p>
          )}

          <div className="mt-3 space-y-3">
            {current.options.map(option => {
              const selected = answers[current.id] === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 cursor-pointer transition-all ${
                    selected
                      ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-300/60"
                      : "bg-white/70 border-emerald-100 hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    className="h-4 w-4 accent-emerald-600"
                    checked={selected}
                    onChange={() => handleSelect(option.id)}
                  />
                  <span className="text-sm text-neutral-800">{option.label}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="px-4 py-2 text-sm text-neutral-700 hover:text-neutral-900 disabled:text-neutral-300"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[current.id]}
              className="px-5 py-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-neutral-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
