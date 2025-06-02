import { QueryRunner, Table, TableColumnOptions } from 'typeorm';
import { TableIndex } from 'typeorm/schema-builder/table/TableIndex';

export const setUp = async (
  queryRunner: QueryRunner,
  tableName: string,
  columns: Record<string, TableColumnOptions>,
  indexes: TableIndex[],
) => {
  await queryRunner.createTable(
    new Table({
      name: tableName,
      columns: [...Object.values(columns)],
    }),
    true,
  );

  for (const index of indexes) {
    await queryRunner.createIndex(tableName, index);
  }
};

export const tearDown = async (
  queryRunner: QueryRunner,
  tableName: string,
  indexes: TableIndex[],
) => {
  for (const index of indexes) {
    await queryRunner.dropIndex(tableName, index.name ?? '');
  }

  await queryRunner.dropTable(tableName);
};
