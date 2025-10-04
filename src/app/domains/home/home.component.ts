import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ICompany } from '../company/data/model/company.model';
import { CategoryCard } from './category-card/category-card';
import { ICategory, IProduct } from './data/model/home.model';
import { HomeBrandComponent } from './home-brand/home-brand.component';
import { Homeproduct } from './home-product/home-product';
import { HomeService } from './home.service';
import { deviceIdSignal } from '../shared/util-common/generateDeviceId';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, HomeBrandComponent, CategoryCard, Homeproduct],
  providers: [],
})
export class HomeComponent implements OnInit {
  // companyList: ICompany[] = [];

  // categoryList: ICategory[] = [];
  companyList = signal<ICompany[]>([]);
  categoryList = signal<ICategory[]>([]);
  productList = signal<IProduct[]>([]);
  isLoading = signal<boolean>(false);

  private readonly unsubscribe$ = inject(DestroyRef);

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  private readonly homeService = inject(HomeService);

  ngOnInit(): void {
    this.fetchHomeContents();
  }

  private fetchHomeContents(): void {
    this.isLoading.set(true);
    const deviceId = deviceIdSignal();

    this.homeService
      .getHomeContents(deviceId)
      .pipe(takeUntilDestroyed(this.unsubscribe$))
      .subscribe((res: any) => {
        // this.onTrackView();

        // this.bannerList = res.bannerList;
        // this.ceoMessage = res.organization.ceoMsg;
        // this.ceoPhoto = res.organization.ceoFile;
        // this.ceoName = res.organization.ceoName;
        // this.companyList = res.companyList;
        // this.categoryList = res.categoryList;
        this.companyList.set(res.companyList);
        this.categoryList.set(res.categoryList);
        this.productList.set(res.stockList);
        this.isLoading.set(false);
      });
  }
}
