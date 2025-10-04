import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultPage } from './search-result-page';

describe('SearchResultPage', () => {
  let component: SearchResultPage;
  let fixture: ComponentFixture<SearchResultPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
