import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseListReport } from './purchase-list-report';

describe('PurchaseListReport', () => {
  let component: PurchaseListReport;
  let fixture: ComponentFixture<PurchaseListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseListReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
