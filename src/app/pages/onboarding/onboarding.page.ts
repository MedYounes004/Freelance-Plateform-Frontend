import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingPage {

  features = [
    {
      title: 'Verified Professionals',
      subtitle: 'Work with trusted freelancers',
      path: 'M5 13l4 4L19 7'
    },
    {
      title: 'Real-time Chat',
      subtitle: 'Communicate instantly',
      path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      title: 'Secure Payments',
      subtitle: 'Safe and protected transactions',
      path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    },
  ];

  constructor(private navCtrl: NavController) {
    addIcons({ chevronForward });
  }

  onGetStarted(): void {
    this.navCtrl.navigateForward('/login');
  }

  onSkip(): void {
    this.navCtrl.navigateRoot('/home');
  }
}