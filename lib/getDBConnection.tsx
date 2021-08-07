import {createConnection, getConnectionManager} from 'typeorm';
import {User} from 'src/entity/User';
import {Post} from 'src/entity/Post';
import {Discussion} from 'src/entity/Discussion';
import 'reflect-metadata';
import ormconfig from 'ormconfig.json';

// 解决 js 无法识别 metadata 的问题
const create = async () => {
    // @ts-ignore
    return createConnection({
        ...ormconfig,
        entities: [User, Post, Discussion]
    });
};

// 使用立即执行函数，解决js中的await不能在顶层的问题
const promise = (async function () {
    const manager = getConnectionManager();
    const currentConnection = manager && manager.has('default') && manager.get('default');
    // 如果存在连接，则先关闭。这是为了解决开发环境每次修改代码，如果使用旧的连接，则依然无法识别到metadata的bug。
    if (currentConnection) await currentConnection.close();
    return create();
})();

export const getDBConnection = async () => {
    return promise;
};