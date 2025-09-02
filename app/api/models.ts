import mongoose, { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    options: [{ id: String, label: String }],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ParticipantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    answers: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

export const Question = models.Question || model("Question", QuestionSchema);
export const Participant = models.Participant || model("Participant", ParticipantSchema);


