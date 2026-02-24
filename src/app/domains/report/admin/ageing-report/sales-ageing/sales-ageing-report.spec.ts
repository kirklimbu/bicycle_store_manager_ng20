import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesAgeingReport } from './sales-ageing-report';

describe('SalesAgeingReport', () => {
  let component: SalesAgeingReport;
  let fixture: ComponentFixture<SalesAgeingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesAgeingReport],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesAgeingReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
