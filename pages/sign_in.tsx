import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React, {useCallback, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {withSession} from '../lib/withSession';
import {User} from '../src/entity/User';
import {Form} from '../components/Form';
import {frontCreateCipher} from '../lib/frontSecurity';

const SignIn: NextPage<{ user: User | undefined }> = (props) => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [errorInfo, setErrorInfo] = useState('');
    const onSubmit = useCallback((e) => {
        e.preventDefault();

        // 获取公钥，公钥的环境变量要暴露给浏览器
        let publicKey = process.env.NEXT_PUBLIC_FRONT_KEY;
        // 加密
        const {secret: secretP, secretTag: secretPTag} = frontCreateCipher(form.password, publicKey);

        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', secretP);
        formData.append('passwordTag', secretPTag);

        axios.post('/api/v1/sessions', formData).then((response) => {
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
                                  }
                              ]}
                          errorInfo={errorInfo}
                          button={
                              <div className="form-item">
                                  <button type="submit">登录</button>
                              </div>
                          }
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default SignIn;


export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const user = context.req.session.get('currentUser');
    return {
        props: user ? {
            user: JSON.parse(JSON.stringify(user))
        } : {}
    };
});