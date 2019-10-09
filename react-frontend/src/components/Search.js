import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

function Search() {

    const [queryReady, setQueryReady] = useState(false);
    const [micQuery, setMicQuery] = useState([]);
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);
    const audioSettingsContext = useContext(AudioSettingsContext);

    useEffect(() => {
        async function search() {
            const response = await axios.post('/searchByMic', { searchQuery: micQuery });
            const data = await response.data;
            setID(data.excerptID);
            setBufferData(data.excerptData);
            setLoading(false);
        }
        if (queryReady) search();
    }, [micQuery]);

    /**
     * Convert the given audio buffer to the application's universal sample rate, provided by AudioSettingsContext.
     * @param {Float32Array} buffer - the audio buffer to be downsampled
     * @param {number} inputRate - the original sample rate of the given audio buffer
     */
    function downsample(buffer, inputRate) {
        let downsampledBuffer = [];
        let outputRate = audioSettingsContext.sampleRate;
        if (inputRate > outputRate) {
            const sampleRatio = inputRate / outputRate;
            for (let i = 0; i < buffer.length; i += sampleRatio) {
                downsampledBuffer.push(buffer[Math.round(i)]) // TODO: determine audio quality hit of avoiding interpolation computation time
            }
        } else {
            // TODO: notify user about unsupported sample rate
        }
        return downsampledBuffer;
    }

    const record = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true}); // TODO: handle denial of microphone permission
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(1024, 1, 1);
        source.connect(processor);
        processor.connect(context.destination);
        let micBuffer = [];

        processor.onaudioprocess = function(e) { // TODO: update this deprecated script processor method to AudioWorklet
            const unformattedBuffer = e.inputBuffer.getChannelData(0); // TODO: handle more than one channel input
            micBuffer = micBuffer.concat(downsample(unformattedBuffer, e.inputBuffer.sampleRate));
            if (micBuffer.length >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
                processor.disconnect();
                setLoading(true);
                setQueryReady(true);
                setMicQuery(micBuffer);
            }
        };
    };

    return (
        <div className={'search'}>
            {loading ? <LoadScreen /> : queryReady ? <Excerpt id={id} bufferData={bufferData}/> :
                [<h2>Record any {audioSettingsContext.excerptDuration}-second sound to locate its corresponding excerpt:</h2>,
                <Button text='Start Recording' callback={() => record()} />]
            }
        </div>
    );
}

export default Search;
