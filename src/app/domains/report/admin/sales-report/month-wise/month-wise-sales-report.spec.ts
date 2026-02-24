import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthWiseSalesReport } from './month-wise-sales-report';

describe('MonthWiseSalesReport', () => {
  let component: MonthWiseSalesReport;
  let fixture: ComponentFixture<MonthWiseSalesReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWiseSalesReport],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthWiseSalesReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
