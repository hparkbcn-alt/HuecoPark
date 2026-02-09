import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="py-12">
      <div className="main-container w-full">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Encuentra huecos de parking en Barcelona al instante
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl">
              HuecoPark te ayuda a localizar y reservar estacionamientos seguros y económicos
              en toda la ciudad. Comparte, reserva y olvídate de dar vueltas.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-5 py-3 bg-green-500 text-white rounded-md font-medium w-full md:w-auto text-center"
              >
                Buscar estacionamientos
              </Link>
              <Link href="/properties" className="text-sm text-gray-700 hidden sm:inline-block">
                Ofrecer mi parking
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=7f0a6f8d1e3f5d1c2b6a3b2f6b1c3a9d"
                alt="Barcelona parking"
                className="w-full h-48 md:h-72 object-cover"
                width={1600}
                height={900}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="main-container mt-12">
        {/* Feature cards (map, chat, how it works) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
          <Link href="/chat">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer h-full text-center">
              <div className="h-12 w-12 text-green-600 mx-auto mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Chat de zona</h3>
              <p className="text-muted-foreground text-sm">Pregunta a la comunidad local</p>
            </div>
          </Link>

          <Link href="/help">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer h-full text-center">
              <div className="h-12 w-12 text-green-600 mx-auto mb-4">❓</div>
              <h3 className="text-lg font-semibold mb-2">¿Cómo funciona?</h3>
              <p className="text-muted-foreground text-sm">Aprende a usar HuecoPark en 3 pasos</p>
            </div>
          </Link>
        </div>

        {/* CTA buttons including Recompensas */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/mapa">
            <button className="bg-green-600 text-white h-11 rounded-md px-8 w-full md:w-auto">🗺️ Ver Mapa</button>
          </Link>
          <Link href="/sos">
            <button className="bg-red-600 text-white h-11 rounded-md px-8 w-full md:w-auto">🚨 Modo SOS</button>
          </Link>
          <Link href="/rewards">
            <button className="border border-gray-300 bg-white h-11 rounded-md px-8 w-full md:w-auto">🎁 Recompensas</button>
          </Link>
        </div>

        {/* 'Por qué HuecoPark' section */}
        <section className="bg-white rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4">¿Por qué HuecoPark?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold">Rápido</h4>
              <p className="text-sm text-muted-foreground">Encuentra huecos en tiempo real sin dar vueltas.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold">Seguro</h4>
              <p className="text-sm text-muted-foreground">Reservas y opciones verificadas por la comunidad.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💸</div>
              <h4 className="font-semibold">Económico</h4>
              <p className="text-sm text-muted-foreground">Tarifas competitivas y flexibles según tu zona.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
