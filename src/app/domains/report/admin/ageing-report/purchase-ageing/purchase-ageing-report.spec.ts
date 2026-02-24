import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseAgeingReport } from './purchase-ageing-report';

describe('PurchaseAgeingReport', () => {
  let component: PurchaseAgeingReport;
  let fixture: ComponentFixture<PurchaseAgeingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseAgeingReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseAgeingReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
