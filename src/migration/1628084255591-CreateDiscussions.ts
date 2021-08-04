import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateDiscussions1628084255591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'discussions',
            columns: [
                {
                    name: 'id',
                    isGenerated: true,
                    isPrimary: true,
                    generationStrategy: 'increment',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'userId',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'content',
                    type: 'text',
                    isNullable: false
                },
                {
                    name: 'postId',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('discussions')
    }

}
