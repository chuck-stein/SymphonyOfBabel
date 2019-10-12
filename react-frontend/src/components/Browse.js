import React, {useState} from 'react';
import Button from "./Button";
import axios from "axios";
import ExcerptFetch from "./ExcerptFetch";

const Browse = () => {

    const [shouldFetch, setShouldFetch] = useState(false);
    const [enteredID, setEnteredID] = useState("");

    const browseAPICall = async () => {
        const response = await axios.post('/specificExcerpt', { id: enteredID });
        return response.data;
    };

    return shouldFetch ? (<ExcerptFetch apiCall={() => browseAPICall()} />) : (
        <div className='browse'>
            <h2>Paste the ID of the excerpt you want to navigate to:</h2>
            <textarea id='idField' rows='10' cols='50' />
            <Button text='Locate' callback={() => {
                setEnteredID(document.getElementById('idField').value);
                setShouldFetch(true);
            }} />
        </div>
    );
};

export default Browse;
