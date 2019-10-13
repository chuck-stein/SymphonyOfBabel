import React, {useState, useEffect} from 'react';
import LoadScreen from './LoadScreen';
import Excerpt from './Excerpt';

const ExcerptFetch = (props) => {

    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [failMessage, setFailMessage] = useState('Failed to retrieve excerpt info -- unknown error.');
    const [id, setID] = useState('');
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        const getExcerptInfo = async () => {
            try {
                const data = await props.apiCall();
                setBufferData(data.excerptData);
                setID(data.excerptID);
                setLoading(false);
            } catch(err) {
                setFailMessage('Failed to retrieve excerpt info -- ' + err.toString());
                setFailed(true);
            }
        };
        getExcerptInfo();
    }, [props, failed, failMessage]);

    return (
        <div>
            {failed ? <h1>{failMessage}</h1> :
                loading ? <LoadScreen/> : <Excerpt id={id} bufferData={bufferData}/>
            }
        </div>
    );
};

export default ExcerptFetch;
