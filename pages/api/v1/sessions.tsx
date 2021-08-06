import {NextApiHandler} from 'next';
import {getDBConnection} from 'lib/getDBConnection';
import {IncomingForm} from 'formidable';
import crypto from 'crypto';
import {stringToUint8Array} from 'lib/bufferSwitchString';
import {SignIn} from 'src/module/SignIn';
import {withSession} from 'lib/withSession';

type FormData = {
    fields: {
        username: string;
        password: string;
        passwordTag: string;
    }
}

export const config = {
    api: {
        bodyParser: false,
    }
};

const Users: NextApiHandler = async (req, res) => {

    const form = new IncomingForm();
    const data: FormData = await new Promise((res, rej) => {
        form.parse(req, function (err, fields: { username: string, password: string, passwordTag: string; }, files) {
            if (err) rej(err);
            res({fields});
        });
    });
    const {fields} = data;

    //解密
    const publicKey = require('security/rsa_public.json').key;
    const username: string = fields.username;

    // 解密
    const decipherP = crypto.createDecipher("aes-256-gcm", publicKey);
    decipherP.setAuthTag(stringToUint8Array(fields.passwordTag));
    const decipherPIn = decipherP.update(fields.password, "hex", "utf8");
    const password = decipherPIn + decipherP.final("utf8");

    //const {username, password, passwordConfirm} = req.body as { [key: string]: string };

    const connection = await getDBConnection();

    const signIn = new SignIn();
    signIn.username = username;
    signIn.password = password;

    await signIn.validate();

    if (!signIn.hasError) {
        signIn.result.code = 200;
        signIn.result.message = '登录成功';
        signIn.result.status = true;
        res.status(200);
        req.session.set('currentUser', signIn.user);
        console.log('signIn.user',signIn.user)
        await req.session.save()
        //await connection.manager.save(signIn)
    } else {
        res.status(422);
    }
    res.setHeader('Content-Type', 'application/json').json(signIn.result);
    res.end();
};

export default withSession(Users);