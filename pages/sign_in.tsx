import {NextPage} from 'next';
import React, {useCallback,  useState} from 'react';
import axios, {AxiosError} from 'axios';
import {Uint8ArrayToString} from 'lib/bufferSwitchString';
// 非对称性加密

import crypto from 'crypto';

const SignIn: NextPage = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [errorInfo,setErrorInfo] = useState('')
    const onSubmit = useCallback((e)=>{
        e.preventDefault()

        // 获取公钥和私钥
        let publicKey = require('security/rsa_public.json').key;
        // 加密
        const cipherP = crypto.createCipher("aes-256-gcm", publicKey);
        const cipherPIn = cipherP.update(form.password,'utf8','hex');
        const secretP = cipherPIn + cipherP.final("hex");
        const secretPTag = cipherP.getAuthTag();

        const formData = new FormData()
        formData.append('username', form.username)
        formData.append('password', secretP)
        formData.append('passwordTag',  Uint8ArrayToString(secretPTag))

        axios.post('/api/v1/sessions',formData).then((response)=>{
            console.log('response',response)
            setErrorInfo('')
            alert('登录成功')
        }).catch((error)=>{
            console.log('err',error.response.data)
            if (error.response){
                setErrorInfo((error as AxiosError).response.data.message)
            }else{
                setErrorInfo('登录失败，请联系管理员')
            }
        })
        console.log('submit',form)
    },[form])
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">登录页</div>
                <div className="content">
                    <form onSubmit={onSubmit}>
                        <div className="form-item">
                            <label>
                                用户名：
                                <input value={form.username} type="text" onChange={(e)=>{setForm({
                                    ...form,
                                    username: e.target.value
                                })}}/>
                            </label>
                        </div>
                        <div className="form-item">
                            <label>
                                密码：
                                <input value={form.password} type="password" onChange={(e)=>{setForm({
                                    ...form,
                                    password: e.target.value
                                })}}/>
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