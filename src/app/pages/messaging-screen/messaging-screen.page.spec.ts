import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagingScreenPage } from './messaging-screen.page';

describe('MessagingScreenPage', () => {
  let component: MessagingScreenPage;
  let fixture: ComponentFixture<MessagingScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
