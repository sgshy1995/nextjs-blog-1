import {createConnection, getConnectionManager} from 'typeorm';

// 使用立即执行函数，解决js中的await不能在顶层的问题
const promise = (async function () {
    const manager = getConnectionManager();
    // 如果不存在连接，则创建新的
    if (!manager.has('default')) {
        return createConnection();
    } else {
        const currentConnection = manager.get('default');
        // 如果存在连接，且还在连接状态，则使用旧的
        if (currentConnection.isConnected) {
            return currentConnection;
        }
        // 如果存在连接，且已经断开了，则创建新的
        else {
            return createConnection();
        }
    }
})();

export const getDBConnection = async () => {
    return promise;
};