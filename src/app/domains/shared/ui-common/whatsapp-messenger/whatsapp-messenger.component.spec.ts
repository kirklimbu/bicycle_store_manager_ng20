import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMessengerComponent } from './whatsapp-messenger.component';

describe('WhatsappMessengerComponent', () => {
  let component: WhatsappMessengerComponent;
  let fixture: ComponentFixture<WhatsappMessengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappMessengerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhatsappMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
