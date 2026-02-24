import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseDetailListReport } from './purchase-detail-list-report';

describe('PurchaseDetailListReport', () => {
  let component: PurchaseDetailListReport;
  let fixture: ComponentFixture<PurchaseDetailListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDetailListReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
