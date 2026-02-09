"use client";

import React, { useState } from "react";

export default function Page() {
  const [activated, setActivated] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const handleActivate = () => {
    setActivated(true);
  };

  const handleDeactivate = () => {
    setActivated(false);
    setSeconds(0);
  };

  // timer
  React.useEffect(() => {
    let timer: any = null;
    if (activated) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activated]);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-8 text-center">
        <div className="mb-6">
          <div className={`w-32 h-32 mx-auto ${activated ? "bg-red-100" : "bg-muted"} rounded-full flex items-center justify-center mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`h-16 w-16 ${activated ? "text-red-600" : "text-muted-foreground"}`}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${activated ? "text-red-600" : ""}`}>{activated ? "SOS ACTIVADO" : "Modo SOS Desactivado"}</h2>
        {activated ? (
          <>
            <p className="text-red-600 mb-2">Recibirás notificaciones automáticas cuando haya huecos cerca</p>
            <div className="text-lg font-medium mb-4">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")} <span className="text-sm font-normal text-muted-foreground">Tiempo buscando aparcamiento</span>
            </div>
            <button onClick={handleDeactivate} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 w-full md:w-auto bg-red-600 text-white hover:bg-red-700">
              Desactivar SOS - Ya he aparcado
            </button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">Activa el modo SOS cuando estés buscando aparcamiento desesperadamente</p>
            <button onClick={handleActivate} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 w-full md:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90">
              🚨 Activar Modo SOS
            </button>
          </>
        )}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-6">
        <h3 className="text-lg font-semibold mb-4">¿Cómo funciona el Modo SOS?</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-primary">1</span></div>
            <div>
              <h4 className="font-medium">Activa el modo SOS</h4>
              <p className="text-sm text-muted-foreground">Cuando empieces a dar vueltas buscando aparcamiento</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-primary">2</span></div>
            <div>
              <h4 className="font-medium">Recibe notificaciones</h4>
              <p className="text-sm text-muted-foreground">Te avisaremos automáticamente de huecos reportados cerca</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-primary">3</span></div>
            <div>
              <h4 className="font-medium">Desactiva cuando aparques</h4>
              <p className="text-sm text-muted-foreground">Pulsa "Ya he aparcado" para parar las notificaciones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Estadísticas de hoy</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-xs text-muted-foreground">Huecos reportados cerca</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">12</div>
            <div className="text-xs text-muted-foreground">Usuarios buscando</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-xs text-muted-foreground">Personas ayudadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">15min</div>
            <div className="text-xs text-muted-foreground">Tiempo promedio</div>
          </div>
        </div>
      </div>
    </main>
  );
}
