import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

// Imágenes de parkings de Unsplash
const parkingImages = [
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
  'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800',
  'https://images.unsplash.com/photo-1563291589-4d4cd1b0c9ac?w=800',
  'https://images.unsplash.com/photo-1601923523411-073e4b6e8c9f?w=800',
  'https://images.unsplash.com/photo-1578667698664-2c9c8fd0f1be?w=800',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
];

// Zonas de Barcelona con coordenadas reales
const barcelonaLocations = [
  { region: 'Eixample', country: 'Barcelona', latlng: [41.3874, 2.1686] },
  { region: 'Gràcia', country: 'Barcelona', latlng: [41.4036, 2.1577] },
  { region: 'Ciutat Vella', country: 'Barcelona', latlng: [41.3825, 2.1769] },
  { region: 'Sants-Montjuïc', country: 'Barcelona', latlng: [41.3748, 2.1508] },
  { region: 'Les Corts', country: 'Barcelona', latlng: [41.3879, 2.1314] },
  { region: 'Sarrià-Sant Gervasi', country: 'Barcelona', latlng: [41.4036, 2.1388] },
  { region: 'Horta-Guinardó', country: 'Barcelona', latlng: [41.4198, 2.1594] },
  { region: 'Nou Barris', country: 'Barcelona', latlng: [41.4395, 2.1774] },
  { region: 'Sant Andreu', country: 'Barcelona', latlng: [41.4351, 2.1899] },
  { region: 'Sant Martí', country: 'Barcelona', latlng: [41.4131, 2.1989] },
  { region: 'Barceloneta', country: 'Barcelona', latlng: [41.3795, 2.1896] },
  { region: 'Born', country: 'Barcelona', latlng: [41.3838, 2.1826] },
  { region: 'Raval', country: 'Barcelona', latlng: [41.3794, 2.1681] },
  { region: 'Poblenou', country: 'Barcelona', latlng: [41.4022, 2.2007] },
  { region: 'Diagonal Mar', country: 'Barcelona', latlng: [41.4096, 2.2162] },
];

const parkingData = [
  // CUBIERTO (4)
  { title: 'Parking Cubierto Passeig de Gràcia Premium', description: 'Estacionamiento cubierto en pleno Passeig de Gràcia. Protección total contra la intemperie. Acceso 24h con seguridad vigilada.', category: 'Cubierto', capacity: 50, levelCount: 3, price: 5 },
  { title: 'Parking Cubierto Diagonal', description: 'Amplio parking totalmente cubierto en Diagonal. Iluminación LED y ventilación moderna. Espacios protegidos del clima.', category: 'Cubierto', capacity: 80, levelCount: 4, price: 4 },
  { title: 'Parking Cubierto Sarrià', description: 'Parking cerrado en zona premium de Sarrià. Totalmente techado, limpio y bien mantenido. Ideal para vehículos de lujo.', category: 'Cubierto', capacity: 35, levelCount: 2, price: 6 },
  { title: 'Parking Cubierto Forum', description: 'Moderno parking cubierto cerca del Fòrum. Protección completa contra lluvia y sol. Acceso directo al metro.', category: 'Cubierto', capacity: 120, levelCount: 5, price: 3 },
  
  // VIGILADO (4)
  { title: 'Parking Vigilado La Rambla', description: 'Vigilancia 24/7 en La Rambla. Personal de seguridad en todo momento. Videovigilancia completa y control de acceso.', category: 'Vigilado', capacity: 80, levelCount: 4, price: 6 },
  { title: 'Parking Vigilado Plaza España', description: 'Seguridad máxima cerca de Plaza España. Vigilantes 24h, cámaras en todas las plantas. Rondas continuas de seguridad.', category: 'Vigilado', capacity: 150, levelCount: 6, price: 5 },
  { title: 'Parking Vigilado Born', description: 'Vigilancia profesional en el Born. Sistema de alarma avanzado y control de entrada con tarjeta personal.', category: 'Vigilado', capacity: 60, levelCount: 3, price: 7 },
  { title: 'Parking Vigilado Pedralbes', description: 'Máxima seguridad en zona exclusiva. Acceso controlado por biometría y videovigilancia HD. Personal entrenado.', category: 'Vigilado', capacity: 40, levelCount: 2, price: 8 },
  
  // SUBTERRÁNEO (4)
  { title: 'Parking Subterráneo Sagrada Familia', description: 'Tres plantas bajo tierra cerca de la Sagrada Familia. Espacios amplios con iluminación LED y ventilación constante.', category: 'Subterráneo', capacity: 120, levelCount: 3, price: 4 },
  { title: 'Parking Subterráneo Hospital Clínic', description: 'Parking bajo tierra junto al Hospital Clínic. Señalización clara y acceso fácil. Ideal para visitas médicas.', category: 'Subterráneo', capacity: 200, levelCount: 4, price: 3 },
  { title: 'Parking Subterráneo Arc de Triomf', description: 'Dos niveles subterráneos con tecnología moderna. Cerca del Arc de Triomf y acceso directo al parque.', category: 'Subterráneo', capacity: 90, levelCount: 2, price: 4 },
  { title: 'Parking Subterráneo Montjuïc', description: 'Parking excavado en Montjuïc. Ambiente fresco natural, muy seguro. Acceso a jardines y museos cercanos.', category: 'Subterráneo', capacity: 75, levelCount: 3, price: 3 },
  
  // CENTRO (4)
  { title: 'Parking Centro Plaça Catalunya', description: 'Corazón de Barcelona. Acceso a metro, autobuses y todos los puntos turísticos. Ubicación inmejorable.', category: 'Centro', capacity: 200, levelCount: 7, price: 7 },
  { title: 'Parking Centro Portal de l\'Àngel', description: 'Zona peatonal comercial más importante. A pasos de todas las tiendas del centro histórico y El Corte Inglés.', category: 'Centro', capacity: 150, levelCount: 5, price: 6 },
  { title: 'Parking Centro Jaume I', description: 'Centro histórico junto a Jaume I. Acceso rápido al Barrio Gótico y museo Picasso. Parking moderno en corazón medieval.', category: 'Centro', capacity: 80, levelCount: 3, price: 6 },
  { title: 'Parking Centro Universitat', description: 'Pleno centro universitario y comercial. Cerca de Plaça Universitat, FNAC y todo el comercio. Excelente conectividad.', category: 'Centro', capacity: 110, levelCount: 4, price: 5 },
  
  // RESIDENCIAL (4)
  { title: 'Parking Residencial Gràcia', description: 'Zona tranquila de Gràcia. Ideal para residentes con abonos mensuales. Ambiente familiar y plazas reservadas.', category: 'Residencial', capacity: 40, levelCount: 2, price: 2 },
  { title: 'Parking Residencial Horta', description: 'Barrio tranquilo de Horta. Tarifa especial para residentes con plaza fija mensual. Comunidad de vecinos.', category: 'Residencial', capacity: 50, levelCount: 3, price: 2 },
  { title: 'Parking Residencial Nou Barris', description: 'Parking comunitario en Nou Barris. Ambiente de barrio seguro. Descuentos especiales para residentes del área.', category: 'Residencial', capacity: 60, levelCount: 3, price: 2 },
  { title: 'Parking Residencial Sant Andreu', description: 'Zona residencial de Sant Andreu. Ambiente familiar con plazas fijas disponibles. Tarifas muy competitivas.', category: 'Residencial', capacity: 45, levelCount: 2, price: 2 },
  
  // COMERCIAL (4)
  { title: 'Parking Comercial Diagonal Mar', description: 'Junto al centro comercial Diagonal Mar. Conexión directa al centro comercial. Validación de ticket con compras.', category: 'Comercial', capacity: 300, levelCount: 8, price: 4 },
  { title: 'Parking Comercial La Maquinista', description: 'Mayor centro comercial de Barcelona. Parking enorme con acceso a todas las tiendas. Descuentos por compras.', category: 'Comercial', capacity: 400, levelCount: 10, price: 3 },
  { title: 'Parking Comercial Glòries', description: 'Conectado al centro comercial Glòries. Acceso directo por puentes peatonales. Tickets con descuento.', category: 'Comercial', capacity: 250, levelCount: 7, price: 4 },
  { title: 'Parking Comercial L\'Illa Diagonal', description: 'L\'Illa Diagonal exclusivo. Parking de lujo para shopping de alta gama. Servicio valet disponible fines de semana.', category: 'Comercial', capacity: 180, levelCount: 6, price: 5 },
  
  // AEROPUERTO (4)
  { title: 'Parking Aeropuerto T1', description: 'A 3 minutos del Aeropuerto T1. Shuttle gratuito cada 10 min. Tarifas semanales para viajes largos.', category: 'Aeropuerto', capacity: 500, levelCount: 12, price: 3 },
  { title: 'Parking Aeropuerto T2', description: 'Cerca de Terminal 2. Traslado gratuito en bus cada 15 min. Seguridad 24h y tarifas especiales larga estancia.', category: 'Aeropuerto', capacity: 400, levelCount: 10, price: 3 },
  { title: 'Parking Aeropuerto Low Cost', description: 'Opción más económica cerca del aeropuerto. Parking exterior vigilado con shuttle cada 20 min. Ideal para vacaciones.', category: 'Aeropuerto', capacity: 300, levelCount: 8, price: 2 },
  { title: 'Parking Aeropuerto Premium', description: 'Servicio VIP en el aeropuerto. Parking cubierto, lavado incluido, traslado inmediato. Perfecto para ejecutivos.', category: 'Aeropuerto', capacity: 150, levelCount: 4, price: 6 },
  
  // ESTACIÓN (4)
  { title: 'Parking Estación Sants', description: 'Junto a estación de Sants. Conexión directa con AVE, Cercanías, metro y autobuses. Ideal para viajeros.', category: 'Estación', capacity: 250, levelCount: 8, price: 4 },
  { title: 'Parking Estación Passeig de Gràcia', description: 'Principal estación del centro. Conexión con todas las líneas de metro y Renfe. Ubicación inmejorable.', category: 'Estación', capacity: 180, levelCount: 6, price: 5 },
  { title: 'Parking Estación França', description: 'Histórica estación de França. Parking moderno para viajes regionales. Cerca del Born y Barceloneta.', category: 'Estación', capacity: 120, levelCount: 4, price: 4 },
  { title: 'Parking Estación Clot', description: 'Junto a estación Clot-Aragó. Gran intercambiador de transporte. Perfecto para park & ride al centro.', category: 'Estación', capacity: 200, levelCount: 6, price: 3 },
  
  // PLAYA (4)
  { title: 'Parking Playa Barceloneta', description: 'A 50m de la playa Barceloneta. Disfruta del Mediterráneo sin preocupaciones. Ambiente playero garantizado.', category: 'Playa', capacity: 150, levelCount: 5, price: 5 },
  { title: 'Parking Playa Nova Icària', description: 'Frente a playa Nova Icària. Parking ideal para día de playa familiar. Duchas y vestuarios cercanos.', category: 'Playa', capacity: 120, levelCount: 4, price: 5 },
  { title: 'Parking Playa Bogatell', description: 'Junto a playa del Bogatell. Acceso directo a la arena. Perfecto para deportes acuáticos y chiringuitos.', category: 'Playa', capacity: 100, levelCount: 3, price: 4 },
  { title: 'Parking Playa Mar Bella', description: 'Zona moderna de Mar Bella. Parking con áreas verdes. Cerca de instalaciones deportivas y zona canina.', category: 'Playa', capacity: 90, levelCount: 3, price: 4 },
  
  // EVENTOS (4)
  { title: 'Parking Camp Nou', description: 'A 200m del Camp Nou. Ideal para partidos del Barça. Gran capacidad y salida rápida post-evento.', category: 'Eventos', capacity: 400, levelCount: 10, price: 7 },
  { title: 'Parking Palau Sant Jordi', description: 'Junto al Palau Sant Jordi en Montjuïc. Perfecto para conciertos y eventos masivos. Sistema de salida eficiente.', category: 'Eventos', capacity: 350, levelCount: 9, price: 6 },
  { title: 'Parking Fira Barcelona', description: 'En recinto Fira Barcelona Montjuïc. Ideal para ferias y congresos. Acceso directo a pabellones de exposición.', category: 'Eventos', capacity: 500, levelCount: 12, price: 5 },
  { title: 'Parking Palau de la Música', description: 'Cerca del Palau de la Música Catalana. Perfecto para conciertos de música clásica y eventos culturales.', category: 'Eventos', capacity: 80, levelCount: 3, price: 6 },
  
  // NOCTURNO (4)
  { title: 'Parking Nocturno Born 24h', description: 'Abierto 24h en el Born. Perfecto para vida nocturna, bares y restaurantes. Salida rápida a cualquier hora.', category: 'Nocturno', capacity: 70, levelCount: 3, price: 4 },
  { title: 'Parking Nocturno Raval', description: '24h en corazón del Raval. Zona de marcha y discotecas. Personal de noche y máxima seguridad nocturna.', category: 'Nocturno', capacity: 90, levelCount: 4, price: 3 },
  { title: 'Parking Nocturno Poble Sec', description: 'Toda la noche en Poble Sec. Ideal para teatro y espectáculos. Ambiente seguro 24h con vigilancia reforzada.', category: 'Nocturno', capacity: 60, levelCount: 3, price: 3 },
  { title: 'Parking Nocturno Poblenou', description: '24h en el moderno Poblenou. Zona de ocio alternativo. Vigilancia extra en horario de madrugada.', category: 'Nocturno', capacity: 55, levelCount: 2, price: 4 },
  
  // ELÉCTRICO (4)
  { title: 'Parking Eléctrico 22@', description: '25 cargadores Tesla y universales en distrito 22@. Carga rápida mientras trabajas. Perfecto para empresas tech.', category: 'Eléctrico', capacity: 50, levelCount: 2, price: 5 },
  { title: 'Parking Eléctrico Diagonal', description: '30 puntos de recarga para vehículos eléctricos. Cargadores super-rápidos hasta 150kW. Tarifa plana de carga.', category: 'Eléctrico', capacity: 60, levelCount: 3, price: 6 },
  { title: 'Parking Eléctrico Glòries', description: 'Parking sostenible con 40 cargadores. Compatible con todos los modelos. Energía 100% renovable certificada.', category: 'Eléctrico', capacity: 70, levelCount: 3, price: 5 },
  { title: 'Parking Eléctrico Fira', description: 'Parking eco-friendly con cargadores Type 2 y CCS. Ideal para flotas eléctricas. Descuentos por recarga frecuente.', category: 'Eléctrico', capacity: 45, levelCount: 2, price: 5 },
  
  // AMPLIO (4)
  { title: 'Parking Amplio Montjuïc XXL', description: 'Espacios XXL para SUVs y furgonetas. Altura libre de 3.5m. Sin columnas, maniobra fácil y cómoda.', category: 'Amplio', capacity: 80, levelCount: 4, price: 4 },
  { title: 'Parking Amplio Zona Franca', description: 'Diseñado para camiones y furgonetas de carga. Plazas extra anchas 3x5m. Acceso directo desde ronda.', category: 'Amplio', capacity: 100, levelCount: 5, price: 3 },
  { title: 'Parking Amplio Fòrum', description: 'Plazas gigantes para coches grandes. Pasillos de 6m de ancho para girar fácilmente. Ideal para familias.', category: 'Amplio', capacity: 90, levelCount: 4, price: 4 },
  { title: 'Parking Amplio Diagonal Mar', description: 'Espacios oversized en planta baja. Ideal para vehículos adaptados. Rampas suaves sin escalones.', category: 'Amplio', capacity: 75, levelCount: 3, price: 5 },
  
  // ECONÓMICO (4)
  { title: 'Parking Económico Raval', description: 'El más barato del centro. Solo 2€/hora. Tarifas para larga estancia. Abonos mensuales desde 60€.', category: 'Económico', capacity: 120, levelCount: 5, price: 2 },
  { title: 'Parking Económico Hospitalet', description: 'Precios inmejorables en L\'Hospitalet. Metro a 2 min. Perfecto para ir al centro sin pagar precio centro.', category: 'Económico', capacity: 200, levelCount: 6, price: 2 },
  { title: 'Parking Económico Nou Barris', description: 'Tarifa súper reducida. 1.50€/hora. Conexión directa con metro L4. Aprovecha precios de barrio periférico.', category: 'Económico', capacity: 150, levelCount: 5, price: 2 },
  { title: 'Parking Económico Bellvitge', description: 'El más económico de la zona. Parking exterior vigilado. Shuttle gratis a metro. 1€/hora tarifa nocturna.', category: 'Económico', capacity: 180, levelCount: 6, price: 2 },
  
  // PREMIUM (4)
  { title: 'Parking Premium Marítim', description: 'Lujo con vista al mar. Valet parking, lavado incluido, mantenimiento básico. Experience Premium completa.', category: 'Premium', capacity: 40, levelCount: 2, price: 10 },
  { title: 'Parking Premium Hotel W', description: 'VIP junto al Hotel W. Servicio de conserjería, lavado ecológico, revisión de neumáticos. Solo clientes exclusivos.', category: 'Premium', capacity: 35, levelCount: 2, price: 12 },
  { title: 'Parking Premium Pedralbes', description: 'Zona más exclusiva de Barcelona. Plazas climatizadas individuales. Seguridad máxima y total discreción.', category: 'Premium', capacity: 30, levelCount: 1, price: 11 },
  { title: 'Parking Premium Diagonal', description: 'Servicio cinco estrellas. Valet parking, carga eléctrica, limpieza interior. Boxes privados disponibles.', category: 'Premium', capacity: 25, levelCount: 1, price: 9 },
];

async function main() {
  console.log('🅿️ Iniciando seed de huecoPark para Barcelona...\n');

  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@huecopark.com' },
    update: {},
    create: {
      email: 'demo@huecopark.com',
      name: 'Usuario Demo',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuario demo creado: demo@huecopark.com / demo123\n');

  // Crear parkings en Barcelona
  for (let i = 0; i < parkingData.length; i++) {
    const parking = parkingData[i];
    const location = barcelonaLocations[i % barcelonaLocations.length];
    const image = parkingImages[i % parkingImages.length];

    await prisma.listing.create({
      data: {
        title: parking.title,
        description: parking.description,
        imageSrc: image,
        category: parking.category,
        capacity: parking.capacity,
        levelCount: parking.levelCount,
        price: parking.price,
        country: location.country,
        region: location.region,
        latlng: location.latlng,
        userId: demoUser.id,
      },
    });

    console.log(`✅ Creado: ${parking.title} en ${location.region}`);
  }

  console.log(`\n🎉 ¡Seed completado! ${parkingData.length} parkings creados en Barcelona.`);
  console.log('\n📍 Zonas cubiertas:');
  const uniqueRegions = [...new Set(barcelonaLocations.map(l => l.region))];
  uniqueRegions.forEach(region => console.log(`   - ${region}`));
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
