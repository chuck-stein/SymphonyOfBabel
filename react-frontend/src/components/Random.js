import React, {useEffect, useState} from 'react';
import axios from "axios";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

const Random = () => {

    const [loading, setLoading] = useState(true);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        const getRandomExcerpt = async () => {
            const response = await axios.get('/randomExcerpt');
            const data = await response.data;
            console.log(data);
            setID(data.excerptID);
            setBufferData(data.excerptData);
            setLoading(false);
        };
        getRandomExcerpt();
    }, []);

    return (
        <div>
            {loading ? <LoadScreen /> : <Excerpt id={id} bufferData={bufferData}/>}
        </div>
    );
};

export default Random;
