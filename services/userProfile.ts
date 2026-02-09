import type { User } from "../types";

export async function updateUserProfile(userId: string, data: { name?: string; image?: string }) {
  const fs = await import("fs/promises");
  const path = await import("path");
  const file = path.join(process.cwd(), "data", "users.json");

  const content = await fs.readFile(file, "utf-8");
  const users: User[] = JSON.parse(content || "[]");

  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  users[idx] = {
    ...users[idx],
    name: data.name ?? users[idx].name,
    image: data.image ?? users[idx].image,
  } as User;

  await fs.writeFile(file, JSON.stringify(users, null, 2), "utf-8");

  return users[idx];
}

export default updateUserProfile;
