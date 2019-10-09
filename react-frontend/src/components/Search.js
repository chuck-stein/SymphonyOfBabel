import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";

function Search() {

    const [queryReady, setQueryReady] = useState(false);
    const [searchQuery, setSearchQuery] = useState(new Blob()); // TODO: is an empty blob an ok default?
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);
    const audioContext = useContext(AudioSettingsContext);

    useEffect(() => {
        async function search() {
            const searchQueryData = new FormData();
            searchQueryData.append('searchquery', searchQuery, 'search-query.wav');
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            const response = await axios.post('/searchQuery', searchQueryData, config);
            const data = await response.data;
            setID(data.excerptID);
            setBufferData(data.excerptData);
        }
        if (queryReady) {
            search();
        }
    }, [searchQuery]);

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
                }, audioContext.excerptDuration * 1000);
            // }
        }
        getMicData();
    };

    const record = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(1024, 1, 1); // TODO: determine best buffer size
        source.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = function(e) {
          // Do something with the data, e.g. convert it to WAV
          console.log(e.inputBuffer);
        };
    };

    return (
        <div className={'search'}>
            <h2>Record any 5-second sound to locate its corresponding excerpt:</h2>
            <Button text='Start Recording' callback={() => record()} />
        </div>
    );
}

export default Search;
