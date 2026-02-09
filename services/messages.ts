import fs from "fs";
import path from "path";
import { getCurrentUser } from "./user";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  participantIds: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface MessagesData {
  conversations: Conversation[];
}

const messagesFilePath = path.join(process.cwd(), "data", "messages.json");

const readMessages = (): MessagesData => {
  try {
    const fileContent = fs.readFileSync(messagesFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return { conversations: [] };
  }
};

const writeMessages = (data: MessagesData) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const data = readMessages();
  return data.conversations.filter((conv) => 
    conv.participantIds.includes(userId)
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getConversation = async (conversationId: string): Promise<Conversation | null> => {
  const data = readMessages();
  return data.conversations.find((conv) => conv.id === conversationId) || null;
};

export const createConversation = async (
  listingId: string,
  listingTitle: string,
  participantIds: string[],
  initialMessage?: string
): Promise<Conversation> => {
  const data = readMessages();
  const currentUser = await getCurrentUser();
  
  // Check if conversation already exists
  const existing = data.conversations.find(
    (conv) =>
      conv.listingId === listingId &&
      conv.participantIds.every((id) => participantIds.includes(id)) &&
      participantIds.every((id) => conv.participantIds.includes(id))
  );

  if (existing) {
    if (initialMessage && currentUser) {
      const message: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        senderId: currentUser.id || "",
        text: initialMessage,
        createdAt: new Date().toISOString(),
        read: false,
      };
      existing.messages.push(message);
      existing.updatedAt = new Date().toISOString();
      writeMessages(data);
    }
    return existing;
  }

  const conversation: Conversation = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    listingId,
    listingTitle,
    participantIds,
    messages: initialMessage && currentUser
      ? [
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            senderId: currentUser.id || "",
            text: initialMessage,
            createdAt: new Date().toISOString(),
            read: false,
          },
        ]
      : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.conversations.push(conversation);
  writeMessages(data);
  return conversation;
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  text: string
): Promise<Message | null> => {
  const data = readMessages();
  const conversation = data.conversations.find((conv) => conv.id === conversationId);

  if (!conversation) return null;

  const message: Message = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    senderId,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };

  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();
  writeMessages(data);
  return message;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  const data = readMessages();
  const conversation = data.conversations.find((conv) => conv.id === conversationId);

  if (!conversation) return;

  conversation.messages.forEach((msg) => {
    if (msg.senderId !== userId) {
      msg.read = true;
    }
  });

  writeMessages(data);
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const data = readMessages();
  let count = 0;
  
  data.conversations
    .filter((conv) => conv.participantIds.includes(userId))
    .forEach((conv) => {
      conv.messages.forEach((msg) => {
        if (msg.senderId !== userId && !msg.read) {
          count++;
        }
      });
    });

  return count;
};
