import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfitLossReport } from './profitLoss-report';

describe('ProfitLossReport', () => {
  let component: ProfitLossReport;
  let fixture: ComponentFixture<ProfitLossReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitLossReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfitLossReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
