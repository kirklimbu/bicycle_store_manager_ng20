import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentEntryForm } from './payment-entry-form';

describe('PaymentEntryForm', () => {
  let component: PaymentEntryForm;
  let fixture: ComponentFixture<PaymentEntryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentEntryForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentEntryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
