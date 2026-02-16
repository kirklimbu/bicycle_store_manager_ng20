import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesDetailListReport } from './sales-detail-list-report';

describe('SalesDetailListReport', () => {
  let component: SalesDetailListReport;
  let fixture: ComponentFixture<SalesDetailListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDetailListReport],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesDetailListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
