import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDayend } from './list-dayend';

describe('ListDayend', () => {
  let component: ListDayend;
  let fixture: ComponentFixture<ListDayend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDayend],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDayend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
