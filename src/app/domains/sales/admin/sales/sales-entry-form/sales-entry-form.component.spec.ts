import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesEntryFormComponent } from './sales-entry-form.component';

describe('SalesEntryFormComponent', () => {
  let component: SalesEntryFormComponent;
  let fixture: ComponentFixture<SalesEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesEntryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
