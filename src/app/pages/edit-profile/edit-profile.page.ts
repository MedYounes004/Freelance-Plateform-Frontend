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

  // ── Photo ────────────────────────────────────
  currentAvatar = '';       // loaded from localStorage
  avatarPreview = '';       // shown after user picks a photo
  avatarBase64  = '';       // sent to Flask

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
      this.name          = user.name   || '';
      this.role          = user.role   || '';
      this.bio           = user.bio    || '';
      this.currentAvatar = user.avatar || '';
    }
  }

  // ── Photo picker ─────────────────────────────
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'Image must be smaller than 2MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = e.target.result;  // shows preview immediately
      this.avatarBase64  = e.target.result;  // sent to Flask as base64
    };
    reader.readAsDataURL(file);  // converts to base64
  }

  // ── Toggle password visibility ────────────────
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ── Save ─────────────────────────────────────
  onSave(): void {
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

    // Only send avatar if user picked a new one
    if (this.avatarBase64) {
      payload.avatar = this.avatarBase64;
    }

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.navCtrl.back(), 1500);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Update failed. Try again.';
      }
    });
  }
}