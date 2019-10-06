import React, {Component} from 'react';
import loading from '../loading.svg';

function LoadScreen() {
    return (
        <div className='loadScreen'>
            <h1>Loading excerpt...</h1>
            <img src={loading}  alt='loading icon' />
        </div>
    );
}

export default LoadScreen;
