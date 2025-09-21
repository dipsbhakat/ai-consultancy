import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../../../types/enums';

export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);
