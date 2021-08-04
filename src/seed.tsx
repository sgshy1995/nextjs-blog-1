import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from './entity/User';
import {Post} from './entity/Post';
import {Discussion} from './entity/Discussion';

createConnection().then(async connection => {

    const {manager} = connection;
    // create user
    const u1 = new User()
    u1.username = 'sgs'
    u1.passwordDigest = 'md5'
    await manager.save(u1)
    // create post
    const p1 = new Post()
    p1.title = '我的第一篇博客'
    p1.content = '这是我的博客内容，你稍微看一下'
    p1.author = u1
    await manager.save(p1)
    // create discussion
    const d1 = new Discussion()
    d1.content = '这篇文章写得还不错，值得推荐！'
    d1.user = u1
    d1.post = p1
    await manager.save(d1)
    await connection.close();

}).catch(error => console.log(error));
