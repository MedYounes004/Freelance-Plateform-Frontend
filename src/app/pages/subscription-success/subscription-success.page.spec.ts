import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionSuccessPage } from './subscription-success.page';

describe('SubscriptionSuccessPage', () => {
  let component: SubscriptionSuccessPage;
  let fixture: ComponentFixture<SubscriptionSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
