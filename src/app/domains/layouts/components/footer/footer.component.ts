import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { GlobalConstants } from 'src/app/domains/shared/global-constants';

@Component({
  selector: 'lib-footer',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DatePipe],
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
  appVersion = signal(GlobalConstants.APP_VERSION);
}
