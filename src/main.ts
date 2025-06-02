import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/module/app.module';
import { INestApplication } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error: Error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
