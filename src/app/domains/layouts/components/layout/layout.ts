import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'lib-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  onSearch(value: string) {}
}
