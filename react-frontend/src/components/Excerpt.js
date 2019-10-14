import React, {useState, useEffect, useContext} from 'react';
import {Redirect} from 'react-router-dom';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";

const Excerpt = (props) => {

    const [playing, setPlaying] = useState(false);
    const [copying, setCopying] = useState(false);
    const [unknownExcerptInfo, setUnknownExcerptInfo] = useState(false);
    const audioSettingsContext = useContext(AudioSettingsContext);

    // If the user navigated here by entering a direct link, there is no ID or buffer data available, so redirect to homepage
    // TODO: implement direct links to excerpts, by somehow encoding ID to be short enough for AWS CloudFront URL
    useEffect(() => {
        if (props.location.state == null) {
            setUnknownExcerptInfo(true);
        }
    }, [props.location]);

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
            buffer.copyToChannel(new Float32Array(props.location.state.bufferData), 0);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            return () => {source.stop()};
        }
    }, [playing, props.location, audioSettingsContext]);

    useEffect(() => {
        if (copying) {
            const dummyTextArea = document.createElement("textarea");
            document.body.appendChild(dummyTextArea);
            dummyTextArea.value = props.location.state.id;
            dummyTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(dummyTextArea);
            setCopying(false);
        }
    }, [copying, props.location]);

    if (unknownExcerptInfo) {
        return <Redirect to='/' />; // Redirect to homepage because there is no excerpt to display
    }
    return (
        <div className='excerpt'>
            <h1>Excerpt {abbreviateExcerptID(props.location.state ? props.location.state.id : '', 5)}</h1>
            <Button text={playing ? 'Playing...' : 'Play Excerpt'} callback={() => setPlaying(true)} unusable={playing} />
            <Button text='Copy Excerpt ID' callback={() => setCopying(true)} unusable={copying} />
        </div>
    );
};

/**
 * Get a string abbreviating the given ID, using its first {@param numChars} characters, followed by an ellipsis,
 * followed by its last {@param numChars} characters.
 * @param {string} id - The excerpt ID to be abbreviated
 * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
 * @returns {string} - The abbreviated ID, as a string
 */
const abbreviateExcerptID = (id, numChars) => {
    let abbreviation = '';
    if (id <= numChars * 2) {
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

export default Excerpt;
