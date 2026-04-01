import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsScreenPage } from './projects-screen.page';

describe('ProjectsScreenPage', () => {
  let component: ProjectsScreenPage;
  let fixture: ComponentFixture<ProjectsScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
