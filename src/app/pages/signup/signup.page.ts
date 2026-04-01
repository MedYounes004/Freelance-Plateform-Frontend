import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth';
import { Shared } from 'src/app/core/services/shared/shared';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonInput,
  IonButton,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, ribbonOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonInput,
    IonButton,
    IonCheckbox,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
  ],
})
export class SignupPage {
  @Output() signUp = new EventEmitter<void>();
  @Output() login  = new EventEmitter<void>();

  form: FormGroup;
  userType: 'hire' | 'work' = 'hire';

  constructor(private fb: FormBuilder, private navCtrl: NavController, private authService: AuthService, private shared: Shared) {
    addIcons({ briefcaseOutline, ribbonOutline });

    this.form = this.fb.group({
      fullName:     [''],
      email:        [''],
      password:     [''],
      agreeToTerms: [false],
    });
  }

  get agreeToTerms() {
    return this.form.get('agreeToTerms')!.value;
  }

  onSignUp() {
    if (!this.agreeToTerms) return;
    this.signUp.emit();
    this.authService.register(
      this.form.value.fullName,
      this.form.value.email,
      this.form.value.password,
      this.userType
    ).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        this.navCtrl.navigateRoot('/home');
        this.shared.OnchangeGuestStatus(false);
      },
      error: (err) => {
        console.error('Registration failed', err);
      }
    });
  }

  onBack()         { this.navCtrl.back();   }
  onLogin()        { this.login.emit();     }
  onTermsClick()   { /* open terms */       }
  onPrivacyClick() { /* open privacy */     }
}