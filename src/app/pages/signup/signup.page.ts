import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { briefcaseOutline, ribbonOutline, arrowBack } from 'ionicons/icons';

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
  @Output() login = new EventEmitter<void>();

  form: FormGroup;
  userType: 'hire' | 'work' = 'hire';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private shared: Shared
  ) {
    addIcons({ briefcaseOutline, ribbonOutline, arrowBack });

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }

  get agreeToTerms() {
    return this.form.get('agreeToTerms')!.value;
  }

  onSignUp() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  onBack() { this.navCtrl.back(); }
  onLogin() { this.navCtrl.navigateForward('/login'); }
  onTermsClick() { /* open terms */ }
  onPrivacyClick() { /* open privacy */ }
}