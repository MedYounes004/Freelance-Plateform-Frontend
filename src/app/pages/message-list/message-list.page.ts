import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonList, IonItem,
  IonLabel, IonAvatar, IonBadge, IonSearchbar,
  NavController,
} from '@ionic/angular/standalone';

export interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

@Component({
  selector: 'app-messages-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonList, IonItem,
    IonLabel, IonAvatar, IonBadge, IonSearchbar,
  ],
})
export class MessagesListPage implements OnInit {

  @Output() messageClicked = new EventEmitter<Conversation>();

  searchQuery: string = '';

  conversations: Conversation[] = [
    {
      id: 1,
      name: 'TechStart Inc.',
      message: "That would be great! I'm available tomorrow...",
      time: '10:38 AM',
      unread: 2,
      online: true,
      avatar:
        'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 2,
      name: 'Michael Chen',
      message: 'Thanks for the update! Looking forward to it.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      avatar:
        'https://images.unsplash.com/photo-1752170080622-18196de87763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzcwMTQ4NjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 3,
      name: 'Emma Davis',
      message: 'Can you send me the files?',
      time: '2 days ago',
      unread: 0,
      online: true,
      avatar:
        'https://images.unsplash.com/photo-1769694609721-98f8bab9735a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHdyaXRlcnxlbnwxfHx8fDE3NzAxOTk0OTR8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 4,
      name: 'Design Studio Co.',
      message: "Perfect! Let's schedule a call.",
      time: '3 days ago',
      unread: 0,
      online: false,
      avatar:
        'https://images.unsplash.com/photo-1753162658653-d33c53910d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXNpZ25lciUyMHdvbWFufGVufDF8fHx8MTc3MDE1NjkzOXww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 5,
      name: 'James Wilson',
      message: 'Great work on the last project!',
      time: '1 week ago',
      unread: 0,
      online: false,
      avatar:
        'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
    },
  ];

  filteredConversations: Conversation[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {
    this.filteredConversations = [...this.conversations];
  }

  onSearch(event: CustomEvent): void {
    const query = (event.detail.value as string).toLowerCase().trim();
    if (!query) {
      this.filteredConversations = [...this.conversations];
    } else {
      this.filteredConversations = this.conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.message.toLowerCase().includes(query)
      );
    }
  }

  onMessageClick(conversation: Conversation): void {
    // Emit event for parent component
    this.messageClicked.emit(conversation);

    // Navigate to messaging screen and pass the conversation via navigation state
    this.navCtrl.navigateForward('/messaging', { state: { conversation } });
  }
}