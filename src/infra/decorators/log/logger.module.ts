import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import instance from '@/infra/config/logger/logger.config';
import { LoggerService } from '@/infra/decorators/log/logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot({ instance })],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
