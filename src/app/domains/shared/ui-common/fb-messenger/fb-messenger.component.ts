import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalConstants } from '../../global-constants';

@Component({
    selector: 'app-fb-messenger',
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './fb-messenger.component.html',
    styleUrl: './fb-messenger.component.scss'
})
export class FbMessengerComponent {
  readonly fbMessengerChatLink = GlobalConstants.fbMessengerLink
}
