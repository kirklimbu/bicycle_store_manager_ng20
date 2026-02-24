import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralLedgerReport } from './general-ledger-report';

describe('GeneralLedgerReport', () => {
  let component: GeneralLedgerReport;
  let fixture: ComponentFixture<GeneralLedgerReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralLedgerReport],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralLedgerReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
