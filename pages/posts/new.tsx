import {NextPage} from 'next';
import React, {useCallback, useState} from 'react';
import {Form} from '../../components/Form';

const New: NextPage = (props) => {
    const [form, setForm] = useState({
        title: '',
        content: ''
    });
    const [errorInfo, setErrorInfo] = useState('');
    const onSubmit = useCallback((e) => {
        e.preventDefault()
    }, [form]);
    return (
        <React.Fragment>
            <div className="signup-wrapper">
                <div className="title">添加博客页</div>
                <div className="content">
                    <Form onSubmit={onSubmit}
                          fields={
                              [
                                  {
                                      label: '博客标题', type: 'text', onChange: (e) => {
                                          setForm({
                                              ...form,
                                              title: e.target.value
                                          });
                                      }, value: form.title
                                  },
                                  {
                                      label: '博客内容', type: 'textarea', onChange: (e) => {
                                          setForm({
                                              ...form,
                                              content: e.target.value
                                          });
                                      }, value: form.content
                                  }
                              ]}
                          errorInfo={errorInfo}
                          button={
                              <div className="form-item">
                                  <button type="submit">提交</button>
                              </div>
                          }
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
export default New;