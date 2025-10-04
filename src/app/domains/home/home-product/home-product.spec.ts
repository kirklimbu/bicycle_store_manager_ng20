import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Homeproduct } from './home-product';

describe('Homeproduct', () => {
  let component: Homeproduct;
  let fixture: ComponentFixture<Homeproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homeproduct],
    }).compileComponents();

    fixture = TestBed.createComponent(Homeproduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
