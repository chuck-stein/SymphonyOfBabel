import React, {useState, useEffect} from 'react';
import axios from "axios";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

const ExcerptFetch = (props) => {

    const [loading, setLoading] = useState(true);
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        async function getExcerpt() {
            try {
                const response = await axios.post('/specificExcerpt', {
                    id: props.match.params.id
                });
                const data = await response.data;
                setBufferData(data.excerptData);
                setLoading(false);
            } catch (error) { // TODO: handle bad request in view
                console.log("ERROR: " + error);
            }

        }
        getExcerpt();
    }, []);

    return (
        <div>
            {loading ? <LoadScreen /> : <Excerpt id={props.match.params.id} bufferData={bufferData}/>}
        </div>
    );
};

export default ExcerptFetch;
