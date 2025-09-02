import { NextResponse } from "next/server";
import { connectToDatabase } from "../db";
import { Question } from "../models";

export async function GET() {
  await connectToDatabase();
  const questions = await Question.find({ active: true }).sort({ order: 1, createdAt: 1 });
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const created = await Question.create(body);
  return NextResponse.json(created, { status: 201 });
}


