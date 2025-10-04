import { Role } from 'src/app/domains/shared/util-auth/models/user.model';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  roles?: Role[];
  children?: MenuItem[];
  action?: () => void;
  isVisible?: () => boolean;
}

export interface MenuConfig {
  mainItems: MenuItem[];
  adminItems: MenuItem[];
  settingsItems: MenuItem[];
}
