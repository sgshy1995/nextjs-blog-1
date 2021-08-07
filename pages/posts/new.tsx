import {NextPage} from 'next';
import React from 'react';
import {useForm} from '../../hooks/useForm';

const New: NextPage = (props) => {
    const onSubmit = (form: typeof initForm) => {

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