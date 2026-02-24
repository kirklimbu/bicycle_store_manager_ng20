import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthWisePurchaseReport } from './month-wise-purchase-report';

describe('MonthWisePurchaseReport', () => {
  let component: MonthWisePurchaseReport;
  let fixture: ComponentFixture<MonthWisePurchaseReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWisePurchaseReport],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthWisePurchaseReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
