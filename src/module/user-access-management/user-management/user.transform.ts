import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';
import { UserPayload } from '@/module/user-access-management/user-management/user.schema';

const toEntity = {
  id: 'id',
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  phoneNumber: 'phone_number',
  isActive: 'is_active',
  isEmailVerified: 'is_email_verified',
  lastLoginAt: 'last_login_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const toUserEntityFields = (
  entityName: string,
  requestedFields: string[],
): string[] =>
  requestedFields.map((field) => `${entityName}.${toEntity[field]}`);

export const toUserPayload = (user: UserEntity): UserPayload => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
