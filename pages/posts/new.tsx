import {NextPage} from 'next';
import React from 'react';
import {useForm} from 'hooks/useForm';
import axios, {AxiosError} from 'axios';

const New: NextPage = (props) => {
    const onSubmit = (form: typeof initForm) => {
        axios.post('/api/v1/posts', form).then((response) => {
            setErrorInfo('');
            alert('创建博客成功');
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

    const initForm = {title: '', content: ''};
    const {formEle, setErrorInfo} = useForm({
        initForm,
        onSubmit,
        fields: [
            {
                label: '标题', type: 'text', key: 'title'
            },
            {
                label: '内容', type: 'textarea', key: 'content'
            }
        ],
        button: <div className="form-item">
            <button type="submit">提交</button>
        </div>
    });
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">添加博客页</div>
                <div className="content">
                    {formEle}
                </div>
            </div>
        </React.Fragment>
    );
};
export default New;