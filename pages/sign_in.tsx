import {GetServerSideProps, NextPage} from 'next';
import React, {useCallback, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {withSession} from '../lib/withSession';
// 非对称性加密
import {Uint8ArrayToString} from 'lib/bufferSwitchString';
import crypto from 'crypto';
import {getDBConnection} from '../lib/getDBConnection';
import {Post} from '../src/entity/Post';
import {UAParser} from 'ua-parser-js';
import {User} from '../src/entity/User';

const SignIn: NextPage<{user:User | undefined}> = (props) => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [errorInfo, setErrorInfo] = useState('');
    const onSubmit = useCallback((e) => {
        e.preventDefault();

        // 获取公钥和私钥
        let publicKey = process.env.NEXT_PUBLIC_FRONT_KEY;
        // 加密
        const cipherP = crypto.createCipher("aes-256-gcm", publicKey);
        const cipherPIn = cipherP.update(form.password, 'utf8', 'hex');
        const secretP = cipherPIn + cipherP.final("hex");
        const secretPTag = cipherP.getAuthTag();

        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', secretP);
        formData.append('passwordTag', Uint8ArrayToString(secretPTag));

        axios.post('/api/v1/sessions', formData).then((response) => {
            console.log('response', response);
            setErrorInfo('');
            alert('登录成功');
        }).catch((error) => {
            console.log('err', error.response.data);
            if (error.response) {
                setErrorInfo((error as AxiosError).response.data.message);
            } else {
                setErrorInfo('登录失败，请联系管理员');
            }
        });
        console.log('submit', form);
    }, [form]);
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">登录页</div>
                {
                    props.user && <div>当前登录用户：{props.user.username}</div>
                }
                <div className="content">
                    <form onSubmit={onSubmit}>
                        <div className="form-item">
                            <label>
                                用户名：
                                <input value={form.username} type="text" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        username: e.target.value
                                    });
                                }}/>
                            </label>
                        </div>
                        <div className="form-item">
                            <label>
                                密码：
                                <input value={form.password} type="password" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    });
                                }}/>
                            </label>
                        </div>
                        {
                            errorInfo ? <div className="error-info">{errorInfo}</div> : null
                        }
                        <div className="form-item">
                            <button type="submit">登录</button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SignIn;

// @ts-ignore
export const getServerSideProps: GetServerSideProps = withSession(async (context) => {
    // @ts-ignore
    const user = context.req.session.get('currentUser');
    console.log('user',user)
    console.log('type user',typeof user)
    return {
        props: user ? {
            user: JSON.parse(JSON.stringify(user))
        } : {}
    };
});