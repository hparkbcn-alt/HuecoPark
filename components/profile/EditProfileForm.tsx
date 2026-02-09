"use client";

import React, { useState } from "react";

interface Props {
  user: any;
}

export default function EditProfileForm({ user }: Props) {
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error updating profile");
      setMsg("Perfil actualizado");
    } catch (err: any) {
      setMsg(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Imagen (URL)</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
        {msg ? <div className="text-sm text-muted-foreground">{msg}</div> : null}
      </div>
    </form>
  );
}
