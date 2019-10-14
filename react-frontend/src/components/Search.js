import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
import ExcerptFetch from "./ExcerptFetch";

const Search = () => {

    const [recording, setRecording] = useState(false);
    const [queryReady, setQueryReady] = useState(false);
    const [micQuery, setMicQuery] = useState([]);
    const audioSettingsContext = useContext(AudioSettingsContext);

    useEffect(() => {

        const downsample = async (buffer) => {
            const downsampleContext = new OfflineAudioContext(buffer.numberOfChannels,
                buffer.duration * audioSettingsContext.sampleRate, audioSettingsContext.sampleRate);
            const bufferSource = new AudioBufferSourceNode(downsampleContext, { buffer: buffer });
            bufferSource.start(0);
            bufferSource.connect(downsampleContext.destination);
            const downsampledBuffer = await downsampleContext.startRendering();
            return downsampledBuffer.getChannelData(0);
        };

        const record = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true}); // TODO: handle denial of microphone permission
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const processor = context.createScriptProcessor(4096, 1, 1);
            source.connect(processor);
            processor.connect(context.destination);
            let buffers = [];
            let samplesGathered = 0;
            processor.onaudioprocess = async (e) => { // TODO: update this deprecated script processor method to AudioWorklet (although AudioWorklet is only confirmed to work on Chrome, so deprecated method may still be best for compatibility
                const downsampledBuffer = await downsample(e.inputBuffer);
                buffers.push(downsampledBuffer);
                samplesGathered += downsampledBuffer.length;
                if (samplesGathered >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
                    processor.disconnect();
                    stream.getTracks().forEach(track => track.stop());
                    let micData = [];
                    for (const buffer of buffers) {
                        for (const sample of buffer) {
                            micData.push(sample);
                        }
                    }
                    setRecording(false);
                    setMicQuery(micData);
                    setQueryReady(true);
                }
            };
            return () => {processor.disconnect()};
        };

        if (recording) record();

    }, [recording, queryReady, micQuery, audioSettingsContext]);

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
