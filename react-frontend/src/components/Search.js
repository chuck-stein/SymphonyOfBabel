import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AudioSettingsContext from "../AudioSettingsContext";
import Button from "./Button";
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

    // /**
    //  * Convert the given audio buffer to the application's universal sample rate, provided by AudioSettingsContext.
    //  * @param {Array} buffer - the audio buffer to be downsampled
    //  * @param {number} inputRate - the original sample rate of the given audio buffer
    //  */
    // function downsample(buffer, inputRate) {
    //     let downsampledBuffer = [];
    //     // for (let i = 0; i < 512; i++) { // TODO: delete
    //     //     downsampledBuffer.push(1);
    //     // }
    //     let outputRate = audioSettingsContext.sampleRate;
    //     if (inputRate > outputRate) {
    //         const sampleRatio = inputRate / outputRate;
    //         for (let i = 0; i < buffer.length; i += sampleRatio) {
    //             downsampledBuffer.push(buffer[Math.round(i)]) // TODO: determine audio quality hit of avoiding interpolation computation time
    //         }
    //     } else {
    //         // TODO: notify user about unsupported sample rate
    //     }
    //     return downsampledBuffer;
    // }


    const record = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true}); // TODO: handle denial of microphone permission
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(context.destination);

        // let micData = [];
        let buffers = [];
        let inputSampleRate = 0;
        let elapsedTime = 0;

        let bufferCount = 0;
        let counter = 0;

        let samplesGathered = 0;



        processor.onaudioprocess = function(e) { // TODO: update this deprecated script processor method to AudioWorklet

            // micBuffer = micBuffer.concat(downsample(unformattedBuffer, e.inputBuffer.sampleRate));

            const downsampleContext = new OfflineAudioContext( // TODO: why is this offline?
                e.inputBuffer.numberOfChannels,
                e.inputBuffer.duration * audioSettingsContext.sampleRate,
                audioSettingsContext.sampleRate
            );
            const bufferSource = new AudioBufferSourceNode(downsampleContext, { // TODO: is "context" the right AudioContext?
                buffer: e.inputBuffer
            });
            bufferSource.start(0);
            bufferSource.connect(downsampleContext.destination);

            downsampleContext.oncomplete = () => {

            };
            downsampleContext.startRendering().then((downsampledBuffer) => {
                // elapsedTime += downsampledBuffer.duration;
                const bufferData = downsampledBuffer.getChannelData(0);
                buffers.push(bufferData);
                samplesGathered += bufferData.length;
            });


            // if (inputSampleRate === 0) {
            //     inputSampleRate = e.inputBuffer.sampleRate;
            // }
            // const buffer = e.inputBuffer.getChannelData(0); // TODO: handle more than one channel input
            // // micData = micData.concat(Array.from(buffer));
            // // buffers = lodashConcat(buffers, buffer);
            // buffers.push(buffer);
            //
            //
            //
            // counter += 512;
            // bufferCount++;
            // console.log(bufferCount);
            // console.log(e.inputBuffer);

            // elapsedTime += e.inputBuffer.duration;

            // if (micBuffer.length >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
            // if (elapsedTime >= audioSettingsContext.excerptDuration) {
            if (samplesGathered >= audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration) {
                processor.disconnect();
                setLoading(true);
                let micData = [];
                for (let buffer of buffers) {
                    // micData = micData.concat(Array.from(buffer));
                    for (let sample of buffer) {
                        micData.push(sample);
                    }
                }
                setQueryReady(true);
                console.log("MIC DATA IS " + micData.length + " SAMPLES LONG")
                setMicQuery(micData);
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
