import React from 'react';
import loading from '../loading.svg';

// The LoadScreen component is a loading animation and text to notify the user that a certain audio excerpt is being located.
const LoadScreen = () => (
    <div className='loadScreen'>
        <h1>Loading excerpt...</h1>
        <img src={loading}  alt='loading icon' />
    </div>
);

export default LoadScreen;
