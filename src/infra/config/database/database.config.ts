import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      migrations: ['dist/src/infra/database/migrations/*.js'],
      migrationsTableName: 'migrations',
      synchronize: !isProduction,
      logging: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
    };
  }
}
