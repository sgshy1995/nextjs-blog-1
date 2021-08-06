import { withIronSession } from 'next-iron-session'
import {GetServerSideProps, NextApiHandler} from 'next';

export function withSession(handler:NextApiHandler | GetServerSideProps) {
    return withIronSession(handler, {
        password: process.env.COOKIE,
        cookieName: 'blog',
        cookieOptions: {
            // the next line allows to use the session in non-https environments like
            // Next.js dev mode (http://localhost:3000)
            secure: false,
        },
    })
}