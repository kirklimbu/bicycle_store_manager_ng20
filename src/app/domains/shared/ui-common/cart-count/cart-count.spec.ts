import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartCount } from './cart-count';

describe('CartCount', () => {
  let component: CartCount;
  let fixture: ComponentFixture<CartCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCount],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
