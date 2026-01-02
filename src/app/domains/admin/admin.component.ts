import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
// import { SidenavComponent } from 'src/app/shell/sidevav/sidenav.component';
import { Router, RouterModule } from '@angular/router';
// import { BreadcrumbModule } from 'xng-breadcrumb';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthState } from '../auth/login/state/login.state';
import { MessageService } from '@logger/message.service';
import { DayendService } from '../dayend/data/services/dayend.service';
import { IDayend2Dto } from '../dayend/data/model/dayend';
import { NepaliDateFormatterPipe } from '../shared/pipes/nepali-date-formatter.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalConstants } from '../shared/global-constants';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    // SidenavComponent,
    RouterModule,
    // BreadcrumbModule,
    // FooterComponent,
    // BodyComponent,
    NzIconModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzButtonModule,
    NepaliDateFormatterPipe,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DatePipe],
})
export class AdminComponent implements OnInit {
  currentDayend: IDayend2Dto | null = null;
  currentDate!: string | null;
  isCollapsed = false;

  isSideNavCollapsed = false;
  collapsed = false;
  screenWidth = 0;
  appVersion = signal(GlobalConstants.APP_VERSION);

  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef$ = inject(DestroyRef);
  dayendService = inject(DayendService);
  authstate = inject(AuthState);

  ngOnInit(): void {
    if (this.authstate.isAdmin()) this.fetchCurrentDayend();
    console.log('oniinti');
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  onLogout() {
    this.authstate.logout().subscribe((res) => {
      this.messageService.createMessage('success', res.message);
      // navigate to login page
      this.router.navigate(['/home']);
    });
  }

  fetchCurrentDayend() {
    console.log('dayend  ');
    this.dayendService
      .getCurrentDayend()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res) => {
        console.log('current dayend', res);

        this.currentDayend = res;
        // this.messageService.createMessage('success', res.message);
      });
  }
}
