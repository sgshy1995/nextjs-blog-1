import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class AddUsernameIndex1628226543302 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.createIndex('users', new TableIndex({
           name: 'usernameIndex',
           columnNames: ['username'],
           isUnique: true
       }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('users','usernameIndex')
    }

}
