import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule} from '@ionic/angular';


@Component({
  selector: 'app-guest-banner',
  templateUrl: './guest-banner.component.html',
  styleUrls: ['./guest-banner.component.scss'],
  imports: [IonicModule]
})
export class GuestBannerComponent {
  @Output() signIn = new EventEmitter<void>();

  onSignIn(): void {
    this.signIn.emit();
  }
}