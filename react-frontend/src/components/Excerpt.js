import React, {useState, useContext} from 'react';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";
import axios from "axios";
import LoadScreen from "./LoadScreen";

Excerpt.defaultProps = { givenBufferData: null };

function Excerpt(props) {

    const [fetchedBufferData, setFetchedBufferData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const audioContext = useContext(AudioSettingsContext);

    /**
     * Get a string abbreviating this excerpt's ID, using its first {@param numChars} characters, followed by an ellipsis,
     * followed by its last {@param numChars} characters.
     * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
     * @returns {string} - The abbreviated ID, as a string
     */
    const abbreviateExcerptID = (numChars) => {
        const id = props.match.params.id;
        let abbreviation = '';
        if (id.length <= numChars * 2) {
            return id;
        }
        for (let i = 0; i < numChars; i++) {
            abbreviation += id.charAt(i);
        }
        abbreviation += '...';
        for (let i = 0; i < numChars; i++) {
            abbreviation += id.charAt(id.length - numChars + i);
        }
        return abbreviation;
    };

    const playExcerpt = () => {
        if (!playing) {
            setPlaying(true);
            if (!window.AudioContext) {
                if (!window.webkitAudioContext) {
                    alert("Your browser cannot play this excerpt because it does not support any AudioContext.");
                    return;
                }
                window.AudioContext = window.webkitAudioContext;
            }
            let context = new AudioContext();
            let source = context.createBufferSource();
            source.onended = () => {
                setPlaying(false);
                console.log("DONE PLAYING!");
            };
            let buffer = context.createBuffer(1,
                audioContext.excerptDuration * audioContext.sampleRate, audioContext.sampleRate); // TODO: keep excerptDuration and sampleRate as global variables via initial API call
            const bufferData = props.givenBufferData != null ? props.givenBufferData : fetchedBufferData;
            buffer.copyToChannel(new Float32Array(bufferData), 0);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        }
    };

    const copyID = () => {
        const dummyTextArea = document.createElement("textarea");
        document.body.appendChild(dummyTextArea);
        dummyTextArea.value = props.match.params.id;
        dummyTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(dummyTextArea);
    };

    useEffect(() => {
        async function getExcerpt() {
            try {
                const response = await axios.post('/specificExcerpt', {
                    id: props.match.params.id
                });
                const data = await response.data;
                setFetchedBufferData(data.excerptData);
                setLoading(false);
            } catch (error) { // TODO: handle bad request in view
                console.log("ERROR: " + error);
            }
        }
        if (props.givenBufferData == null) {
            setLoading(true);
            getExcerpt();
        }
    }, []); // TODO: ensure this only runs once

    return (
        <div className='excerpt'>
            {loading ? <LoadScreen /> : [
                <h1>Excerpt {abbreviateExcerptID(5)}</h1>,
                <Button text='Play Excerpt' callback={() => playExcerpt()} />,
                <Button text='Copy Excerpt ID' callback={() => copyID()} />
            ]}
        </div>
    );
}

export default Excerpt;
