import { NextResponse } from "next/server";

// EdgeStore deshabilitado - Se usan URLs directas para imágenes
export type EdgeStoreRouter = Record<string, never>;

export async function GET() {
  return NextResponse.json(
    { error: "EdgeStore no está configurado. Usa URLs directas para las imágenes." },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "EdgeStore no está configurado. Usa URLs directas para las imágenes." },
    { status: 503 }
  );
}
