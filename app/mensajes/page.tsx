"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMessages, Conversation } from "@/hooks/useMessages";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export default function MessagesPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "";
  const currentUserName = session?.user?.name || "Usuario";
  
  const { conversations, loading, sendMessage, markAsRead, getUnreadCount } = useMessages(currentUserId);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (selectedConv) {
      markAsRead(selectedConv.id);
    }
  }, [selectedConv]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedConv) return;
    sendMessage(selectedConv.id, messageText, currentUserName);
    setMessageText("");
  };

  if (!session) {
    return (
      <div className="main-container py-12">
        <EmptyState
          title="Inicia sesión"
          subtitle="Debes iniciar sesión para ver tus mensajes"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-container py-12">
        <div className="text-center">Cargando mensajes...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="main-container py-12">
        <EmptyState
          title="No tienes mensajes"
          subtitle="Cuando contactes a un anfitrión o alguien te contacte, aparecerán aquí"
          showReset
        />
      </div>
    );
  }

  return (
    <div className="main-container py-6">
      <h1 className="text-2xl font-bold mb-6">Mensajes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Lista de conversaciones */}
        <div className="md:col-span-1 border rounded-lg overflow-y-auto">
          {conversations.map((conv) => {
            const otherParticipantName = conv.participantNames.find(
              (name, idx) => conv.participantIds[idx] !== currentUserId
            ) || "Usuario";
            const lastMessage = conv.messages[conv.messages.length - 1];
            const unread = conv.messages.filter(
              (msg) => msg.senderId !== currentUserId && !msg.read
            ).length;

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConv?.id === conv.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm">{otherParticipantName}</h3>
                  {unread > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{conv.listingTitle}</p>
                {lastMessage && (
                  <p className="text-xs text-gray-500 truncate">
                    {lastMessage.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Área de chat */}
        <div className="md:col-span-2 border rounded-lg flex flex-col">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">
                  {selectedConv.participantNames.find(
                    (name, idx) => selectedConv.participantIds[idx] !== currentUserId
                  )}
                </h2>
                <Link href={`/listings/${selectedConv.listingId}`}>
                  <p className="text-sm text-gray-600 hover:underline">
                    {selectedConv.listingTitle}
                  </p>
                </Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedConv.messages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecciona una conversación para ver los mensajes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
