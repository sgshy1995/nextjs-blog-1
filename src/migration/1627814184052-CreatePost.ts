import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePost1627814184052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 升级数据库
        await queryRunner.createTable(new Table({
            name: 'posts',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    generationStrategy: 'increment',
                    isPrimary: true,
                    isGenerated: true
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'content',
                    type: 'text',
                    isNullable: false
                },
                {
                    name: 'date',
                    type: 'date',
                    isNullable: false
                }
            ]
        }),true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 降级数据库
        await queryRunner.dropTable('post',true)
    }

}
