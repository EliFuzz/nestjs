import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GuardModule } from '@/infra/guards/authorization/guard.module';
import { ConfigurationModule } from '@/infra/config/config.module';
import { AuthMiddleware } from '@/infra/middleware/user-identity-management/auth.middleware';
import { DatabaseModule } from '@/infra/config/database/database.module';
import { LoggerModule } from '@/infra/decorators/log/logger.module';
import { HttpModule } from '@nestjs/axios';
import { InterceptorModule } from '@/infra/interceptors/interceptor.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    LoggerModule,
    HttpModule,
    GuardModule,
    InterceptorModule,
  ],
  providers: [AuthMiddleware],
})
export class InfraModule {
  configure(consumer: MiddlewareConsumer) {
    const middleware = consumer.apply(AuthMiddleware);
    middleware.exclude('/health');
    middleware.forRoutes('*');
  }
}
