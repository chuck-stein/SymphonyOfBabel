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
            <h1>Symphony Excerpt</h1>
            <Button text={playing ? 'Playing...' : 'Play Excerpt'} callback={() => setPlaying(true)} unusable={playing} />
            <Button text='Copy Excerpt ID' callback={() => setCopying(true)} unusable={copying} />
        </div>
    );
};

export default Excerpt;
