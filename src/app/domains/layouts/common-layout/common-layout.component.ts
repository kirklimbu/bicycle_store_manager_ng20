import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
// project
// import { IBreadcrumb } from 'src/app/shared/interfaces/breadcrumb.type';
// import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
// third-party
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    // third-party
    // NzBreadCrumbModule,
    // project
    NzLayoutModule,

    NzGridModule,
    FooterComponent,
    HeaderComponent,
  ],
  //   providers: [ThemeConstantService],
})
export class CommonLayoutComponent {
  //   breadcrumbs$!: Observable<IBreadcrumb[]>;
  contentHeaderDisplay!: string;
  isFolded!: boolean;
  isSideNavDark!: boolean;
  isExpand!: boolean;
  selectedHeaderColor!: string;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  //   private themeService = inject(ThemeConstantService);
  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (
              child.snapshot.data &&
              child.snapshot.data['headerDisplay']
            ) {
              return child.snapshot.data['headerDisplay'];
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        this.contentHeaderDisplay = data;
      });
  }

  onSearch(value: string) {
    console.log('value', value);
  }
}
