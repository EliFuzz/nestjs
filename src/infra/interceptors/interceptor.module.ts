import { Module } from '@nestjs/common';
import { ResponseCleanupInterceptor } from '@/infra/interceptors/response-cleanup/response-cleanup.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseCleanupInterceptor,
    },
  ],
})
export class InterceptorModule {}
