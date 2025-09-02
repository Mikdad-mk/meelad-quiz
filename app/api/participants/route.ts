import { NextResponse } from "next/server";
import { connectToDatabase } from "../db";
import { Participant } from "../models";

export async function GET() {
  await connectToDatabase();
  const participants = await Participant.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json(participants);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const created = await Participant.create(body);
  return NextResponse.json(created, { status: 201 });
}


