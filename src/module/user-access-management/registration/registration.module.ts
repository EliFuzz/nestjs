import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterResolver } from '@/module/user-access-management/registration/registration.resolver';
import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';
import { RegistrationRepository } from '@/module/user-access-management/registration/registration.repository';
import { RegistrationValidationPipe } from '@/module/user-access-management/registration/registration-validation.pipe';
import { RegistrationService } from '@/module/user-access-management/registration/registration.service';
import { Encryption } from '@/module/user-access-management/common/encyption/encryption';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    RegistrationValidationPipe,
    RegisterResolver,
    RegistrationService,
    RegistrationRepository,
    Encryption,
  ],
})
export class RegistrationModule {}
