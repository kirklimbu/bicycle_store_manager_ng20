export class UserModel {
  // Required properties with default values
  token = '';
  roleId = 0;
  id = 0;
  userId = 0;
  name = '';
  role: Role = Role.NONE;
  mobile = '';
  addressOne = '';
  addressTwo = '';
  email = '';
  attUserId = 0;
  // Optional properties
  isLoading = false;
  error: string | null = null;

  constructor(data?: Partial<UserModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  // Helper methods for business logic
  hasRole(requiredRole: Role): boolean {
    return this.role === requiredRole;
  }

  hasAnyRole(requiredRoles: Role[]): boolean {
    return requiredRoles.includes(this.role);
  }

  // Validation method
  isValid(): boolean {
    return !!this.token && !!this.email && this.role !== Role.NONE;
  }

  // Clone method
  clone(): UserModel {
    return new UserModel({ ...this });
  }
}

// Helper method to check if user has a specific role

export interface IUserLoginDto {
  userName: string;
  passWord: string;
}

export interface ILoginResponseDto {
  name: string | undefined;
  mobile?: string;
  email?: string;
  token?: string | undefined;
  userId?: number;
  id?: number;
  roleId?: number | undefined;
  role?: Role | undefined;
  attUserId?: number | null;
  addressOne?: string;
  addressTwo?: string;
  deviceId?: string;
}

// export type Role = 'ADMIN' | 'CUSTOMER';
export enum Role {
  NONE = '',
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
  USER = 'User',
}

export const UserRole = {
  NONE: '',
  SUPERADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  WAITER: 'Waiter',
  CUSTOMER: 'Customer',
  USER: 'User',
} as const;
