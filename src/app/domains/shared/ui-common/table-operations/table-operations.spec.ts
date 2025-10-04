import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableOperations } from './table-operations';

describe('TableOperations', () => {
  let component: TableOperations;
  let fixture: ComponentFixture<TableOperations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOperations],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOperations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
