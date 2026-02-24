import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockLedgerReport } from '../stock-ledger/stock-ledger-report';

describe('StockLedgerReport', () => {
  let component: StockLedgerReport;
  let fixture: ComponentFixture<StockLedgerReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLedgerReport],
    }).compileComponents();

    fixture = TestBed.createComponent(StockLedgerReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
