import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { MessageService, AvailableUser } from 'src/app/core/services/messages/message.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-message-recipients',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './message-recipients.page.html',
  styleUrls: ['./message-recipients.page.scss'],
})
export class MessageRecipientsPage implements OnInit {
  allUsers: AvailableUser[] = [];
  freelancers: AvailableUser[] = [];
  clients: AvailableUser[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private messageService: MessageService,
    private navCtrl: NavController,
  ) {
    addIcons({ arrowBackOutline, arrowBack });
  }

  avatarUrl(name: string, color: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`;
  }

  ngOnInit(): void {
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const users = await this.messageService.getAvailableUsers();
      this.allUsers = users;
      this.freelancers = users.filter((user) => this.normalizeRole(user.role) === 'freelancer');
      this.clients = users.filter((user) => this.normalizeRole(user.role) === 'client');
    } catch {
      this.errorMessage = 'Unable to load users.';
      this.allUsers = [];
      this.freelancers = [];
      this.clients = [];
    } finally {
      this.isLoading = false;
    }
  }

  private normalizeRole(role: string): 'freelancer' | 'client' | 'other' {
    const value = (role || '').toLowerCase();

    if (value === 'freelancer' || value === 'work') {
      return 'freelancer';
    }

    if (value === 'client' || value === 'hire') {
      return 'client';
    }

    return 'other';
  }

  selectRecipient(user: AvailableUser): void {
    this.navCtrl.navigateForward('/messaging', {
      state: {
        recipient: {
          userId: user.id,
          name: user.name,
          message: '',
          time: '',
          unread: 0,
          online: false,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`,
        },
      },
    });
  }

  onBack(): void {
    this.navCtrl.back();
  }
}
