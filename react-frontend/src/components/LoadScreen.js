import React from 'react';
import loading from '../loading.svg';

const LoadScreen = () => (
    <div className='loadScreen'>
        <h1>Loading excerpt...</h1>
        <img src={loading}  alt='loading icon' />
    </div>
);

export default LoadScreen;
