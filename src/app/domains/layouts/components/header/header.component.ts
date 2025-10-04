import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '@logger/message.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { AuthState } from 'src/app/domains/auth/login/state/login.state';
import { CartCount } from 'src/app/domains/shared/ui-common/cart-count/cart-count';
import { SearchPage } from '../search-page/search-page';
import { CartService } from './../../../cart/data/services/cart.services';
// import { MessageService } from 'src/app/shared/util-logger/message.service';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrl: './header.scss',
  // providers: [MessageService],

  imports: [
    // ng
    RouterModule,
    CommonModule,
    // third-party
    NzAvatarModule,
    NzDrawerModule,
    NzBadgeModule,
    NzDropDownModule,
    NzListModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzDividerModule,
    NzGridModule,
    SearchPage,
    CartCount,
  ],
})
export class HeaderComponent implements OnInit {
  // Signals
  sidebarCollapsed = signal(false);

  currentUser;
  notifications = signal([
    { id: 1, message: 'New order received', read: false },
    { id: 2, message: 'Inventory low on rice', read: false },
  ]);
  searchText = '';
  notificationsCount = 5;

  userMenuItems = [
    {
      label: 'Profile',
      icon: 'user',
      route: '/profile',
    },
    {
      label: 'Orders',
      icon: 'shopping',
      route: '/orders',
    },
    {
      label: 'Settings',
      icon: 'setting',
      route: '/settings',
    },
    {
      label: 'Logout',
      icon: 'logout',
      route: '/logout',
    },
  ];

  // Output events
  toggleSidebar = output<void>();
  search = output<string>();
  logout = output<void>();

  private router = inject(Router);
  readonly authstate = inject(AuthState);
  readonly messageService = inject(MessageService);
  cartService = inject(CartService);

  unreadNotifications = computed(
    () => this.notifications().filter((n) => !n.read).length
  );

  constructor() {
    // Load initial cart count once at app start
    const authenticated = this.authstate.isAuthenticated();

    if (authenticated) {
      this.cartService.refreshCartCount();
    }
  }

  ngOnInit(): void {
    // this.currentUser = this.authstate?.user()?.name;
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onLogout(): void {
    const userId = this.authstate.user()?.userId; // or however you store it

    this.authstate.logout().subscribe((res) => {
      console.log('Logout successful', res);
      this.messageService.createMessage('success', res.message);
      // navigate to login page
      this.router.navigate(['/login']);
    });
  }
  markAllAsRead() {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true }))
    );
  }

  onGlobalSearch(searchTerm: any) {
    console.log('Global search:', searchTerm);
  }

  onViewProfile(): void {
    const user = this.authstate.user();
    this.router.navigate(['/auth/user-profile'], {
      queryParams: {
        userId: user?.userId,
      },
    });
  }

  onViewCart() {
    console.log('car');

    this.router.navigate(['/home/cart']);
  }
}
