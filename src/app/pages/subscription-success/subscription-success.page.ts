import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import {
  IonContent, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, sparkles } from 'ionicons/icons';

export type PlanType = 'freelancer' | 'client';
export type BillingCycle = 'monthly' | 'yearly';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonIcon
  ],
  templateUrl: './subscription-success.page.html',
  styleUrls: ['./subscription-success.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscriptionSuccessPage {

  planType: PlanType = 'freelancer';
  billingCycle: BillingCycle = 'monthly';

  freelancerBenefits = [
    'Unlimited project proposals',
    'Featured profile listing',
    'Only 5% service fee (was 15%)',
    'Priority support',
  ];

  clientBenefits = [
    'Post unlimited projects',
    'Advanced search filters',
    'Dedicated account manager',
    'Priority support',
  ];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    addIcons({ checkmark, sparkles });

    // Retrieve query params passed from pricing page
    this.route.queryParams.subscribe(params => {
      this.planType = params['plan'] || 'freelancer';
      this.billingCycle = params['billing'] || 'monthly';
    });
  }

  get planName(): string {
    return this.planType === 'freelancer' ? 'Freelancer Pro' : 'Client Pro';
  }

  get benefits(): string[] {
    return this.planType === 'freelancer' ? this.freelancerBenefits : this.clientBenefits;
  }

  onContinue(): void {
    this.navCtrl.navigateRoot('/home');
  }
}