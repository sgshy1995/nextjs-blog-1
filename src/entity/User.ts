import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Post } from "./Post";
import {Discussion} from './Discussion';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    username: string;

    @Column('text')
    avatar: string;

    @Column('varchar')
    passwordDigest: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Post,post => post.author)
    posts: Post[]

    @OneToMany(type => Discussion,discussion => discussion.id)
    discussions: Discussion[]
}
