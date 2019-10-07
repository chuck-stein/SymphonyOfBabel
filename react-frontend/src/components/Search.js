import React, {Component} from 'react';
import Button from "./Button";

function Search() {
    return (
        <div className={'search'}>
            <h2>Record any 5-second sound to locate its corresponding excerpt:</h2>
            <Button text='Start Recording' callback={() => {}} />
        </div>
    );
}

export default Search;
