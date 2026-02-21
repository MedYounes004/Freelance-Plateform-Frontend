import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvManagementPage } from './cv-management.page';

describe('CvManagementPage', () => {
  let component: CvManagementPage;
  let fixture: ComponentFixture<CvManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CvManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
