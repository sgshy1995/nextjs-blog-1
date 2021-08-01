import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Posts {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar')
    title: string;

    @Column('text')
    content: string;

    @Column('varchar')
    date: string;

    constructor(attributes: Partial<Posts>) {
        Object.assign(this, attributes);
    }

}
