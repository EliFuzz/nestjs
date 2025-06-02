import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra/infra.module';
import { UserManagementModule } from '@/module/user-access-management/user-management.module';

@Module({
  imports: [InfraModule, UserManagementModule],
})
export class AppModule {}
