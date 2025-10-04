import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveDayend } from './save-dayend';

describe('SaveDayend', () => {
  let component: SaveDayend;
  let fixture: ComponentFixture<SaveDayend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveDayend],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveDayend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
