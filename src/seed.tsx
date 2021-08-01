import "reflect-metadata";
import {createConnection} from "typeorm";
import {Posts} from './entity/Posts';

createConnection().then(async connection => {

    console.log(connection);
    const posts = await connection.manager.find(Posts);
    if (posts.length === 0) {
        await connection.manager.save([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
            return new Posts({
                title: `我的第${n}篇博客`,
                content: `这是我的博客内容，非常的不错`,
                date: `2021.04.03 11:11:23`
            });
        }));
    }
    await connection.close();

}).catch(error => console.log(error));
