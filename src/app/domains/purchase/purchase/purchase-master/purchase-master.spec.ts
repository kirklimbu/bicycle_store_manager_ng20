import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseMaster } from './purchase-master';

describe('PurchaseMaster', () => {
  let component: PurchaseMaster;
  let fixture: ComponentFixture<PurchaseMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
