import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Role } from '../models/user.model';
import { AuthState } from '../../../auth/login/state/login.state';

// 1. MAIN ROLE GUARD (handles all role-based scenarios)
export const hasRoleGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthState);
  const router = inject(Router);

  const requiredRoles: Role[] = route.data['roles'] || [];

  // Check authentication first
  if (!authState.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // If no roles specified OR user has required role, allow access
  if (requiredRoles.length === 0 || authState.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Access denied - redirect based on user's role
  return false;
};
