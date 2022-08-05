import React, {useState, useContext} from 'react';
import axios from "axios";
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
import ExcerptFetch from "./ExcerptFetch";

//The Browse component is where users can enter an excerpt ID to find the corresponding audio excerpt.
const Browse = () => {

    // Whether the component is ready to find a specified audio excerpt
    const [shouldFetch, setShouldFetch] = useState(false);
    // The excerpt ID entered by the user
    const [enteredID, setEnteredID] = useState("");
    // Whether the user recently entered an invalid excerpt ID
    const [invalidID, setInvalidID] = useState(false);
    // The settings for audio excerpts (duration and sample rate)
    const audioSettingsContext = useContext(AudioSettingsContext);

    /**
     * Make an HTTP request for getting the audio excerpt associated with the excerpt ID entered by the user.
     * @returns {Promise<Object>} the response data of the request, containing the requested audio excerpt and its ID
     */
    const browseAPICall = async () => {
        const response = await axios.post('/specificExcerpt', { id: enteredID });
        return response.data;
    };

    /**
     * Determine whether the given string is a valid excerpt ID. Valid IDs contain only base-64 digits, with length equal
     * to the number of samples in an audio excerpt.
     * @param {string} s - the string entered by the user, to be checked for validity
     * @returns {boolean} whether or not the string entered by the user is a valid excerpt ID
     */
    const isValidID = (s) => {
        const numChars = audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration;
        const validIDs = new RegExp( '^[0-9a-zA-Z]{' + numChars + '}$', 'i'); // TODO: fix regex to include - and _
        return validIDs.test(s);
    };

    /**
     * Processes the string entered by the user, by preparing an API call if the string is a valid excerpt ID, and notifying
     * the user if not.
     */
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
