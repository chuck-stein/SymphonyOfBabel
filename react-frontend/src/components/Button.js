import React from 'react';

// The Button component is a text button that triggers a specified callback when clicked, and has certain styling
// indicating whether it is currently clickable
const Button = (props) => {

    // The CSS styling for the button (grayed out if unusable, otherwise uses default styling specified in App.css)
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
