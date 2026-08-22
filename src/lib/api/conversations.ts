import { apiClient } from './client';

export interface BackendConversation {
  id: string;
  participant_names: string[];
  last_message?: string;
  last_message_time?: string;
  unread: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BackendMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  timestamp?: string;
}

export const conversationsApi = {
  async getConversations(token?: string): Promise<BackendConversation[]> {
    return apiClient<BackendConversation[]>('/conversations/', { token });
  },

  async getConversation(id: string, token?: string): Promise<BackendConversation> {
    return apiClient<BackendConversation>(`/conversations/${id}`, { token });
  },

  async getMessages(conversationId: string, token?: string): Promise<BackendMessage[]> {
    return apiClient<BackendMessage[]>(`/conversations/${conversationId}/messages`, { token });
  },

  async sendMessage(conversationId: string, text: string, token?: string): Promise<BackendMessage> {
    return apiClient<BackendMessage>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      token,
    });
  },

  async createConversation(participant_names: string[], initial_message?: string, token?: string): Promise<BackendConversation> {
    return apiClient<BackendConversation>('/conversations/', {
      method: 'POST',
      body: JSON.stringify({ participant_names, initial_message }),
      token,
    });
  },
};
