import { TestBed } from '@angular/core/testing';

import { SearchResult } from './search.service';

describe('SearchResult', () => {
  let service: SearchResult;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchResult);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
