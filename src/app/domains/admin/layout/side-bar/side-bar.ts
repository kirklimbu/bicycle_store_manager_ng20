import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthState } from 'src/app/domains/auth/login/state/login.state';
import { Role } from 'src/app/domains/shared/util-auth/models/user.model';
import { MenuItem } from '../../data/model/admin-layout.model';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subscription } from 'rxjs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-side-bar',
  imports: [
    CommonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzAvatarModule,
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {
  private router = inject(Router);
  private authState = inject(AuthState);
  private resizeSubscription?: Subscription;

  // Signals
  isCollapsed = input(false);
  collapseChange = output<boolean>();

  currentYear = signal(new Date().getFullYear());
  isMobile = signal(false);
  isMobileMenuOpen = signal(false);

  // User info
  user = computed(() => this.authState.user());
  userRole = computed(() => this.user()?.role || Role.NONE);
  userName = computed(() => this.user()?.name || 'User');
  userEmail = computed(() => this.user()?.email || '');

  // Menu configuration
  private menuConfig = {
    mainItems: [
      {
        id: 'home',
        label: 'Home',
        icon: 'home',
        path: '/home',
        roles: [Role.ADMIN, Role.MANAGER, Role.STAFF, Role.CUSTOMER],
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'user',
        path: '/auth/user-profile',
        roles: [Role.ADMIN, Role.MANAGER, Role.STAFF, Role.CUSTOMER],
      },
    ] as MenuItem[],

    adminItems: [
      {
        id: 'inquiry',
        label: 'Inquiry',
        icon: 'question-circle',
        path: '/auth/inquiry',
        roles: [Role.ADMIN],
      },
      {
        id: 'set',
        label: 'Set',
        icon: 'tags',
        path: '/auth/set-add',
        roles: [Role.ADMIN],
      },
      {
        id: 'question',
        label: 'Question',
        icon: 'book',
        roles: [Role.ADMIN],
        children: [
          {
            id: 'question-list',
            label: 'Questions list',
            path: '/auth/question-list',
            roles: [Role.ADMIN],
          },
        ],
      },
      {
        id: 'student',
        label: 'Student',
        icon: 'team',
        roles: [Role.ADMIN],
        children: [
          {
            id: 'student-list',
            label: 'Students list',
            path: '/auth/student-list',
            roles: [Role.ADMIN],
          },
        ],
      },
      {
        id: 'staff',
        label: 'Staff',
        icon: 'usergroup-delete',
        roles: [Role.ADMIN],
        children: [
          {
            id: 'staff-list',
            label: 'Staff list',
            path: '/auth/staff',
            roles: [Role.ADMIN],
          },
        ],
      },
    ] as MenuItem[],

    settingsItems: [
      {
        id: 'change-password',
        label: 'Change Password',
        icon: 'safety',
        path: '/auth/forget-password',
        roles: [Role.ADMIN, Role.MANAGER, Role.STAFF, Role.CUSTOMER],
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: 'logout',
        action: () => this.onLogout(),
        roles: [Role.ADMIN, Role.MANAGER, Role.STAFF, Role.CUSTOMER],
      },
    ] as MenuItem[],
  };

  // Computed menu items
  mainMenuItems = computed(() =>
    this.filterMenuItemsByRole(this.menuConfig.mainItems)
  );
  adminMenuItems = computed(() =>
    this.filterMenuItemsByRole(this.menuConfig.adminItems)
  );
  settingsMenuItems = computed(() =>
    this.filterMenuItemsByRole(this.menuConfig.settingsItems)
  );
  shouldShowAdminSection = computed(
    () => this.adminMenuItems().length > 0 && this.userRole() === Role.ADMIN
  );

  constructor() {
    this.checkScreenSize();

    // Proper resize handling
    if (typeof window !== 'undefined') {
      this.resizeSubscription = new Subscription();
      const resizeHandler = () => this.checkScreenSize();
      window.addEventListener('resize', resizeHandler);
      this.resizeSubscription.add(() =>
        window.removeEventListener('resize', resizeHandler)
      );
    }

    // Auto-close mobile menu when route changes
    effect(() => {
      if (this.router.url && this.isMobileMenuOpen()) {
        this.isMobileMenuOpen.set(false);
      }
    });
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
    if (!this.isMobile() && this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  private filterMenuItemsByRole(items: MenuItem[]): MenuItem[] {
    const currentRole = this.userRole();
    return items.filter((item) => {
      const hasAccess = !item.roles || item.roles.includes(currentRole);

      if (item.children) {
        item.children = item.children.filter(
          (child) => !child.roles || child.roles.includes(currentRole)
        );
        return hasAccess && item.children.length > 0;
      }

      return hasAccess;
    });
  }

  // Navigation methods
  navigateTo(path: string): void {
    this.router.navigate([path]).then(() => {
      if (this.isMobile()) {
        this.isMobileMenuOpen.set(false);
      }
    });
  }

  handleMenuItemClick(item: MenuItem): void {
    if (item.path) {
      this.navigateTo(item.path);
    } else if (item.action) {
      item.action();
    }
  }

  // PROPER ANGULAR 20 APPROACH - No async/await needed
  onLogout(): void {
    // Use RxJS observables directly
    this.authState.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Fallback: clear auth state and redirect
        this.router.navigate(['/auth/login']);
      },
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  toggleCollapse() {
    const newState = !this.isCollapsed();
    this.collapseChange.emit(newState);
  }
}
