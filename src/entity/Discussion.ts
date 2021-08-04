import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from './Post';
import {User} from './User';

@Entity('discussions')
export class Discussion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    title: string;

    @Column('text')
    content: string;

    @Column('int')
    authorId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => Post,post => post.discussions)
    post: Post

    @ManyToOne(type => User,user => user.discussions)
    user: User
}
