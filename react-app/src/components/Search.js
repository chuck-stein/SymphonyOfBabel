import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
import ExcerptFetch from "./ExcerptFetch";

// The Search component is where users can record audio and find the corresponding excerpt from the "Symphony".
const Search = () => {

    // Whether the user is currently recording audio
    const [recording, setRecording] = useState(false);
    // Whether the user has successfully recorded their search query
    const [queryReady, setQueryReady] = useState(false);
    // The microphone data (audio samples) representing the user's search query
    const [micQuery, setMicQuery] = useState([]);
    // The settings for audio excerpts (duration and sample rate)
    const audioSettingsContext = useContext(AudioSettingsContext);

    // Record a search query
    useEffect(() => {

        /**
         * Downsample the given audio buffer to the same sample rate as audio excerpts.
         * @param {AudioBuffer} buffer - the recorded audio buffer ot be downsampled
         * @returns {Promise<Float32Array>} the audio data of the downsampled buffer
         */
        const downsample = async (buffer) => {
            const downsampleContext = new OfflineAudioContext(buffer.numberOfChannels,
                buffer.duration * audioSettingsContext.sampleRate, audioSettingsContext.sampleRate);
            const bufferSource = new AudioBufferSourceNode(downsampleContext, { buffer: buffer });
            bufferSource.start(0);
            bufferSource.connect(downsampleContext.destination);
            const downsampledBuffer = await downsampleContext.startRendering();
            return downsampledBuffer.getChannelData(0);
        };

        /**
         * Record a search query from the user's microphone.
         */
        const record = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true}); // TODO: handle denial of microphone permission
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const processor = context.createScriptProcessor(4096, 1, 1);
            source.connect(processor);
            processor.connect(context.destination);
            let buffers = [];
            let samplesGathered = 0;

            // TODO: update this deprecated script processor method to AudioWorklet (although AudioWorklet is only
            //  confirmed to work on Chrome, so deprecated method may still be best for compatibility? Do more research.)
            processor.onaudioprocess = async (e) => {
                const downsampledBuffer = await downsample(e.inputBuffer);
                buffers.push(downsampledBuffer);
                samplesGathered += downsampledBuffer.length;
                if (samplesGathered >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
                    processor.disconnect();
                    stream.getTracks().forEach(track => track.stop());
                    let micData = [];
                    buffers.forEach(buffer =>
                        buffer.forEach(sample => micData.push(sample))
                    );
                    setRecording(false);
                    setMicQuery(micData);
                    setQueryReady(true);
                }
            };
            return () => {processor.disconnect()}; // cleanup for when component dismounts, potentially while recording
        };

        if (recording) record();

    }, [recording, queryReady, micQuery, audioSettingsContext]);

    /**
     * Make an HTTP request to get the audio excerpt corresponding with the recorded microphone data.
     * @returns {Promise<Object>} the response data of the request, containing the audio excerpt and its ID
     */
    const searchAPICall = async () => {
        const response = await axios.post('/searchByMic', { searchQuery: micQuery });
        return response.data;
    };

    if (queryReady) {
        return <ExcerptFetch apiCall={() => searchAPICall()} />;
    }
    return (
        <div className={'search'}>
            <h2>Record any {audioSettingsContext.excerptDuration}-second sound to locate its corresponding excerpt:</h2>
            <Button text={recording ? 'Recording...' : 'Start Recording'} callback={() => { if (!recording) setRecording(true) }} unusable={recording} />
        </div>
    );

};

export default Search;
