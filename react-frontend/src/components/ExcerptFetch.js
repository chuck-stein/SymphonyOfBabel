import React, {useState, useEffect} from 'react';
import LoadScreen from "./LoadScreen";
import Excerpt from "./Excerpt";

const ExcerptFetch = (props) => {

    const [loading, setLoading] = useState(true);
    const [id, setID] = useState("");
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        const getExcerptInfo = async () => {
            const data = await props.apiCall();
            setBufferData(data.excerptData);
            setID(data.excerptID);
            setLoading(false);
        };
        getExcerptInfo();
    }, [props]);

    return (
        <div>
            {loading ? <LoadScreen /> : <Excerpt id={id} bufferData={bufferData} />}
        </div>
    );
};

export default ExcerptFetch;
