import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface ApiMessage {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  async getMessages(): Promise<ApiMessage[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`GET /messages failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async sendMessage(payload: { text: string; sender: string }): Promise<ApiMessage> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`POST /messages failed with status ${response.status}`);
    }

    return response.json();
  }
}
