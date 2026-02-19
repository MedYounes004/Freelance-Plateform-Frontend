import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-guest-banner',
  templateUrl: './guest-banner.component.html',
  styleUrls: ['./guest-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class GuestBannerComponent {
  @Output() signIn = new EventEmitter<void>();

  constructor() {
    addIcons({ lockClosedOutline, logInOutline });
  }

  onSignIn() {
    this.signIn.emit();
  }
}