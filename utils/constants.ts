import { TbBeach, TbParking, TbBolt, TbCar } from "react-icons/tb";
import {
  GiCctvCamera,
  GiStairs,
  GiModernCity,
  GiHouse,
  GiShoppingCart,
  GiCommercialAirplane,
  GiRailway,
  GiMusicSpell,
  GiNightSleep,
  GiResize,
  GiMoneyStack,
  GiDiamondTrophy,
} from "react-icons/gi";
import { BsBuilding } from "react-icons/bs";
import { MdLocalParking, MdSecurity } from "react-icons/md";

export const categories = [
  {
    label: "Cubierto",
    icon: BsBuilding,
    description: "Estacionamiento techado y protegido",
  },
  {
    label: "Vigilado",
    icon: GiCctvCamera,
    description: "Parking con vigilancia 24/7",
  },
  {
    label: "Subterráneo",
    icon: GiStairs,
    description: "Estacionamiento bajo tierra",
  },
  {
    label: "Centro",
    icon: GiModernCity,
    description: "Ubicado en el centro de la ciudad",
  },
  {
    label: "Residencial",
    icon: GiHouse,
    description: "En zona residencial tranquila",
  },
  {
    label: "Comercial",
    icon: GiShoppingCart,
    description: "Cerca de centros comerciales",
  },
  {
    label: "Aeropuerto",
    icon: GiCommercialAirplane,
    description: "Parking cercano al aeropuerto",
  },
  {
    label: "Estación",
    icon: GiRailway,
    description: "Próximo a estaciones de transporte",
  },
  {
    label: "Playa",
    icon: TbBeach,
    description: "Estacionamiento cerca de la playa",
  },
  {
    label: "Eventos",
    icon: GiMusicSpell,
    description: "Para eventos y conciertos",
  },
  {
    label: "Nocturno",
    icon: GiNightSleep,
    description: "Disponible 24 horas",
  },
  {
    label: "Eléctrico",
    icon: TbBolt,
    description: "Con cargadores para vehículos eléctricos",
  },
  {
    label: "Amplio",
    icon: GiResize,
    description: "Espacios amplios para vehículos grandes",
  },
  {
    label: "Económico",
    icon: GiMoneyStack,
    description: "Tarifas accesibles y económicas",
  },
  {
    label: "Premium",
    icon: GiDiamondTrophy,
    description: "Estacionamiento de lujo con servicios",
  },
];

export const LISTINGS_BATCH = 16;

export const menuItems = [
  {
    label: "Mapa de parkings",
    path: "/mapa",
  },
  {
    label: "Mi perfil",
    path: "/profile",
  },
  {
    label: "Mensajes",
    path: "/mensajes",
  },
  {
    label: "Mis reservas",
    path: "/mis-reservas",
  },
  {
    label: "Mis favoritos",
    path: "/favorites",
  },
  {
    label: "Reservas recibidas",
    path: "/reservations",
  },
  {
    label: "Mis parkings",
    path: "/properties",
  },
];
