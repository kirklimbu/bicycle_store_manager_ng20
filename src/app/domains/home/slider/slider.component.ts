import { Observable } from 'rxjs';
import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  input,
} from '@angular/core';
// third-party
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { HomeService } from '../home.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IBannerDto } from '../data/model/home.model';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NzCarouselModule],
})
export class SliderComponent implements OnInit {
  effect = 'scrollx';
  array = [1, 2, 3, 4];

  data$!: Observable<any[]>;
  // @Input() data!: any

  data = input<IBannerDto[]>();

  private destroyRef$ = inject(DestroyRef);
  private homeService = inject(HomeService);
  ngOnInit(): void {
    this.loadSlider();
  }

  private loadSlider() {
    // this.data$ = this.homeService.getBanners()
    // this.data$
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef$)
    //   )
    //   .subscribe(res => {
    //     this.data = res
    //   })
  }
}
