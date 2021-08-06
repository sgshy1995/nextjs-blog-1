import { withIronSession } from 'next-iron-session'
import {NextApiHandler} from 'next';

export function withSession(handler:NextApiHandler) {
    return withIronSession(handler, {
        password: require('security/rsa_cookie.json').key,
        cookieName: 'blog',
        cookieOptions: {
            // the next line allows to use the session in non-https environments like
            // Next.js dev mode (http://localhost:3000)
            secure: false,
        },
    })
}