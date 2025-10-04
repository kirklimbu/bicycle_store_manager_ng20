import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStockDetail } from './list-stock-detail';

describe('ListStockDetail', () => {
  let component: ListStockDetail;
  let fixture: ComponentFixture<ListStockDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStockDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ListStockDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
