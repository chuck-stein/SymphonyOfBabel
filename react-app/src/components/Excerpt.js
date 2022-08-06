import React, {useState, useEffect, useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";

// The Excerpt component displays an audio excerpt with the ability to play it.
const Excerpt = (props) => {

    // Whether the audio excerpt is currently being played
    const [playing, setPlaying] = useState(false);
    // Whether the audio excerpt is currently being copied
    const [copying, setCopying] = useState(false);
    // Whether this Excerpt component was not created with audio data and an ID, so it cannot represent an audio excerpt
    const [unknownExcerptInfo, setUnknownExcerptInfo] = useState(false);
    // The settings for audio excerpts (duration and sample rate)
    const audioSettingsContext = useContext(AudioSettingsContext);

    const location = useLocation()

    // If the user navigated here by entering a direct link, there is no ID or buffer data available, so redirect to homepage
    // TODO: implement direct links to excerpts, by somehow encoding ID to be short enough for AWS CloudFront URL
    useEffect(() => {
        if (location.state == null) {
            setUnknownExcerptInfo(true);
        }
    }, [location]);

    // Play this audio excerpt
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
            buffer.copyToChannel(new Float32Array(location.state.bufferData), 0);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            return () => {source.stop()}; // cleanup for when component dismounts, potentially while playing
        }
    }, [playing, location, audioSettingsContext]);

    // Copy this audio excerpt ID
    useEffect(() => {
        if (copying) {
            const dummyTextArea = document.createElement("textarea");
            document.body.appendChild(dummyTextArea);
            dummyTextArea.value = location.state.id;
            dummyTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(dummyTextArea);
            setCopying(false);
        }
    }, [copying, location]);

    if (unknownExcerptInfo) {
        return <Navigate to='/' />; // Redirect to homepage because there is no excerpt to display
    }
    return (
        <div className='excerpt'>
            <h1>Symphony Excerpt</h1>
            <Button text={playing ? 'Playing...' : 'Play Excerpt'} callback={() => setPlaying(true)} unusable={playing} />
            <Button text='Copy Excerpt ID' callback={() => setCopying(true)} unusable={copying} />
        </div>
    );
};

export default Excerpt;
