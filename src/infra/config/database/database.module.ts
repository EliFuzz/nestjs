import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '@/infra/config/database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = new DatabaseConfig(configService);
        return databaseConfig.createTypeOrmOptions();
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseConfig],
})
export class DatabaseModule {}
