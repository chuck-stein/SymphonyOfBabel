import React, {useState, useEffect} from 'react';
import axios from "axios";
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

const ExcerptFetch = (props) => {

    const [loading, setLoading] = useState(true);
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        async function getExcerpt() {
            console.log('requesting excerpt from id: ' + props.match.params.id);
            try {
                const response = await axios.post('/specificExcerpt', {
                    id: props.match.params.id
                });
                //     {
                //     maxContentLength: 50000
                // }); // TODO: delete config if not necessary
                const data = await response.data;
                console.log("response data: " + data);
                setBufferData(data.excerptData);
                setLoading(false);
                // TODO: handle bad request in view
            } catch (error) {
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
