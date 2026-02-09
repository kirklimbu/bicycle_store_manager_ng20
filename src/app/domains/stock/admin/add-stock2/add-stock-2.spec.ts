import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStock2 } from './add-stock-2';

describe('AddStock2', () => {
  let component: AddStock2;
  let fixture: ComponentFixture<AddStock2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStock2],
    }).compileComponents();

    fixture = TestBed.createComponent(AddStock2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
