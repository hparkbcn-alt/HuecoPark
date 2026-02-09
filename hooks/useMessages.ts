import { useState, useEffect } from "react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  participantIds: string[];
  participantNames: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "huecopark_messages";

export const useMessages = (currentUserId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  const loadConversations = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allConversations: Conversation[] = stored ? JSON.parse(stored) : [];
      
      if (currentUserId) {
        const filtered = allConversations.filter((conv) =>
          conv.participantIds.includes(currentUserId)
        );
        setConversations(filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const saveConversations = (convs: Conversation[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allConversations: Conversation[] = stored ? JSON.parse(stored) : [];
      
      // Update or add conversations
      convs.forEach((conv) => {
        const idx = allConversations.findIndex((c) => c.id === conv.id);
        if (idx >= 0) {
          allConversations[idx] = conv;
        } else {
          allConversations.push(conv);
        }
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allConversations));
      loadConversations();
    } catch (error) {
      console.error("Error saving conversations:", error);
    }
  };

  const createConversation = (
    listingId: string,
    listingTitle: string,
    recipientId: string,
    recipientName: string,
    currentUserName: string,
    initialMessage?: string
  ): Conversation | null => {
    if (!currentUserId) return null;

    // Check if conversation exists
    const existing = conversations.find(
      (conv) =>
        conv.listingId === listingId &&
        conv.participantIds.includes(recipientId) &&
        conv.participantIds.includes(currentUserId)
    );

    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage, currentUserName);
      }
      return existing;
    }

    const conversation: Conversation = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      listingId,
      listingTitle,
      participantIds: [currentUserId, recipientId],
      participantNames: [currentUserName, recipientName],
      messages: initialMessage
        ? [
            {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              senderId: currentUserId,
              senderName: currentUserName,
              text: initialMessage,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveConversations([conversation]);
    return conversation;
  };

  const sendMessage = (conversationId: string, text: string, senderName: string) => {
    if (!currentUserId) return;

    const conversation = conversations.find((conv) => conv.id === conversationId);
    if (!conversation) return;

    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      senderId: currentUserId,
      senderName,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();
    saveConversations([conversation]);
  };

  const markAsRead = (conversationId: string) => {
    if (!currentUserId) return;

    const conversation = conversations.find((conv) => conv.id === conversationId);
    if (!conversation) return;

    conversation.messages.forEach((msg) => {
      if (msg.senderId !== currentUserId) {
        msg.read = true;
      }
    });

    saveConversations([conversation]);
  };

  const getUnreadCount = () => {
    if (!currentUserId) return 0;
    
    let count = 0;
    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        if (msg.senderId !== currentUserId && !msg.read) {
          count++;
        }
      });
    });
    return count;
  };

  return {
    conversations,
    loading,
    createConversation,
    sendMessage,
    markAsRead,
    getUnreadCount,
    refresh: loadConversations,
  };
};
