import React from 'react';

const Button = (props) => {

    const style = props.unusable ? {
        backgroundColor: '#CDCACC',
        color: '#666666',
        border: '1px solid #666666',
        cursor: 'default'
    } : {};

    return (
        <button style={style} className='buttonComponent' type='button' onClick={() => { if (!props.unusable) props.callback() }}>
            {props.text}
        </button>
    );
};

export default Button;
