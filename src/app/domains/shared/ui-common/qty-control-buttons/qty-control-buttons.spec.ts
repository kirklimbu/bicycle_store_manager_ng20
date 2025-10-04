import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QtyControlButtons } from './qty-control-buttons';

describe('QtyControlButtons', () => {
  let component: QtyControlButtons;
  let fixture: ComponentFixture<QtyControlButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QtyControlButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(QtyControlButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
