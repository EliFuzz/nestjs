import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';
import { UserValidationPipe } from '@/module/user-access-management/user-management/user-validation.pipe';
import { UserService } from '@/module/user-access-management/user-management/user.service';
import { UserResolver } from '@/module/user-access-management/user-management/user.resolver';
import { UserRepository } from '@/module/user-access-management/user-management/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserValidationPipe, UserResolver, UserService, UserRepository],
})
export class UserModule {}
