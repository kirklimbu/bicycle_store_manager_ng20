import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesMaster } from './sales-master';

describe('SalesMaster', () => {
  let component: SalesMaster;
  let fixture: ComponentFixture<SalesMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
