import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonFooter,
  IonButton, IonIcon, IonAvatar, IonTextarea,
  IonContent as IonContentType,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, callOutline, videocamOutline,
  ellipsisVerticalOutline, attachOutline, send,
  personOutline,
} from 'ionicons/icons';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { AuthService } from 'src/app/core/services/auth/auth';
import { Contact, Conversation, Message } from 'src/app/models/message.model';
import { LoginRequiredModalComponent } from 'src/app/components/login-required/login-required.component';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging-screen.page.html',
  styleUrls: ['./messaging-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonFooter,
    IonButton, IonIcon, IonAvatar, IonTextarea,
    LoginRequiredModalComponent,
  ],
})
export class MessagingPage implements OnInit, AfterViewInit {
  selectedConversation?: Conversation;

  @ViewChild('scrollContent') scrollContent!: IonContentType;

  messageText: string = '';
  isLoading = false;
  isSending = false;
  errorMessage = '';
  showLoginModal = false;
  isGuest = false;

  private currentUserId = '';
  recipientUserId = '';

  contact: Contact = {
    name: 'TechStart Inc.',
    online: true,
    avatar:
      'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
  };

  messages: Message[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    addIcons({
      arrowBackOutline, callOutline, videocamOutline,
      ellipsisVerticalOutline, attachOutline, send, personOutline,
    });
  }

  ngOnInit(): void {
    // ← check first thing
    this.isGuest = !this.authService.isLoggedIn();
    if (this.isGuest) {
      this.showLoginModal = true;
      return;  // ← stop everything
    }

    const user = this.authService.getUser();
    this.currentUserId = user?.id || '';

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { conversation?: Conversation; recipient?: Conversation } | undefined;
    const selected = state?.recipient || state?.conversation;
    if (selected) {
      this.selectedConversation = selected;
      this.recipientUserId = selected.userId;
      this.contact.name = selected.name;
      this.contact.online = selected.online;
      this.contact.avatar = selected.avatar;
    }

    void this.loadMessages();
  }

  avatarUrl(name: string, color: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  onBack(): void {
    this.navCtrl.back();
  }

  openRecipients(): void {
    this.navCtrl.navigateForward('/message-recipients');
  }

  onGoToLogin(): void {
    this.navCtrl.navigateForward('/login');
  }

  onGoToSignUp(): void {
    this.navCtrl.navigateForward('/signup');
  }

  onContinueBrowsing(): void {
    this.showLoginModal = false;
    this.navCtrl.back();
  }

  async onSend(event?: KeyboardEvent): Promise<void> {
    if (event) {
      if (event.shiftKey) return;
      event.preventDefault();
    }

    const text = this.messageText.trim();
    if (!text || this.isSending || !this.recipientUserId) return;

    this.isSending = true;
    this.errorMessage = '';

    try {
      const savedMessage = await this.messageService.sendMessage({
        text,
        recipientId: this.recipientUserId,
      });

      this.messages = [
        ...this.messages,
        {
          id: savedMessage.id,
          sender: this.toDisplaySender(savedMessage.senderId),
          text: savedMessage.text,
          time: this.formatTime(savedMessage.timestamp),
        }
      ];
      this.messageText = '';
      setTimeout(() => this.scrollToBottom(), 100);
    } catch {
      this.errorMessage = 'Unable to send message. Please try again.';
    } finally {
      this.isSending = false;
    }
  }

  onAttach(): void {
    console.log('Attach file');
  }

  private scrollToBottom(): void {
    this.scrollContent?.scrollToBottom(300);
  }

  async loadMessages(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (!this.recipientUserId) {
        this.messages = [];
        this.isLoading = false;
        return;
      }

      const apiMessages = await this.messageService.getMessages(this.recipientUserId);
      if (!apiMessages.length) {
        this.messages = [];
        return;
      }

      this.messages = apiMessages
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((msg) => ({
          id: msg.id,
          sender: this.toDisplaySender(msg.senderId),
          text: msg.text,
          time: this.formatTime(msg.timestamp),
        }));
    } catch {
      this.errorMessage = 'Unable to load messages. Please try again.';
      this.messages = [];
    } finally {
      this.isLoading = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private toDisplaySender(senderId: string): 'me' | 'other' {
    return senderId === this.currentUserId ? 'me' : 'other';
  }

  private formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}