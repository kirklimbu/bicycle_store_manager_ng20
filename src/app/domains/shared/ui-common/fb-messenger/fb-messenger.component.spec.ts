import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbMessengerComponent } from './fb-messenger.component';

describe('FbMessengerComponent', () => {
  let component: FbMessengerComponent;
  let fixture: ComponentFixture<FbMessengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FbMessengerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FbMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
