import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db";
import { Participant } from "../../models";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const participant = await Participant.findById(id);
  
  if (!participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }
  
  return NextResponse.json(participant);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Participant.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}


