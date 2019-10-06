import React, {useEffect, useState} from 'react';
import axios from "axios";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

function Random() {

    const [loading, setLoading] = useState(true);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);

    useEffect(async () => {
        console.log("fetching random excerpt...");
        const response = await axios.get('/random');
        const data = await response.data;
        console.log("response data: " + data);
        setID(data.excerptID);
        setBufferData(data.excerptData);
        setLoading(false);
    }, []);

    return (
        <div>
            {loading ? <LoadScreen /> : <Excerpt id={id} bufferData={bufferData}/>}
        </div>
    );
}

export default Random;
