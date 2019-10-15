import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import LoadScreen from './LoadScreen';

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
    }, []);

    if (failed) {
        return <h1>{failMessage}</h1>;
    }
    return loading ? <LoadScreen /> : <Redirect to={{
        pathname: '/excerpt',
        state: {
            id: id,
            bufferData: bufferData
        }
    }} />;
};

export default ExcerptFetch;
