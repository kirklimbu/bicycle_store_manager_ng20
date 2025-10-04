import { TestBed } from '@angular/core/testing';

import { Dayend } from './dayend';

describe('Dayend', () => {
  let service: Dayend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dayend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
