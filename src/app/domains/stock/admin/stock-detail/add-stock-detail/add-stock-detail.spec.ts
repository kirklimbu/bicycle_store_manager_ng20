import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStockDetail } from './add-stock-detail';

describe('AddStockDetail', () => {
  let component: AddStockDetail;
  let fixture: ComponentFixture<AddStockDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStockDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AddStockDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
