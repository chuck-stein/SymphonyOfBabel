import React, {useState, useEffect, useContext} from 'react';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";

const Excerpt = (props) => {

    const [playing, setPlaying] = useState(false);
    const audioSettingsContext = useContext(AudioSettingsContext);

    /**
     * Get a string abbreviating this excerpt's ID, using its first {@param numChars} characters, followed by an ellipsis,
     * followed by its last {@param numChars} characters.
     * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
     * @returns {string} - The abbreviated ID, as a string
     */
    const abbreviateExcerptID = (numChars) => {
        let abbreviation = '';
        if (props.id.length <= numChars * 2) {
            return props.id;
        }
        for (let i = 0; i < numChars; i++) {
            abbreviation += props.id.charAt(i);
        }
        abbreviation += '...';
        for (let i = 0; i < numChars; i++) {
            abbreviation += props.id.charAt(props.id.length - numChars + i);
        }
        return abbreviation;
    };

    useEffect(() => {
        if (playing) {
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
            };
            let buffer = context.createBuffer(1,
                audioSettingsContext.excerptDuration * audioSettingsContext.sampleRate, audioSettingsContext.sampleRate);
            buffer.copyToChannel(new Float32Array(props.bufferData), 0);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            return () => {source.stop()};
        }
    }, [playing, props.bufferData, audioSettingsContext]);

    const copyID = () => {
        const dummyTextArea = document.createElement("textarea");
        document.body.appendChild(dummyTextArea);
        dummyTextArea.value = props.id;
        dummyTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(dummyTextArea);
    };

    return (
        <div className='excerpt'>
            <h1>Excerpt {abbreviateExcerptID(5)}</h1>
            <Button text='Play Excerpt' callback={() => { if (!playing) setPlaying(true) }} unusable={playing} />
            <Button text='Copy Excerpt ID' callback={() => copyID()} />
        </div>
    );
};

export default Excerpt;
