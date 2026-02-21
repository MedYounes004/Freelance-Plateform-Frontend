import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonBackButton, IonButtons  // ✅ IonButtons + IonBackButton ajoutés
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmark, sparkles, flashOutline,
  briefcaseOutline, shieldCheckmark
} from 'ionicons/icons';

export type PlanType = 'freelancer' | 'client';
export type BillingCycle = 'monthly' | 'yearly';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonBackButton, IonButtons  // ✅
  ],
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅
})
export class PricingPage {

  billingCycle: BillingCycle = 'monthly';  // ✅ propriété publique
  yearlyDiscount = 20;

  freelancerFeatures: string[] = [
    'Unlimited project proposals',
    'Direct client messaging',
    'Featured profile listing',
    'Portfolio showcase',
    'Advanced analytics',
    'Priority support',
    'Verified badge',
    'Lower service fees (5% vs 15%)',
  ];

  clientFeatures: string[] = [
    'Post unlimited projects',
    'Direct freelancer messaging',
    'Advanced search filters',
    'Project management tools',
    'Team collaboration',
    'Priority support',
    'Milestone tracking',
    'Dedicated account manager',
  ];

  freeFeatures: string[] = [
    'Limited proposals (5/month)',
    'Basic messaging',
    'Standard support',
  ];

  constructor(private navCtrl: NavController) {
    addIcons({ checkmark, sparkles, flashOutline, briefcaseOutline, shieldCheckmark });
  }

  get freelancerPrice(): number {
    return this.billingCycle === 'monthly' ? 29 : 24;
  }

  get clientPrice(): number {
    return this.billingCycle === 'monthly' ? 49 : 39;
  }

  toggleBilling(): void {
    this.billingCycle = this.billingCycle === 'monthly' ? 'yearly' : 'monthly';
  }

  onSelectPlan(plan: PlanType): void {
    this.navCtrl.navigateForward('/checkout', {
      queryParams: { plan, billing: this.billingCycle }
    });
  }
}