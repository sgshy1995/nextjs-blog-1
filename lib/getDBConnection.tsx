import {createConnection, getConnectionManager} from 'typeorm';
import {User} from 'src/entity/User';
import {Post} from 'src/entity/Post';
import {Discussion} from 'src/entity/Discussion';
import 'reflect-metadata'
import ormconfig from 'ormconfig.json'

// 解决 js 无法识别 metadata 的问题
const create = async ()=>{
    // @ts-ignore
    return createConnection({
        ...ormconfig,
        entities: [User,Post,Discussion]
    });
}

// 使用立即执行函数，解决js中的await不能在顶层的问题
const promise = (async function () {
    const manager = getConnectionManager();
    // 如果不存在连接，则创建新的
    if (!manager.has('default')) {
        return create();
    } else {
        const currentConnection = manager.get('default');
        // 如果存在连接，且还在连接状态，则使用旧的
        if (currentConnection.isConnected) {
            return currentConnection;
        }
        // 如果存在连接，且已经断开了，则创建新的
        else {
            return create();
        }
    }
})();

export const getDBConnection = async () => {
    return promise;
};