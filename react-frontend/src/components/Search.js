import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "./Button";
import AudioSettingsContext from "../AudioSettingsContext";

function Search() {

    const [searchQuery, setSearchQuery] = useState(new Blob()); // TODO: is an empty blob an ok default?
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);
    const audioContext = useContext(AudioSettingsContext);

    useEffect(() => {
        async function search() {
            const searchQueryData = new FormData();
            searchQueryData.append('searchQuery', searchQuery, 'search-query.wav');
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            const response = await axios.post('/searchQuery', searchQueryData, config);
            const data = await response.data;
            setID(data.excerptID);
            setBufferData(data.excerptData);
        }
        search();
    }, [searchQuery]);

    const record= () => {
        // TODO: for mobile, use: <input type="file" accept="audio/*" capture>

        // TODO: use Recorder.js

        async function getMicData() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder = new MediaRecorder(stream);
            if (mediaRecorder.isTypeSupported("audio/wav;codecs=MS_PCM")) { //TODO: delete if unnecessary
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
                  setSearchQuery(new Blob(micData, { 'type' : 'audio/wav; codecs=MS_PCM' }));
                  // const audioUrl = URL.createObjectURL(audioBlob); //TODO: delete if unnecessary
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                    // const audioBlob = new Blob(micData, { 'type' : 'audio/wav; codecs=MS_PCM' }); //TODO: delete if unnecessary
                    // console.log(micData);
                }, audioContext.excerptDuration * 1000);
            }
        }
        getMicData();
    };

    return (
        <div className={'search'}>
            <h2>Record any 5-second sound to locate its corresponding excerpt:</h2>
            <Button text='Start Recording' callback={() => record()} />
        </div>
    );
}

export default Search;
