import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonIcon,
  IonItem, IonLabel, IonList, IonListHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForward, person, notifications, card, shield,
  helpCircle, documentText, logOut, star, briefcase,
  cash, cloudUpload, trophy, sparkles
} from 'ionicons/icons';
import { BottomNavigationComponent } from '../../components/bottom-navigation/bottom-navigation.component';
import { Shared } from 'src/app/core/services/shared';

export type SubscriptionStatus = 'free' | 'freelancer-pro' | 'client-pro';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonButton, IonIcon,
    IonItem, IonLabel, IonList, IonListHeader,
    BottomNavigationComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfilePage {

  @Input() subscriptionStatus: SubscriptionStatus = 'free';

  get isPro(): boolean {
    return this.subscriptionStatus !== 'free';
  }

  get subscriptionLabel(): string {
    return this.subscriptionStatus === 'freelancer-pro' ? 'Freelancer Pro' : 'Client Pro';
  }

  constructor(private navCtrl: NavController) {
    addIcons({
      chevronForward, person, notifications, card, shield,
      helpCircle, documentText, logOut, star, briefcase,
      cash, cloudUpload, trophy, sparkles
    });
  }

  onTabChange(tabId: string): void {
    // routing géré dans BottomNavigationComponent
  }

  onLogout(): void {
    this.navCtrl.navigateRoot('/login');
    Shared.prototype.OnchangeGuestStatus(true);
  }

  onCVManagement(): void {
    this.navCtrl.navigateForward('/cv-management');
  }

  onManageSubscription(): void {
    this.navCtrl.navigateForward('/subscription');
  }

  onUpgradeToPro(): void {
    this.navCtrl.navigateForward('/upgrade');
  }

  onEditProfile(): void {
    this.navCtrl.navigateForward('/edit-profile');
  }

  onNotifications(): void {
    this.navCtrl.navigateForward('/notifications');
  }

  onPaymentMethods(): void {
    this.navCtrl.navigateForward('/payment-methods');
  }

  onEarnings(): void {
    this.navCtrl.navigateForward('/earnings');
  }

  onPrivacySecurity(): void {
    this.navCtrl.navigateForward('/privacy-security');
  }

  onHelpSupport(): void {
    this.navCtrl.navigateForward('/help');
  }

  onTerms(): void {
    this.navCtrl.navigateForward('/terms');
  }
}