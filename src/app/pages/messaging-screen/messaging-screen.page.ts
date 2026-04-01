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
} from 'ionicons/icons';

export interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export interface Contact {
  name: string;
  online: boolean;
  avatar: string;
}

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
  ],
})
export class MessagingPage implements OnInit, AfterViewInit {
  selectedConversation?: Conversation;

  @ViewChild('scrollContent') scrollContent!: IonContentType;

  messageText: string = '';

  contact: Contact = {
    name: 'TechStart Inc.',
    online: true,
    avatar:
      'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
  };

  messages: Message[] = [
    {
      id: 1,
      sender: 'other',
      text: "Hi! I saw your proposal and I'm interested in working with you.",
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: "Great! I'd love to discuss the project details with you.",
      time: '10:32 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Perfect. I need a complete redesign of our e-commerce platform. Do you have experience with similar projects?',
      time: '10:33 AM',
    },
    {
      id: 4,
      sender: 'me',
      text: "Yes, I've worked on several e-commerce redesigns. I can share some examples from my portfolio.",
      time: '10:35 AM',
    },
    {
      id: 5,
      sender: 'me',
      text: 'When would be a good time for a quick call to discuss the requirements?',
      time: '10:35 AM',
    },
    {
      id: 6,
      sender: 'other',
      text: "That would be great! I'm available tomorrow afternoon around 2 PM. Does that work for you?",
      time: '10:38 AM',
    },
  ];

  constructor(private navCtrl: NavController, private router: Router) {
    addIcons({
      arrowBackOutline, callOutline, videocamOutline,
      ellipsisVerticalOutline, attachOutline, send,
    });
  }

  ngOnInit(): void {
    // read conversation from navigation state if provided
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['conversation']) {
      this.selectedConversation = navigation.extras.state['conversation'];
      // update contact info based on conversation
      if (this.selectedConversation) {
        this.contact.name = this.selectedConversation.name;
        this.contact.online = this.selectedConversation.online;
        this.contact.avatar = this.selectedConversation.avatar;
      }
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  onBack(): void {
    this.navCtrl.back();
  }

  onSend(event?: KeyboardEvent): void {
    // Prevent newline on Enter (without Shift)
    if (event) {
      if (event.shiftKey) return;
      event.preventDefault();
    }

    const text = this.messageText.trim();
    if (!text) return;

    const newMessage: Message = {
      id: this.messages.length + 1,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.messages = [...this.messages, newMessage];
    this.messageText = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onAttach(): void {
    // Handle file attachment
    console.log('Attach file');
  }

  private scrollToBottom(): void {
    this.scrollContent?.scrollToBottom(300);
  }
}