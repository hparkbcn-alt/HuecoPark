import React from "react";
import { getCurrentUser } from "../../services/user";
import EditProfileForm from "../../components/profile/EditProfileForm";
import ListingCard from "../../components/ListingCard";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name || user?.email || "Usuario"}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">4.8</span>
                <span className="text-muted-foreground text-sm">(18 valoraciones)</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="font-semibold text-primary">847 puntos de karma</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">👥</div>
            <div className="text-2xl font-bold">23</div>
            <div className="text-xs text-muted-foreground">Personas ayudadas</div>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">⏰</div>
            <div className="text-2xl font-bold">2h 15min</div>
            <div className="text-xs text-muted-foreground">Tiempo ahorrado</div>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">📍</div>
            <div className="text-2xl font-bold">15</div>
            <div className="text-xs text-muted-foreground">Huecos encontrados</div>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">🏆</div>
            <div className="text-2xl font-bold">4</div>
            <div className="text-xs text-muted-foreground">Medallas ganadas</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-6">
        <h3 className="text-lg font-semibold mb-4">Editar perfil</h3>
        {user ? <EditProfileForm user={user} /> : <p>Por favor inicia sesión para editar tu perfil.</p>}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad reciente</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="pb-3 border-b border-border">Ayudó a Carlos a encontrar hueco • hace 2h</div>
          <div className="pb-3 border-b border-border">Reportó hueco disponible • hace 1 día</div>
          <div className="pb-3 border-b border-border">Respondió en chat de zona • hace 2 días</div>
        </div>
      </div>
    </main>
  );
}
