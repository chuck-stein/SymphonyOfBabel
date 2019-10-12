import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

const Search = () => {

    const [queryReady, setQueryReady] = useState(false);
    const [micQuery, setMicQuery] = useState([]);
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);
    const audioSettingsContext = useContext(AudioSettingsContext);

    useEffect(() => {
        const submitQuery = async () => {
            const response = await axios.post('/searchByMic', { searchQuery: micQuery });
            const data = await response.data;
            setID(data.excerptID);
            setBufferData(data.excerptData);
            setLoading(false);
        }
        if (queryReady) submitQuery();
    }, [micQuery, queryReady]);

    const record = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true}); // TODO: handle denial of microphone permission
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(context.destination);
        let buffers = [];
        let samplesGathered = 0;
        processor.onaudioprocess = (e) => { // TODO: update this deprecated script processor method to AudioWorklet
            const downsampleContext = new OfflineAudioContext(
                e.inputBuffer.numberOfChannels,
                e.inputBuffer.duration * audioSettingsContext.sampleRate,
                audioSettingsContext.sampleRate
            );
            const bufferSource = new AudioBufferSourceNode(downsampleContext, {
                buffer: e.inputBuffer
            });
            bufferSource.start(0);
            bufferSource.connect(downsampleContext.destination);
            downsampleContext.startRendering().then((downsampledBuffer) => {
                const bufferData = downsampledBuffer.getChannelData(0);
                buffers.push(bufferData);
                samplesGathered += bufferData.length;
            });
            if (samplesGathered >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
                processor.disconnect();
                setLoading(true);
                let micData = [];
                for (let buffer of buffers) {
                    for (let sample of buffer) {
                        micData.push(sample);
                    }
                }
                setMicQuery(micData);
                setQueryReady(true);
            }
        };
    };

    return (
        <div>
            {loading ? <LoadScreen /> : queryReady ? <Excerpt id={id} bufferData={bufferData}/> :
                <div className={'search'}>
                    <h2>Record any {audioSettingsContext.excerptDuration}-second sound to locate its corresponding excerpt:</h2>
                    <Button text='Start Recording' callback={() => record()} />
                </div>
            }
        </div>

    );
}

export default Search;
