import {NextPage} from 'next';
import React, {useCallback,  useState} from 'react';
import axios, {AxiosError} from 'axios';
import {Uint8ArrayToString} from 'lib/bufferSwitchString';
// 非对称性加密

const crypto = require("crypto");
const path = require("path");

const SignUp: NextPage = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        passwordConfirm: ''
    });
    const [errorInfo,setErrorInfo] = useState('')
    const onSubmit = useCallback((e)=>{
        e.preventDefault()

        // 获取公钥和私钥
        let publicKey = require('security/rsa_public.json').key;
        // 加密
        let secretP = crypto.publicEncrypt(publicKey, Buffer.from(form.password,'utf-8'));
        let secretPC = crypto.publicEncrypt(publicKey, Buffer.from(form.passwordConfirm,'utf-8'));
        // 加密转字符串
        const stringBufferPassword = Uint8ArrayToString(secretP)
        const stringBufferPasswordConfirm = Uint8ArrayToString(secretPC)

        const formData = new FormData()
        formData.append('username', form.username)
        formData.append('password', stringBufferPassword)
        formData.append('passwordConfirm', stringBufferPasswordConfirm)

        axios.post('/api/v1/users',formData).then((response)=>{
            console.log('response',response)
        }).catch((error)=>{
            console.log('err',error.response.data)
            if (error.response){
                setErrorInfo((error as AxiosError).response.data.message)
            }else{
                setErrorInfo('注册失败，请联系管理员')
            }
        })
        console.log('submit',form)
    },[form])
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">注册页</div>
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
                        <div className="form-item">
                            <label>
                                确认密码：
                                <input value={form.passwordConfirm} type="password" onChange={(e)=>{setForm({
                                    ...form,
                                    passwordConfirm: e.target.value
                                })}}/>
                            </label>
                        </div>
                        {
                            errorInfo ? <div className="error-info">{errorInfo}</div> : null
                        }
                        <div className="form-item">
                            <button type="submit">注册</button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SignUp;