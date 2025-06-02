import { Global, Module } from '@nestjs/common';
import { LoginModule } from '@/module/user-access-management/login/login.module';
import { RegistrationModule } from '@/module/user-access-management/registration/registration.module';
import { UserModule } from '@/module/user-access-management/user-management/user.module';

@Global()
@Module({
  imports: [LoginModule, RegistrationModule, UserModule],
})
export class UserManagementModule {}
