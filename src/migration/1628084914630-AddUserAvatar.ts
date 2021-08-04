import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserAvatar1628084914630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('users',[
            new TableColumn({
                name: 'avatar',
                type: 'text',
                isNullable: true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.dropColumn('users','avatar')
        }catch (e) {
            
        }
        
    }

}
