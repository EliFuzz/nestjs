import { MigrationInterface, QueryRunner, TableColumnOptions } from 'typeorm';
import { TableIndex } from 'typeorm/schema-builder/table/TableIndex';
import { setUp, tearDown } from '@/database/utils/db';

export class CreateUserTable1703000000000 implements MigrationInterface {
  name: string = 'CreateUserTable1703000000000';

  private readonly tableName: string = 'users';

  private readonly tableColumns: Record<string, TableColumnOptions> = {
    id: {
      name: 'id',
      type: 'uuid',
      isPrimary: true,
      generationStrategy: 'uuid',
      default: 'uuid_generate_v4()',
    },
    firstName: {
      name: 'first_name',
      type: 'varchar',
      length: '100',
      isNullable: false,
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
      length: '100',
      isNullable: false,
    },
    email: {
      name: 'email',
      type: 'varchar',
      length: '255',
      isUnique: true,
      isNullable: false,
    },
    password: {
      name: 'password',
      type: 'varchar',
      length: '255',
      isNullable: false,
    },
    phoneNumber: {
      name: 'phone_number',
      type: 'varchar',
      length: '20',
      isNullable: true,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      default: true,
      isNullable: false,
    },
    isEmailVerified: {
      name: 'is_email_verified',
      type: 'boolean',
      default: false,
      isNullable: false,
    },
    lastLoginAt: {
      name: 'last_login_at',
      type: 'timestamp',
      isNullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      isNullable: false,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
      isNullable: false,
    },
  };

  private readonly tableIndexes = [
    new TableIndex({
      name: 'IDX_USERS_EMAIL',
      columnNames: [this.tableColumns.email.name],
      isUnique: true,
    }),
    new TableIndex({
      name: 'IDX_USERS_IS_ACTIVE',
      columnNames: [this.tableColumns.isActive.name],
    }),
    new TableIndex({
      name: 'IDX_USERS_IS_EMAIL_VERIFIED',
      columnNames: [this.tableColumns.isEmailVerified.name],
    }),
    new TableIndex({
      name: 'IDX_USERS_CREATED_AT',
      columnNames: [this.tableColumns.createdAt.name],
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await setUp(
      queryRunner,
      this.tableName,
      this.tableColumns,
      this.tableIndexes,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await tearDown(queryRunner, this.tableName, this.tableIndexes);
  }
}
