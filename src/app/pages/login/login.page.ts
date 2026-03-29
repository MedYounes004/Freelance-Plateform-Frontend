import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth/auth';
import { Shared } from 'src/app/core/services/shared/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage {

  email = 'demo@example.com';
  password = 'password123';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private shared: Shared
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  onBack(): void {
    this.navCtrl.back();
  }

  onLogin(): void {
    if (this.email === 'demo@example.com' && this.password === 'password123') {
      this.navCtrl.navigateRoot('/home');
      this.shared.OnchangeGuestStatus(false);
    } else {
      console.log('Invalid credentials');
    }
  }

  onSignUp(): void {
    this.navCtrl.navigateForward('/signup');
  }

  onGuestMode(): void {
    this.navCtrl.navigateRoot('/home');
    this.shared.OnchangeGuestStatus(true);
  }

  onForgotPassword(): void {
    console.log('Forgot password');
  }

  onGoogleLogin(): void {
    console.log('Google login');
  }

  onFacebookLogin(): void {
    console.log('Facebook login');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}