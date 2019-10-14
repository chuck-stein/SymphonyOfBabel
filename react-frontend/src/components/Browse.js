import React, {useState, useContext} from 'react';
import axios from "axios";
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
import ExcerptFetch from "./ExcerptFetch";

const Browse = () => {

    const [shouldFetch, setShouldFetch] = useState(false);
    const [enteredID, setEnteredID] = useState("");
    const [invalidID, setInvalidID] = useState(false);
    const audioSettingsContext = useContext(AudioSettingsContext);

    const browseAPICall = async () => {
        const response = await axios.post('/specificExcerpt', { id: enteredID });
        return response.data;
    };

    const isValidID = (s) => {
        const numChars = audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration;
        const validIDs = new RegExp( '^[0-9a-y]{' + numChars + '}$', 'i');
        return validIDs.test(s);
    };

    const evaluateID = () => {
        const idEntryField = document.getElementById('idEntryField');
        const enteredText = idEntryField.value;
        if (isValidID(enteredText)) {
            setEnteredID(enteredText);
            setShouldFetch(true);
        } else {
            idEntryField.select();
            setInvalidID(true);
        }
    };

    if (shouldFetch) {
        return <ExcerptFetch apiCall={() => browseAPICall()} />;
    }
    return (
        <div className='browse'>
            <h2>Paste the ID of the excerpt you want to navigate to:</h2>
            <textarea id='idEntryField' rows='10' cols='38' onInput={() => {setInvalidID(false)}} />
            <Button text='Locate' callback={() => evaluateID()} />
            {invalidID && <h4><em>INVALID ID! Ensure the ID was copied from an excerpt.</em></h4> }
        </div>
    );
};

export default Browse;
