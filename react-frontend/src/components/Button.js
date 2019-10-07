import React from 'react';

const Button = (props) => (
    <button className='buttonComponent' type='button' onClick={props.callback}>{props.text}</button>
);

export default Button;
