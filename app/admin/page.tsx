"use client";

import { useEffect, useState } from "react";

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
  const [optionText, setOptionText] = useState("");

  useEffect(() => {
    fetch("/api/questions").then(r => r.json()).then(setQuestions).catch(() => {});
  }, []);

  async function addQuestion() {
    const opts = optionText.split("\n").filter(Boolean).map((t, i) => ({ id: `opt${i+1}`, label: t.trim() }));
    const body: Question = { title, options: opts, subtitle: "Select only one", order: questions.length };
    const res = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const created = await res.json();
    setQuestions(q => [...q, created]);
    setTitle("");
    setOptionText("");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur p-4">
          <h2 className="font-medium mb-3">Create Question</h2>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Question title" className="w-full border rounded px-3 py-2 mb-3" />
          <textarea value={optionText} onChange={e=>setOptionText(e.target.value)} placeholder="One option per line" className="w-full border rounded px-3 py-2 h-32 mb-3" />
          <button onClick={addQuestion} className="px-4 py-2 rounded bg-emerald-500 text-white">Add</button>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur p-4">
          <h2 className="font-medium mb-3">Questions</h2>
          <ul className="space-y-2">
            {questions.map(q => (
              <li key={q._id} className="p-3 rounded border bg-white/70">
                <div className="font-medium">{q.title}</div>
                <div className="text-xs text-neutral-500">{q.options?.length || 0} options</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur p-4">
        <h2 className="font-medium mb-3">Participants</h2>
        <ParticipantsList />
      </section>
    </div>
  );
}

function ParticipantsList() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/participants").then(r => r.json()).then(setItems).catch(() => {});
  }, []);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.phone}</td>
              <td className="p-2">{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


