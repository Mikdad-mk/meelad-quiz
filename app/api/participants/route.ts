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
  
  // Check for existing participants with same email or phone
  const existingParticipant = await Participant.findOne({
    $or: [
      { email: body.email },
      { phone: body.phone }
    ]
  });
  
  if (existingParticipant) {
    return NextResponse.json(
      { error: "A participant with this email or phone number already exists" },
      { status: 400 }
    );
  }
  
  const created = await Participant.create(body);
  return NextResponse.json(created, { status: 201 });
}


