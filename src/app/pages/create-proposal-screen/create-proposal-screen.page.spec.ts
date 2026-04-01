import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProposalPage } from './create-proposal-screen.page';

describe('CreateProposalPage', () => {
  let component: CreateProposalPage;
  let fixture: ComponentFixture<CreateProposalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProposalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProposalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
