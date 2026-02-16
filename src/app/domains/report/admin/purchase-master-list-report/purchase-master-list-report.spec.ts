import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseMasterListReport } from './purchase-master-list-report';

describe('PurchaseMasterListReport', () => {
  let component: PurchaseMasterListReport;
  let fixture: ComponentFixture<PurchaseMasterListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseMasterListReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseMasterListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
