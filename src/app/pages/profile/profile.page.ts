import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, ViewWillEnter } from '@ionic/angular/standalone';
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
import { Shared } from 'src/app/core/services/shared/shared';
import { AuthService } from '../../core/services/auth/auth';
import { SubscriptionStatus } from 'src/app/models/profile.model';

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
export class ProfilePage implements ViewWillEnter {

  @Input() subscriptionStatus: SubscriptionStatus = 'free';

  currentUser: any = null;

  get isPro(): boolean {
    return this.subscriptionStatus !== 'free';
  }

  get subscriptionLabel(): string {
    return this.subscriptionStatus === 'freelancer-pro' ? 'Freelancer Pro' : 'Client Pro';
  }

  constructor(
    private navCtrl: NavController,
    private shared: Shared,
    private authService: AuthService
  ) {
    addIcons({
      chevronForward, person, notifications, card, shield,
      helpCircle, documentText, logOut, star, briefcase,
      cash, cloudUpload, trophy, sparkles
    });
  }

  // ← runs every time the page becomes active (after edit, after back, etc.)
  ionViewWillEnter(): void {
    this.currentUser = this.authService.getUser();
  }

  onTabChange(tabId: string): void {}

  onLogout(): void {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
    this.shared.OnchangeGuestStatus(true);
  }

  onEditProfile(): void { this.navCtrl.navigateForward('/edit-profile'); }
  onCVManagement(): void { this.navCtrl.navigateForward('/cv-management'); }
  onManageSubscription(): void { this.navCtrl.navigateForward('/subscription'); }
  onUpgradeToPro(): void { this.navCtrl.navigateForward('/upgrade'); }
  onNotifications(): void { this.navCtrl.navigateForward('/notifications'); }
  onPaymentMethods(): void { this.navCtrl.navigateForward('/payment-methods'); }
  onEarnings(): void { this.navCtrl.navigateForward('/earnings'); }
  onPrivacySecurity(): void { this.navCtrl.navigateForward('/privacy-security'); }
  onHelpSupport(): void { this.navCtrl.navigateForward('/help'); }
  onTerms(): void { this.navCtrl.navigateForward('/terms'); }
}