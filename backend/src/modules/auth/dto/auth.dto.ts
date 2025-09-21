import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { AdminRole } from '../../../types/enums';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole = AdminRole.VIEWER;
}

export class UpdateAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  lastName?: string;

  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @IsOptional()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export interface AdminJwtPayload {
  sub: string; // Admin ID
  email: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
  };
}
