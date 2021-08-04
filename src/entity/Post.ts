import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Discussion} from './Discussion';
import {User} from './User';

@Entity('posts')
export class Post {
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

    @OneToMany(type => Discussion,discussion => discussion.id)
    discussions: Discussion[]

    @ManyToOne(type => User,user => user.posts)
    author: User
}
