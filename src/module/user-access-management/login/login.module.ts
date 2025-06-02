import { Module } from '@nestjs/common';
import { LoginResolver } from './login.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginValidationPipe } from '@/module/user-access-management/login/login-validation.pipe';
import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';
import { LoginRepository } from '@/module/user-access-management/login/login.repository';
import { LoginService } from '@/module/user-access-management/login/login.service';
import { Encryption } from '@/module/user-access-management/common/encyption/encryption';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    LoginValidationPipe,
    LoginResolver,
    LoginService,
    LoginRepository,
    Encryption,
  ],
})
export class LoginModule {}
