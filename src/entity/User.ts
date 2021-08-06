import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from "./Post";
import {Discussion} from './Discussion';
import {getDBConnection} from '../../lib/getDBConnection';
import crypto from 'crypto';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    username: string;

    @Column('text')
    avatar: string | null | undefined;

    @Column('varchar')
    passwordDigest: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Post, post => post.author)
    posts: Post[];

    @OneToMany(type => Discussion, discussion => discussion.id)
    discussions: Discussion[];

    secretPTag: string;
    secretPCTag: string;

    password: string;
    passwordConfirm: string;

    hasError: boolean = true;
    result: Result = {
        code: 422,
        message: '',
        status: false
    };

    async validate() {
        const connection = await getDBConnection();
        if (!this.username || !this.username.trim()) {
            this.result.message = '请输入用户名';
        } else if (!/[a-zA-Z0-9]/g.test(this.username.trim())) {
            this.result.message = '用户名只能包含英文或数字';
        } else if (this.username.length > 14) {
            this.result.message = '用户名长度不可超出14位';
        } else if (!this.password) {
            this.result.message = '请输入密码';
        } else if (this.password.length < 8 || this.password.length > 18) {
            this.result.message = '请输入8至18位密码';
        } else if (!this.passwordConfirm) {
            this.result.message = '请输入确认密码';
        } else if (this.password !== this.passwordConfirm) {
            this.result.message = '两次密码不一致';
        } else {
            const found = await connection.manager.findOne(User, {username: this.username});
            if (found) {
                this.result.message = '用户名已存在';
            } else {
                this.hasError = false;
            }
        }
    }

    @BeforeInsert()
    generatePasswordDigest(){
        // 后端加盐存储密码加密
        const privateKey = process.env.BACK_KEY;
        const hmac = crypto.createHmac("sha256", privateKey);
        this.passwordDigest = hmac.update(this.password).digest("hex");
    }
}
