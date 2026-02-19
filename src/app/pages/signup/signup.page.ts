import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonInput,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, ribbonOutline, arrowBack } from 'ionicons/icons';

// ── Custom validator: password strength ──────────────────────────────────────
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  const errors: ValidationErrors = {};

  if (!/[A-Z]/.test(value)) errors['missingUpperCase'] = true;
  if (!/[a-z]/.test(value)) errors['missingLowerCase'] = true;
  if (!/[0-9]/.test(value)) errors['missingNumber']    = true;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors['missingSpecial'] = true;

  return Object.keys(errors).length ? errors : null;
}

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
  submitted = false;
  userType: 'hire' | 'work' = 'hire';

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    addIcons({ briefcaseOutline, ribbonOutline, arrowBack });

    this.form = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
          Validators.pattern(/^[a-zA-Z\s\-']+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(254),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          strongPasswordValidator,
        ],
      ],
      agreeToTerms: [false, [Validators.requiredTrue]],
    });
  }

  // ── Convenience getters ────────────────────────────────────────────────────
  get fullName()     { return this.form.get('fullName')!;     }
  get email()        { return this.form.get('email')!;        }
  get password()     { return this.form.get('password')!;     }
  get agreeToTerms() { return this.form.get('agreeToTerms')!; }

  // ── Error message helpers ──────────────────────────────────────────────────
  get fullNameError(): string {
    const e = this.fullName.errors;
    if (!e) return '';
    if (e['required'])  return 'Full name is required.';
    if (e['minlength']) return 'Name must be at least 2 characters.';
    if (e['maxlength']) return 'Name must be under 60 characters.';
    if (e['pattern'])   return 'Only letters, spaces, hyphens, and apostrophes are allowed.';
    return '';
  }

  get emailError(): string {
    const e = this.email.errors;
    if (!e) return '';
    if (e['required'])  return 'Email is required.';
    if (e['email'])     return 'Please enter a valid email address.';
    if (e['maxlength']) return 'Email is too long.';
    return '';
  }

  get passwordError(): string {
    const e = this.password.errors;
    if (!e) return '';
    if (e['required'])         return 'Password is required.';
    if (e['minlength'])        return 'Password must be at least 8 characters.';
    if (e['maxlength'])        return 'Password must be under 128 characters.';
    if (e['missingUpperCase']) return 'Must include at least one uppercase letter.';
    if (e['missingLowerCase']) return 'Must include at least one lowercase letter.';
    if (e['missingNumber'])    return 'Must include at least one number.';
    if (e['missingSpecial'])   return 'Must include at least one special character (!@#$%…).';
    return '';
  }

  // ── Password strength score (0–4) ─────────────────────────────────────────
  get passwordStrength(): number {
    const v = this.password.value ?? '';
    if (!v) return 0;
    let score = 0;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)) score++;
    return score;
  }

  get passwordStrengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.passwordStrength] ?? '';
  }

  get passwordStrengthClass(): string {
    return ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong'][this.passwordStrength] ?? '';
  }

  // ── Show error only after touch/submit ────────────────────────────────────
  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty || this.submitted);
  }

  // ── Submission ─────────────────────────────────────────────────────────────
  onSignUp() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.signUp.emit();
    this.navCtrl.navigateRoot('/home');
  }

  onBack()         { this.navCtrl.back();    }
  onLogin()        { this.login.emit();      }
  onTermsClick()   { /* open terms */        }
  onPrivacyClick() { /* open privacy */      }
}