import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopConfirmComponent } from './PopConfirm.component';

describe('PopConfirmComponent', () => {
  let component: PopConfirmComponent;
  let fixture: ComponentFixture<PopConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
