import {NextApiHandler} from 'next';
import {getDBConnection} from 'lib/getDBConnection';
import {User} from 'src/entity/User';
import {Fields, IncomingForm} from 'formidable';
import crypto from 'crypto';
import {stringToUint8Array} from 'lib/bufferSwitchString';

type FormData = {
    fields: {
        username: string;
        password: string;
        passwordConfirm: string;
    }
    files: unknown;
}

export const config = {
    api: {
        bodyParser: false,
    }
};

const Posts: NextApiHandler = async (req, res) => {

    const form = new IncomingForm();
    const data: FormData = await new Promise((res, rej) => {
        form.parse(req, function (err, fields: { username: string, password: string, passwordConfirm: string; }, files) {
            if (err) rej(err);
            res({fields, files});
        });
    });
    const {fields, files} = data;

    //解密
    let privateKey = require('security/rsa_private.json').key;
    const username: string = fields.username;
    const password: string = crypto.privateDecrypt(privateKey, stringToUint8Array(fields.password)).toString();
    const passwordConfirm: string = crypto.privateDecrypt(privateKey, stringToUint8Array(fields.passwordConfirm)).toString();

    //const {username, password, passwordConfirm} = req.body as { [key: string]: string };

    const connection = await getDBConnection();
    let result: Result = {
        code: 422,
        message: '',
        status: false
    };
    let hasError = true;
    if (!username || !username.trim()) {
        result.message = '请输入用户名';
    } else if (!/[a-zA-Z0-9]/g.test(username.trim())) {
        result.message = '用户名只能包含英文或数字';
    } else if (username.length > 14) {
        result.message = '用户名长度不可超出14位';
    } else if (!password) {
        result.message = '请输入密码';
    } else if (password.length < 8 || password.length > 18) {
        result.message = '请输入8至18位密码';
    } else if (!passwordConfirm) {
        result.message = '请输入确认密码';
    } else if (password !== passwordConfirm) {
        result.message = '两次密码不一致';
    } else {
        const found = await connection.manager.findOne(User,{username})
        if (found){
            result.message = '用户名已存在';
        }else{
            hasError = false;
        }
    }
    if (!hasError) {
        result.code = 200;
        result.message = '注册成功';
        result.status = true;
        res.status(200).setHeader('Content-Type', 'application/json').json(result);
        const user = new User();
        user.username = username;
        user.passwordDigest = fields.password
        await connection.manager.save(user)
    } else {
        res.status(422).setHeader('Content-Type', 'application/json').json(result);
    }

    res.end();
};

export default Posts;