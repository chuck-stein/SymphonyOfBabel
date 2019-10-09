import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

function Search() {

    const [queryReady, setQueryReady] = useState(false);
    const [searchQuery, setSearchQuery] = useState(new Blob()); // TODO: is an empty blob an ok default?
    const [micQuery, setMicQuery] = useState([]);
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);
    const audioSettingsContext = useContext(AudioSettingsContext);

    // useEffect(() => { // TODO: delete (or save somewhere for audio upload)
    //     async function search() {
    //         const searchQueryData = new FormData();
    //         searchQueryData.append('searchQuery', searchQuery, 'search-query.wav');
    //         const config = {
    //             headers: { 'content-type': 'multipart/form-data' }
    //         };
    //         const response = await axios.post('/searchQuery', searchQueryData, config);
    //         const data = await response.data;
    //         setID(data.excerptID);
    //         setBufferData(data.excerptData);
    //     }
    //     if (queryReady) search();
    // }, [searchQuery]);

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

    const record_OLD= () => {
        // TODO: for mobile, use: <input type="file" accept="audio/*" capture>

        // TODO: use Recorder.js

        async function getMicData() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder = new MediaRecorder(stream);
            const wavSupported = MediaRecorder.isTypeSupported("audio/wav;codecs=MS_PCM"); //TODO: just put this in if statement
            // if (wavSupported) { //TODO: delete if unnecessary
                const micData = [];
                mediaRecorder.start();
                mediaRecorder.addEventListener("dataavailable", async (event) => {
                    // const micDataArrayBuffer = await event.data.arrayBuffer(); //TODO: delete if unnecessary
                    // const micDataFloatArray = new Float32Array(micDataArrayBuffer, 2, 4);
                    // const micDataArray = Array.prototype.slice.call(micDataFloatArray);
                    // micData.push(micDataArray);
                    // console.log("MIC ARRAY: " + micData);
                    micData.push(event.data);
                });
                mediaRecorder.addEventListener("stop", () => {
                    setQueryReady(true);

                    setSearchQuery(new Blob(micData, { 'type' : 'audio/ogg; codecs=opus' }));//'audio/wav; codecs=MS_PCM' })); // TODO: should this be codecs=0?
                    // IF THIS LINE CANT CONVERT TO WAV, TRY: //TODO: delete if unnecessary
                    // this.mediaRecorder.ondataavailable = (e) => {
                    //     const blobDataInWebaFormat = e.data; // .weba = webaudio; subset of webm
                    //     const blobDataInWavFormat: Blob = new Blob([blobDataInWebaFormat], { type : 'audio/wav; codecs=0' });
                    //     const dataUrl = URL.createObjectURL(blobDataInWavFormat);
                    //     console.log(dataUrl); // There you can listen to your recording in a wav format
                    // });


                  // const audioUrl = URL.createObjectURL(audioBlob); //TODO: delete if unnecessary
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                    // const audioBlob = new Blob(micData, { 'type' : 'audio/wav; codecs=MS_PCM' }); //TODO: delete if unnecessary
                    // console.log(micData);
                }, audioSettingsContext.excerptDuration * 1000);
            // }
        }
        getMicData();
    };

    /**
     * Convert the given audio buffer to the application's universal sample rate, provided by AudioSettingsContext.
     * @param {Float32Array} buffer - the audio buffer to be downsampled
     * @param {number} inputRate - the original sample rate of the given audio buffer
     */
    function downsample(buffer, inputRate) {
        let downsampledBuffer = [];
        let outputRate = audioSettingsContext.sampleRate;
        // if (outputRate * 2 == inputRate) { // TODO: determine whether this warning is relevant
        //     for (let i = 0; i < buffer.length; i += 2) {
        //         downsampledBuffer.push(buffer[i]);
        //     }
        // }
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
        const processor = context.createScriptProcessor(1024, 1, 1); // TODO: determine best buffer size
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

        // setTimeout(() => {
        //     processor.disconnect(); // TODO: disconnect more nodes? Is there a better way to stop recording?
        //     setQueryReady(true);
        //     setMicQuery(micBuffer);
        // }, audioSettingsContext.excerptDuration * 1000);
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
