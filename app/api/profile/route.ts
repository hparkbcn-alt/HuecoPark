import { NextResponse } from "next/server";
import { updateUserProfile } from "../../../services/userProfile";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, image } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updated = await updateUserProfile(userId, { name, image });
    if (!updated) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
