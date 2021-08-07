import {NextPage} from 'next';
import React, {useCallback, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {Form} from '../components/Form';
import {frontCreateCipher} from '../lib/frontSecurity';

const SignUp: NextPage = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        passwordConfirm: ''
    });
    const [errorInfo, setErrorInfo] = useState('');
    const onSubmit = useCallback((e) => {
        e.preventDefault();

        // 获取公钥，公钥的环境变量要暴露给浏览器
        let publicKey = process.env.NEXT_PUBLIC_FRONT_KEY;
        // 加密
        const {secret: secretP, secretTag: secretPTag} = frontCreateCipher(form.password, publicKey);
        const {secret: secretPC, secretTag: secretPCTag} = frontCreateCipher(form.passwordConfirm, publicKey);

        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', secretP);
        formData.append('passwordConfirm', secretPC);
        formData.append('passwordTag', secretPTag);
        formData.append('passwordConfirmTag', secretPCTag);

        axios.post('/api/v1/users', formData).then((response) => {
            console.log('response', response);
            setErrorInfo('');
            alert('注册成功');
            window.location.href = '/sign_in';
        }).catch((error) => {
            console.log('err', error.response.data);
            if (error.response) {
                setErrorInfo((error as AxiosError).response.data.message);
            } else {
                setErrorInfo('注册失败，请联系管理员');
            }
        });
        console.log('submit', form);
    }, [form]);
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">注册页</div>
                <div className="content">
                    <Form onSubmit={onSubmit}
                          fields={
                              [
                                  {
                                      label: '用户名', type: 'text', onChange: (e) => {
                                          setForm({
                                              ...form,
                                              username: e.target.value
                                          });
                                      }, value: form.username
                                  },
                                  {
                                      label: '密码', type: 'password', onChange: (e) => {
                                          setForm({
                                              ...form,
                                              password: e.target.value
                                          });
                                      }, value: form.password
                                  },
                                  {
                                      label: '确认密码', type: 'password', onChange: (e) => {
                                          setForm({
                                              ...form,
                                              passwordConfirm: e.target.value
                                          });
                                      }, value: form.passwordConfirm
                                  }
                              ]}
                          errorInfo={errorInfo}
                          button={
                              <div className="form-item">
                                  <button type="submit">注册</button>
                              </div>
                          }
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default SignUp;