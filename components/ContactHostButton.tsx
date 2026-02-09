"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMessages } from "@/hooks/useMessages";

interface ContactHostButtonProps {
  listingId: string;
  listingTitle: string;
  hostId: string;
  hostName: string;
}

const ContactHostButton: React.FC<ContactHostButtonProps> = ({
  listingId,
  listingTitle,
  hostId,
  hostName,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const currentUserId = session?.user?.id || "";
  const currentUserName = session?.user?.name || "Usuario";
  const { createConversation } = useMessages(currentUserId);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleContact = () => {
    if (!session) {
      toast.error("Por favor inicia sesión para contactar al anfitrión");
      return;
    }

    if (currentUserId === hostId) {
      toast.error("No puedes contactarte a ti mismo");
      return;
    }

    setIsOpen(true);
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Por favor escribe un mensaje");
      return;
    }

    const conv = createConversation(
      listingId,
      listingTitle,
      hostId,
      hostName,
      currentUserName,
      message
    );

    if (conv) {
      toast.success("Mensaje enviado");
      setIsOpen(false);
      setMessage("");
      router.push("/mensajes");
    } else {
      toast.error("Error al enviar mensaje");
    }
  };

  if (isOpen) {
    return (
      <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden p-4 mb-4">
        <h3 className="font-semibold mb-2">Contactar al anfitrión</h3>
        <p className="text-sm text-gray-600 mb-3">
          Pregunta sobre disponibilidad, acceso o cualquier detalle del parking
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          className="w-full border rounded-lg p-3 mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Enviar mensaje
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setMessage("");
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        onClick={handleContact}
        className="w-full bg-white border-2 border-green-500 text-green-600 py-3 rounded-lg hover:bg-green-50 font-semibold flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        Contactar al anfitrión
      </button>
    </div>
  );
};

export default ContactHostButton;
