import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, lockClosedOutline, logInOutline, personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login-required-modal',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './login-required.component.html',      // ← fixed
  styleUrls: ['./login-required.component.scss'],      // ← fixed
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginRequiredModalComponent {

  @Input() isOpen = false;
  @Input() actionDescription = 'this feature';

  @Output() close   = new EventEmitter<void>();
  @Output() login   = new EventEmitter<void>();
  @Output() signUp  = new EventEmitter<void>();

  constructor() {
    addIcons({ closeOutline, lockClosedOutline, logInOutline, personAddOutline });
  }

  onClose():   void { this.close.emit(); }
  onLogin():   void { this.login.emit(); }
  onSignUp():  void { this.signUp.emit(); }
}