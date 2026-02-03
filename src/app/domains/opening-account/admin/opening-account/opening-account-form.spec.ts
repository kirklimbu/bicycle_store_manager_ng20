import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpeningAccountForm } from './opening-account-form';

describe('OpeningAccountForm', () => {
  let component: OpeningAccountForm;
  let fixture: ComponentFixture<OpeningAccountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningAccountForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OpeningAccountForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
