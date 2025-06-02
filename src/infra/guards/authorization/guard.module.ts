import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@/infra/guards/authorization/auth.guard';

@Module({
  imports: [HttpModule],
  providers: [AuthGuard],
})
export class GuardModule {}
