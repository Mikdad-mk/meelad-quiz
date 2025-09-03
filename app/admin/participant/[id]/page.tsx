"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Participant = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  place: string;
  answers: Record<string, string>;
  createdAt: string;
};

type Question = {
  _id: string;
  title: string;
  subtitle?: string;
};

export default function ParticipantAnswersPage() {
  const params = useParams();
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [participantRes, questionsRes] = await Promise.all([
          fetch(`/api/participants/${params.id}`),
          fetch("/api/questions")
        ]);

        if (participantRes.ok && questionsRes.ok) {
          const participantData = await participantRes.json();
          const questionsData = await questionsRes.json();
          setParticipant(participantData);
          setQuestions(questionsData);
        } else {
          alert("Failed to load participant data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Participant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Participant Answers</h1>
              <p className="text-gray-600 mt-1">Viewing responses for {participant.name}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Participant Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Participant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{participant.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{participant.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">{participant.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Place</label>
              <p className="text-gray-900">{participant.place}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Submitted</label>
              <p className="text-gray-900">{new Date(participant.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Responses</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions available</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => {
                const answer = participant.answers[question._id] || "No answer provided";
                return (
                  <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{question.title}</h3>
                        {question.subtitle && (
                          <p className="text-sm text-gray-600 mb-3">{question.subtitle}</p>
                        )}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <label className="text-sm font-medium text-gray-700 block mb-1">Answer:</label>
                          <p className="text-gray-900">{answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
