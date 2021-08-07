import React, {ChangeEventHandler, FormEventHandler, ReactChild, useCallback, useState} from 'react';

type useFormOptions<T> = {
    initForm: T,
    onSubmit: (fd: T) => void
    fields: { label: string, type: 'text' | 'password' | 'textarea', key: keyof T }[];
    button: ReactChild
}

export function useForm<T>(options: useFormOptions<T>) {
    const {initForm, onSubmit, fields, button} = options;

    const [form, setForm] = useState(initForm);

    const [errorInfo, setErrorInfo] = useState('');

    const onChange = useCallback((key: keyof T, value: any) => {
        setForm({...form, [key]: value});
    }, [form]);

    const _onSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(form);
    }, [onSubmit, form]);

    const formEle = (
        <form onSubmit={_onSubmit}>
            {
                fields.map((field, index) => <div className="form-item" key={index}>
                    <label>
                        <span>{field.label}</span>
                        {
                            field.type === 'text' || field.type === 'password' ?
                                <input onChange={(e) => onChange(field.key, e.target.value)} type={field.type}
                                       value={form[field.key].toString()}/> :
                                <textarea cols={30} onChange={(e) => onChange(field.key, e.target.value)} rows={10}
                                          value={form[field.key].toString()}/>
                        }
                    </label>
                </div>)
            }
            {
                errorInfo ? <div className="error-info">{errorInfo}</div> : null
            }
            {
                button
            }
        </form>
    );
    return {
        formEle,
        setErrorInfo
    };
}