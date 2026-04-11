export interface Conversation {
  id: string;
  userId: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

export interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export interface Contact {
  name: string;
  online: boolean;
  avatar: string;
}
