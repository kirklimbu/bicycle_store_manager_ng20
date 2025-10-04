import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBrandComponent } from './home-brand.component';

describe('HomeBrandComponent', () => {
  let component: HomeBrandComponent;
  let fixture: ComponentFixture<HomeBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBrandComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
