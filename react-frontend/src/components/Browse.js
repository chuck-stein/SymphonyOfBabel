import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';

function Browse() {
    /*
    TODO: change browse so that it always has an ID, make the actual "browse" screen IdForm, which redirects to browse when it gets an IDdt
    */

    const [loading, setLoading] = useState(false);
    const [id, setID] = useState(-1);
    const [bufferData, setBufferData] = useState([]);

    useEffect(() => {
        async function getExcerpt() {
            const response = await axios.get('/excerpt', {
                params: {
                    id: this.props.id
                }
            });
            if (response.ok) {
                const data = await response.data;
                console.log("response data: " + data);
                // this.setState({
                //    loading: false,
                //    bufferData: data.excerptData
                // });
            } else {
                console.log("BAD REQUEST - INVALID ID")
                // TODO: handle bad request in view
            }
        }
        getExcerpt();
    }, [id]);

    return (
        <div>
            <textarea className='idField' rows='10' cols='50'>(
            </textarea>
            <button type='button' onClick={() => setID(document.getElementsByClassName('idField').value)}>
                Locate
            </button>
        </div>
    );
}

export default Browse;
