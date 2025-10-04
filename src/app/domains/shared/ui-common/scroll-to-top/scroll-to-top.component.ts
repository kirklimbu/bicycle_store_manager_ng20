import { Component } from '@angular/core';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-scroll-to-top',
    imports: [
        NzBackTopModule,
        NzIconModule
    ],
    templateUrl: './scroll-to-top.component.html',
    styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent {

}
