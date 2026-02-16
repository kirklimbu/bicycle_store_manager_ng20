import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesMasterListReport } from './sales-master-list-report';

describe('SalesMasterListReport', () => {
  let component: SalesMasterListReport;
  let fixture: ComponentFixture<SalesMasterListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMasterListReport],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesMasterListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
