import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-detail-page',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailPageComponent {
  @Input() data!: any;

  constructor() {
    console.log('data detail', this.data);
  }
}
