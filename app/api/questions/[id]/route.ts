import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db";
import { Question } from "../../models";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Question.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}


