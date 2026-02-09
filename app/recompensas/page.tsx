import React from "react";

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-6">
        <div className="text-center">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
              <rect x="3" y="8" width="18" height="4" rx="1"></rect>
              <path d="M12 8v13"></path>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2">847 puntos</h2>
          <p className="text-muted-foreground">Karma disponible para canjear por recompensas</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 whitespace-nowrap">
            Todas
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground ml-2">6</div>
          </button>
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent h-9 rounded-md px-3 whitespace-nowrap">Comida
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground ml-2">2</div>
          </button>
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent h-9 rounded-md px-3 whitespace-nowrap">Coche
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground ml-2">2</div>
          </button>
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent h-9 rounded-md px-3 whitespace-nowrap">Compras
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground ml-2">1</div>
          </button>
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent h-9 rounded-md px-3 whitespace-nowrap">Servicios
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground ml-2">1</div>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Card 1 */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">Café El Rincón</h3>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                  <span className="ml-1 capitalize">food</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-primary mb-2">Café gratis</h4>
              <p className="text-muted-foreground text-sm mb-3">Un café con leche o cortado gratis</p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Viladecans Centro</span>
                </div>
                <div>Válido hasta: 31 dic 2024</div>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="bg-primary/10 px-3 py-2 rounded-lg mb-3">
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-xs text-muted-foreground">puntos</div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                </svg>
                Canjear
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">Lavado Express</h3>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <path d="M9 17h6"></path>
                    <circle cx="17" cy="17" r="2"></circle>
                  </svg>
                  <span className="ml-1 capitalize">car</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-primary mb-2">10% descuento lavado completo</h4>
              <p className="text-muted-foreground text-sm mb-3">Descuento en lavado exterior + interior</p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Gavà</span>
                </div>
                <div>Válido hasta: 15 ene 2025</div>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="bg-primary/10 px-3 py-2 rounded-lg mb-3">
                <div className="text-2xl font-bold text-primary">20</div>
                <div className="text-xs text-muted-foreground">puntos</div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                </svg>
                Canjear
              </button>
            </div>
          </div>
        </div>

        {/* Additional sample cards (shortened) */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">Pizzería Napoli</h3>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                  <span className="ml-1 capitalize">food</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-primary mb-2">Pizza mediana gratis</h4>
              <p className="text-muted-foreground text-sm mb-3">Pizza mediana de hasta 3 ingredientes</p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Castelldefels</span>
                </div>
                <div>Válido hasta: 28 feb 2025</div>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="bg-primary/10 px-3 py-2 rounded-lg mb-3">
                <div className="text-2xl font-bold text-primary">45</div>
                <div className="text-xs text-muted-foreground">puntos</div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                  <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                </svg>
                Canjear
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border text-card-foreground shadow-sm mt-8 p-6 bg-muted/50">
          <div className="text-center">
            <h3 className="font-semibold mb-2">¿Cómo conseguir más puntos?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Reportar huecos libres: +5 puntos</p>
              <p>• Ayudar en el chat: +3 puntos</p>
              <p>• Recibir valoración positiva: +10 puntos</p>
              <p>• Actividad diaria: +1 punto</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
