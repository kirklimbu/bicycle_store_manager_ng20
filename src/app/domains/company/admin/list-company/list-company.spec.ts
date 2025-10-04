import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCompany } from './list-company';

describe('ListCompany', () => {
  let component: ListCompany;
  let fixture: ComponentFixture<ListCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
