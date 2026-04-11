import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export interface ConversationItem {
  userId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
}

export interface AvailableUser {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl;

  private authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getConversations(): Promise<ConversationItem[]> {
    const response = await fetch(`${this.apiUrl}/conversations`, {
      headers: this.authHeaders(),
    });
    if (!response.ok) {
      throw new Error(`GET /conversations failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async getAvailableUsers(role?: 'freelancer' | 'client'): Promise<AvailableUser[]> {
    const url = new URL(`${this.apiUrl}/users/available`);
    if (role) {
      url.searchParams.set('role', role);
    }

    const response = await fetch(url.toString(), {
      headers: this.authHeaders(),
    });

    if (!response.ok) {
      throw new Error(`GET /users/available failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async getMessages(recipientId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${this.apiUrl}/messages/${recipientId}`, {
      headers: this.authHeaders(),
    });
    if (!response.ok) {
      throw new Error(`GET /messages/:recipientId failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async sendMessage(payload: { text: string; recipientId: string }): Promise<ChatMessage> {
    const response = await fetch(`${this.apiUrl}/messages`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`POST /messages failed with status ${response.status}`);
    }

    return response.json();
  }
}
