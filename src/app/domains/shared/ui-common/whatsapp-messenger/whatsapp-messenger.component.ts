import { Component } from '@angular/core';
import { GlobalConstants } from '../../global-constants';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-whatsapp-messenger',
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './whatsapp-messenger.component.html',
    styleUrl: './whatsapp-messenger.component.scss'
})
export class WhatsappMessengerComponent {

  readonly whatsAppChatLink = GlobalConstants.whatsappLink;

}
