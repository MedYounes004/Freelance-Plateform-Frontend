import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsScreenPage } from './project-details-screen.page';

describe('ProjectDetailsScreenPage', () => {
  let component: ProjectDetailsScreenPage;
  let fixture: ComponentFixture<ProjectDetailsScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
