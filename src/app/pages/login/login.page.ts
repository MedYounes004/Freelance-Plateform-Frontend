import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage {

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  onBack(): void {
    this.navCtrl.back();
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.navCtrl.navigateRoot('/home');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  onSignUp(): void {
    this.navCtrl.navigateForward('/signup');
  }

  onGuestMode(): void {
    this.navCtrl.navigateRoot('/home');
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