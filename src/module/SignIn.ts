import {getDBConnection} from 'lib/getDBConnection';
import crypto from 'crypto';
import {User} from 'src/entity/User';

export class SignIn {
    username: string;
    password: string;
    passwordDigest: string;

    hasError: boolean = true;
    result: Result = {
        code: 422,
        message: '',
        status: false
    };
    user: User;

    async validate() {
        const connection = await getDBConnection();
        if (!this.username || !this.username.trim()) {
            this.result.message = '请输入用户名';
        } else if (!this.password) {
            this.result.message = '请输入密码';
        } else {
            const user = await connection.manager.findOne(User, {where: {username: this.username}});
            if (user) {
                // 密码加盐对比数据库
                const privateKey = process.env.BACK_KEY;
                const hmac = crypto.createHmac("sha256", privateKey);
                this.passwordDigest = hmac.update(this.password).digest("hex");
                if (this.passwordDigest === user.passwordDigest) {
                    this.hasError = false;
                    // 记录 user 信息，以便后面记录 session
                    this.user = user
                } else {
                    this.result.message = '用户名或密码错误';
                }
            } else {
                this.result.message = '用户名或密码错误';
            }
        }
    }
}
