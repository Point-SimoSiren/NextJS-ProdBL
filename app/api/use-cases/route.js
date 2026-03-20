import { NextResponse } from "next/server";
import {
  createUseCase,
  listUseCases,
  STATUS,
  updateUseCaseStatus,
} from "@/lib/db";

// Next.js Route Handler toimii tässä samalla idealla kuin Express-route,
// mutta tiedoston sijainti määrittää URL-polun automaattisesti.
// app/api/use-cases/route.js -> /api/use-cases
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(listUseCases());
}

export async function POST(request) {
  const body = await request.json();
  const title = body?.title?.trim();

  if (!title) {
    return NextResponse.json(
      { error: "title on pakollinen" },
      { status: 400 },
    );
  }

  const created = createUseCase(title);
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const id = Number(body?.id);
  const status = body?.status;

  if (!Number.isInteger(id) || !STATUS.includes(status)) {
    return NextResponse.json(
      { error: "virheellinen id tai status" },
      { status: 400 },
    );
  }

  const updated = updateUseCaseStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "riviä ei löytynyt" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
