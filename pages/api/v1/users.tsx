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
        passwordTag: string;
        passwordConfirmTag: string;
    }
    files: unknown;
}

export const config = {
    api: {
        bodyParser: false,
    }
};

const Users: NextApiHandler = async (req, res) => {

    const form = new IncomingForm();
    const data: FormData = await new Promise((res, rej) => {
        form.parse(req, function (err, fields: { username: string, password: string, passwordConfirm: string, passwordTag: string, passwordConfirmTag: string; }, files) {
            if (err) rej(err);
            res({fields, files});
        });
    });
    const {fields, files} = data;

    //解密
    const publicKey = require('security/rsa_public.json').key;
    const username: string = fields.username;

    // 解密
    const decipherP = crypto.createDecipher("aes-256-gcm", publicKey);
    decipherP.setAuthTag(stringToUint8Array(fields.passwordTag));
    const decipherPIn = decipherP.update(fields.password, "hex","utf8");
    const password = decipherPIn + decipherP.final("utf8");

    const decipherPC = crypto.createDecipher("aes-256-gcm", publicKey);
    decipherPC.setAuthTag(stringToUint8Array(fields.passwordConfirmTag));
    const decipherPCIn =decipherPC.update(fields.passwordConfirm, "hex","utf8");
    const passwordConfirm = decipherPCIn + decipherPC.final("utf8");

    //const {username, password, passwordConfirm} = req.body as { [key: string]: string };

    const connection = await getDBConnection();

    const user = new User();
    user.username = username;
    user.password = password
    user.passwordConfirm = passwordConfirm

    await user.validate()

    if (!user.hasError) {
        user.result.code = 200;
        user.result.message = '注册成功';
        user.result.status = true;
        res.status(200);
        await connection.manager.save(user)
    } else {
        res.status(422);
    }
    res.setHeader('Content-Type', 'application/json').json(user.result);
    res.end();
};

export default Users;