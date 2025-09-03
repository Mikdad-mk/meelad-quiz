"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Question = {
  _id?: string;
  title: string;
  subtitle?: string;
  options: { id: string; label: string }[];
  order?: number;
  active?: boolean;
};

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [answerPlaceholder, setAnswerPlaceholder] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/questions").then(r => r.json()).then(setQuestions).catch(() => {});
  }, []);

  async function addQuestion() {
    const body: Question = { title, options: [], subtitle: "Write your answer", order: questions.length };
    const res = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const created = await res.json();
    setQuestions(q => [...q, created]);
    setTitle("");
    setAnswerPlaceholder("");
  }

  async function deleteQuestion(id?: string) {
    if (!id) return;
    try {
      await fetch(`/api/questions/${id}`, { method: "DELETE" });
      setQuestions(q => q.filter(x => x._id !== id));
    } catch {}
  }

  function viewParticipantAnswers(participantId: string) {
    router.push(`/admin/participant/${participantId}`);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(1200px_700px_at_50%_100%,#ffffff_0%,#f6fff9_45%,#eafbf3_85%)]">
      {/* Mobile: full-bleed image centered behind content */}
      <div className="absolute inset-0 md:hidden" aria-hidden>
        <Image src="/mosque-final.png" alt="Background" className="h-full w-full object-cover object-center opacity-100 select-none pointer-events-none" fill />
      </div>
      {/* Desktop: image on left with fade */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%]"
        style={{
          WebkitMaskImage: "linear-gradient(to right, black 70%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to right, black 70%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      >
        <Image src="/mosque-final.png" alt="Background" className="h-full w-full object-cover object-left-top opacity-100 select-none pointer-events-none" fill />
      </div>

      {/* Overlays matching main page */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-900/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 md:hidden bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-transparent mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background:radial-gradient(rgba(16,185,129,0.15)_1px,transparent_1px)] [background-size:18px_18px] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.0) 60%)" }} />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-500/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-24 right-0 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-lime-300/30 to-emerald-400/20 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: "vh", clipPath: "ellipse(130% 58% at 50% 0%)" }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: "48vh", clipPath: "ellipse(140% 52% at 50% 3%)", boxShadow: "0 -8px 30px rgba(16,185,129,0.08) inset" }} />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-neutral-700">Manage questions and view participants</p>
            </div>
          </div>

          {/* Main grid */}
          <section className="grid lg:grid-cols-2 gap-6">
            {/* Create question card */}
            <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-400/50 via-emerald-300/30 to-emerald-200/20 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.35)]">
              <div className="rounded-[27px] bg-white/85 backdrop-blur-xl border border-emerald-100 p-5 sm:p-6">
                <h2 className="font-medium text-neutral-900">Create Question</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-neutral-800">Title</label>
                    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Question title" className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-800">Answer field (no options)</label>
                    <input value={answerPlaceholder} onChange={e=>setAnswerPlaceholder(e.target.value)} placeholder="Optional placeholder (e.g. Your answer)" className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={addQuestion} className="px-5 py-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-neutral-900 font-medium shadow-md hover:shadow-lg disabled:opacity-50">Add</button>
                </div>
              </div>
            </div>

            {/* Questions list card */}
            <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-400/50 via-emerald-300/30 to-emerald-200/20 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.35)]">
              <div className="rounded-[27px] bg-white/85 backdrop-blur-xl border border-emerald-100 p-5 sm:p-6">
                <h2 className="font-medium text-neutral-900">Questions</h2>
                <ul className="mt-4 space-y-2 max-h-[360px] overflow-auto pr-1">
                  {questions.map(q => (
                    <li key={q._id} className="p-3 rounded-2xl border border-emerald-200 bg-white/85">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-neutral-900">{q.title}</div>
                          <div className="text-xs text-neutral-700">Text answer</div>
                        </div>
                        <button onClick={() => deleteQuestion(q._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Delete</button>
                      </div>
                    </li>
                  ))}
                  {questions.length === 0 && (
                    <li className="text-sm text-neutral-700">No questions yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* Participants table */}
          <section className="mt-6 relative rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-400/50 via-emerald-300/30 to-emerald-200/20 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.35)]">
            <div className="rounded-[27px] bg-white/85 backdrop-blur-xl border border-emerald-100 p-5 sm:p-6">
              <h2 className="font-medium text-neutral-900">Participants</h2>
              <div className="mt-4">
                <ParticipantsList onViewAnswers={viewParticipantAnswers} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

type Participant = { _id: string; name: string; email: string; phone: string; place: string; createdAt: string };

function ParticipantsList({ onViewAnswers }: { onViewAnswers: (participantId: string) => void }) {
  const [items, setItems] = useState<Participant[]>([]);
  useEffect(() => {
    fetch("/api/participants").then(r => r.json()).then(setItems).catch(() => {});
  }, []);
  async function deleteParticipant(id: string) {
    try {
      await fetch(`/api/participants/${id}`, { method: "DELETE" });
      setItems(list => list.filter(p => p._id !== id));
    } catch {}
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-700">
            <th className="p-2 font-medium">Name</th>
            <th className="p-2 font-medium">Email</th>
            <th className="p-2 font-medium">Phone</th>
            <th className="p-2 font-medium">Place</th>
            <th className="p-2 font-medium">Created</th>
            <th className="p-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p._id} className="border-t border-emerald-100 text-neutral-900">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.phone}</td>
              <td className="p-2">{p.place}</td>
              <td className="p-2">{new Date(p.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <button onClick={() => onViewAnswers(p._id)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 mr-2">View</button>
                <button onClick={() => deleteParticipant(p._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


