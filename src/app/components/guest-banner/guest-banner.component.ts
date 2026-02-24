import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, logInOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-guest-banner',
  templateUrl: './guest-banner.component.html',
  styleUrls: ['./guest-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class GuestBannerComponent {
  @Output() signIn = new EventEmitter<void>();

  constructor(private navCtrl: NavController) {
    addIcons({ lockClosedOutline, logInOutline });
  }

  onSignIn() {
    this.navCtrl.navigateForward('/login');
    this.signIn.emit();
  }
}