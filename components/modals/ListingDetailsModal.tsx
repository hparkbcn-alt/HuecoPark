"use client";

import React, { useState, useTransition } from "react";
import { FiX, FiEdit, FiTrash2, FiMessageCircle, FiCalendar, FiUser, FiMapPin, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { formatPrice } from "@/utils/helper";
import Button from "../Button";
import SpinnerMini from "../Loader";

interface HistoryEvent {
  event: string;
  timestamp: string | Date;
  description: string;
}

interface Reservation {
  id: string;
  userId: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  status?: string;
  history?: HistoryEvent[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  price: number;
  region: string;
  country: string;
  userId: string;
}

interface ListingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  reservation?: Reservation;
  context: "myProperty" | "myReservation" | "reservationReceived";
  currentUserId?: string;
  reservationUserName?: string;
}

const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  isOpen,
  onClose,
  listing,
  reservation,
  context,
  currentUserId,
  reservationUserName = "Usuario",
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<"listing" | "reservation">("listing");
  const [deleteMessage, setDeleteMessage] = useState("");

  if (!isOpen) return null;

  const handleEdit = () => {
    toast.success("Funcionalidad de edición próximamente");
    onClose();
  };

  const handleDeleteClick = (type: "listing" | "reservation", message: string) => {
    setDeleteType(type);
    setDeleteMessage(message);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        if (deleteType === "listing") {
          // Eliminar parking
          toast.success("Parking eliminado correctamente (demo)");
          router.refresh();
          onClose();
        } else if (deleteType === "reservation" && reservation) {
          // Cancelar reserva
          toast.success("Reserva cancelada correctamente (demo)");
          router.refresh();
          onClose();
        }
        setShowDeleteConfirm(false);
      } catch (error: any) {
        toast.error(error.message || "Ocurrió un error");
      }
    });
  };

  const handleAcceptReservation = () => {
    toast.success("Reserva aceptada correctamente");
    router.refresh();
    onClose();
  };

  const handleRejectReservation = () => {
    startTransition(async () => {
      try {
        if (reservation) {
          const res = await fetch(`/api/reservations/${reservation.id}`, {
            method: "DELETE",
          });
          
          if (!res.ok) throw new Error("Error al rechazar");
          
          toast.success("Reserva rechazada");
          router.refresh();
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || "Ocurrió un error");
      }
    });
  };

  const handleContact = () => {
    router.push("/mensajes");
    onClose();
  };

  const handleViewListing = () => {
    router.push(`/listings/${listing.id}`);
    onClose();
  };

  const startDate = reservation ? new Date(reservation.startDate) : null;
  const endDate = reservation ? new Date(reservation.endDate) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative">
          <div className="aspect-[16/9] relative">
            <Image
              src={listing.imageSrc}
              alt={listing.title}
              fill
              className="object-cover rounded-t-2xl"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Location */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {listing.title}
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin size={16} />
              <span>{listing.region}, {listing.country}</span>
            </div>
          </div>

          {/* Category & Price */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Categoría</span>
              <p className="font-semibold">{listing.category}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Precio</span>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(listing.price)}€<span className="text-sm font-normal text-gray-500">/hora</span>
              </p>
            </div>
          </div>

          {/* Reservation Details */}
          {reservation && startDate && endDate && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FiCalendar className="text-green-600" size={20} />
                <h3 className="font-semibold text-green-900">Detalles de la Reserva</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha inicio:</span>
                  <span className="font-medium">
                    {format(startDate, "PPP 'a las' HH:mm", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha fin:</span>
                  <span className="font-medium">
                    {format(endDate, "PPP 'a las' HH:mm", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-600 font-semibold">Total:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatPrice(reservation.totalPrice)}€
                  </span>
                </div>
              </div>
              
              {context === "reservationReceived" && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <FiUser size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-600">Reservado por:</span>
                    <span className="font-medium">{reservationUserName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Timeline */}
          {reservation && reservation.history && reservation.history.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="text-blue-600" size={20} />
                <h3 className="font-semibold text-blue-900">Historial de Eventos</h3>
              </div>
              <div className="space-y-3">
                {reservation.history.map((event, index) => {
                  const eventDate = new Date(event.timestamp);
                  const isLastEvent = index === reservation.history!.length - 1;
                  
                  // Iconos según el tipo de evento
                  let eventIcon;
                  let eventColor = "bg-gray-400";
                  
                  switch (event.event) {
                    case "created":
                      eventIcon = "📝";
                      eventColor = "bg-blue-400";
                      break;
                    case "accepted":
                      eventIcon = "✅";
                      eventColor = "bg-green-500";
                      break;
                    case "rejected":
                      eventIcon = "❌";
                      eventColor = "bg-red-500";
                      break;
                    case "checked_in":
                      eventIcon = "🚗➡️";
                      eventColor = "bg-purple-500";
                      break;
                    case "checked_out":
                      eventIcon = "🚗⬅️";
                      eventColor = "bg-orange-500";
                      break;
                    case "completed":
                      eventIcon = "✔️";
                      eventColor = "bg-green-600";
                      break;
                    case "cancelled":
                      eventIcon = "🚫";
                      eventColor = "bg-gray-500";
                      break;
                    default:
                      eventIcon = "•";
                      eventColor = "bg-gray-400";
                  }
                  
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`${eventColor} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs flex-shrink-0`}>
                          {eventIcon}
                        </div>
                        {!isLastEvent && (
                          <div className="w-0.5 bg-blue-200 flex-1 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="font-medium text-gray-900 text-sm">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(eventDate, "PPP 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {context === "myProperty" && (
              <>
                <Button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={isPending}
                >
                  <FiEdit size={18} />
                  Editar Parking
                </Button>
                <Button
                  onClick={() => handleDeleteClick("listing", "¿Estás seguro de que deseas eliminar este parking?")}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                  disabled={isPending}
                >
                  {isPending ? <SpinnerMini /> : <><FiTrash2 size={18} /> Eliminar Parking</>}
                </Button>
                <Button
                  onClick={handleViewListing}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  Ver Página Completa
                </Button>
              </>
            )}

            {context === "myReservation" && (
              <>
                <Button
                  onClick={handleContact}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <FiMessageCircle size={18} />
                  Contactar al Propietario
                </Button>
                <Button
                  onClick={() => handleDeleteClick("reservation", "¿Estás seguro de que deseas cancelar esta reserva?")}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                  disabled={isPending}
                >
                  {isPending ? <SpinnerMini /> : <><FiXCircle size={18} /> Cancelar Reserva</>}
                </Button>
                <Button
                  onClick={handleViewListing}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  Ver Parking Completo
                </Button>
              </>
            )}

            {context === "reservationReceived" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleAcceptReservation}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                    disabled={isPending}
                  >
                    {isPending ? <SpinnerMini /> : <><FiCheckCircle size={18} /> Aceptar</>}
                  </Button>
                  <Button
                    onClick={handleRejectReservation}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                    disabled={isPending}
                  >
                    {isPending ? <SpinnerMini /> : <><FiXCircle size={18} /> Rechazar</>}
                  </Button>
                </div>
                <Button
                  onClick={handleContact}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FiMessageCircle size={18} />
                  Contactar a {reservationUserName}
                </Button>
                <Button
                  onClick={handleViewListing}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  Ver Mi Parking
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Confirmar Acción
            </h3>
            <p className="text-gray-600 mb-6">
              {deleteMessage}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 flex items-center justify-center"
                disabled={isPending}
              >
                {isPending ? <SpinnerMini /> : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailsModal;
