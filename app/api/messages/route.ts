import { NextRequest } from "next/server";
import { getCurrentUser } from "@/services/user";
import { 
  getConversations, 
  createConversation, 
  sendMessage,
  getConversation 
} from "@/services/messages";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser?.id) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conversations = await getConversations(currentUser.id);
    
    return new Response(JSON.stringify({ conversations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener mensajes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser?.id) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { action, conversationId, listingId, listingTitle, recipientId, message } = body;

    if (action === "create") {
      // Create new conversation
      const participantIds = [currentUser.id, recipientId].filter(Boolean);
      const conversation = await createConversation(
        listingId,
        listingTitle,
        participantIds,
        message
      );
      
      return new Response(JSON.stringify({ conversation }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "send") {
      // Send message to existing conversation
      const newMessage = await sendMessage(conversationId, currentUser.id, message);
      
      if (!newMessage) {
        return new Response(JSON.stringify({ error: "Conversación no encontrada" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ message: newMessage }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Acción no válida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al procesar mensaje" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
