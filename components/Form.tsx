import React, {ChangeEventHandler, FormEventHandler, ReactChild} from 'react';

type Props = {
    fields: { label: string, type: 'text' | 'password' | 'textarea', value: string | number, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }[];
    errorInfo: string,
    onSubmit: FormEventHandler;
    button: ReactChild
}

export const Form: React.FunctionComponent<Props> = (props) => {
    return (
        <form onSubmit={props.onSubmit}>
            {
                props.fields.map((field,index) => <div className="form-item" key={index}>
                    <label>
                        <span>{field.label}</span>
                        {
                            field.type === 'text' || field.type === 'password' ?
                                <input onChange={field.onChange} type={field.type} value={field.value}/> :
                                <textarea cols={30} onChange={field.onChange} rows={10} value={field.value} />
                        }
                    </label>
                </div>)
            }
            {
                props.errorInfo ? <div className="error-info">{props.errorInfo}</div> : null
            }
            {
                props.button
            }
        </form>
    );
};