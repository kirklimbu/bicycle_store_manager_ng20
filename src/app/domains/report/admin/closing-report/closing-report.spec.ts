import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClosingReport } from './closing-report';

describe('ClosingReport', () => {
  let component: ClosingReport;
  let fixture: ComponentFixture<ClosingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosingReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ClosingReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
