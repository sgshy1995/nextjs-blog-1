import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React from 'react';
import axios, {AxiosError} from 'axios';
import {withSession} from 'lib/withSession';
import {User} from 'src/entity/User';
import {frontCreateCipher} from 'lib/frontSecurity';
import {useForm} from 'hooks/useForm';

const SignIn: NextPage<{ user: User | undefined }> = (props) => {

    const onSubmit = (form: typeof initForm) => {
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
        console.log('submit');
    };
    const initForm = {username: '', password: ''};
    const {formEle, setErrorInfo} = useForm({
        initForm,
        onSubmit,
        fields: [
            {
                label: '用户名', type: 'text', key: 'username'
            },
            {
                label: '密码', type: 'password', key: 'password'
            }
        ],
        button: <div className="form-item">
            <button type="submit">登录</button>
        </div>
    });
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">登录页</div>
                {
                    props.user && <div>当前登录用户：{props.user.username}</div>
                }
                <div className="content">
                    {formEle}
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