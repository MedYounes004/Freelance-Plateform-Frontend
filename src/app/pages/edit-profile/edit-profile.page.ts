import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonBackButton, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonBackButton, IonButtons
  ],
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditProfilePage {

  // ── Form fields ──────────────────────────────
  name = '';
  role = '';
  bio  = '';
  password = '';
  confirmPassword = '';

  // ── UI state ─────────────────────────────────
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    addIcons({ chevronBack, eyeOutline, eyeOffOutline });

    // Pre-fill with current user data
    const user = this.authService.getUser();
    if (user) {
      this.name = user.name || '';
      this.role = user.role || '';
      this.bio  = user.bio  || '';
    }
  }

  onBack(): void {
    this.navCtrl.back();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSave(): void {
    // Validation
    if (!this.name) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (this.password && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const payload: any = {
      name: this.name,
      role: this.role,
      bio:  this.bio,
    };

    if (this.password) {
      payload.password = this.password;
    }

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.navCtrl.back(), 1500);
      },
      // ✅ After
error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Update failed. Try again.';
      }
    });
  }
}