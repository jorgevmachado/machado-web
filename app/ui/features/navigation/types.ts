import type { IconType } from 'react-icons';
import { RoleEnum } from '@/app/ui/features/auth';

export type MenuItem = {
  label: string;
  roles: Array<RoleEnum>;
  href: string;
  icon: IconType;
  children?: Array<MenuItem>;
};
