import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonList, IonItem,
  IonLabel, IonAvatar, IonBadge, IonSearchbar,
  NavController,
} from '@ionic/angular/standalone';
import { BottomNavigationComponent } from 'src/app/components/bottom-navigation/bottom-navigation.component';
import { ConversationItem, MessageService } from 'src/app/core/services/messages/message.service';

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

@Component({
  selector: 'app-messages-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
  standalone: true,
  imports: [
    BottomNavigationComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonList, IonItem,
    IonLabel, IonAvatar, IonBadge, IonSearchbar,
  ],
})
export class MessagesListPage implements OnInit {

  @Output() messageClicked = new EventEmitter<Conversation>();

  activeTab = 'messages';
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }
  searchQuery: string = '';
  isLoading = false;
  errorMessage = '';

  conversations: Conversation[] = [];

  filteredConversations: Conversation[] = [];

  constructor(
    private navCtrl: NavController,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    void this.loadConversations();
  }

  async loadConversations(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const conversations = await this.messageService.getConversations();
      if (!conversations.length) {
        this.conversations = [];
        this.filteredConversations = [];
        return;
      }

      this.conversations = this.toConversations(conversations);
      this.filteredConversations = [...this.conversations];
    } catch {
      this.errorMessage = 'Unable to load messages. Please try again.';
      this.conversations = [];
      this.filteredConversations = [];
    } finally {
      this.isLoading = false;
    }
  }

  private toConversations(rows: ConversationItem[]): Conversation[] {
    return rows
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map((row) => ({
        id: row.userId,
        userId: row.userId,
        name: row.name,
        message: row.lastMessage,
        time: this.formatTime(row.timestamp),
        unread: 0,
        online: false,
        avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
      }));
  }

  private formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  openRecipients(): void {
    this.navCtrl.navigateForward('/message-recipients');
  }
}