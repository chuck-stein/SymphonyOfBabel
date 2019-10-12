import React from 'react';

const Button = (props) => {

    const style = {
        backgroundColor: props.unusable ? '#CDCACC' : '#CDD6DD',
        color: props.unusable ? '#666666' : '#000000',
        border: props.unusable ? '1px solid #666666' : '1px solid black',
        cursor: props.unusable ? 'default' : 'pointer'
    };

    return (<button style={style} className='buttonComponent' type='button' onClick={props.callback}>{props.text}</button>);
};

export default Button;
