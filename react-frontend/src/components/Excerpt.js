import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';

function Excerpt(props) {

    return (
        <div className='excerpt'>
            <h1>Excerpt {abbreviateExcerptID(props.id,5)}</h1>
            <button type='button' onClick={() => playExcerpt(props.bufferData)}>Play Excerpt</button>
            <button type='button' onClick={() => copyID(props.id)}>Copy Excerpt ID</button>
        </div>
    );
}

const playExcerpt = (bufferData) => {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            alert("Your browser cannot play this excerpt because it does not support any AudioContext.");
            return;
        }
        window.AudioContext = window.webkitAudioContext;
    }
    let context = new AudioContext();
    let source = context.createBufferSource();
    let buffer = context.createBuffer(1, 5 * 24000, 24000); // TODO: keep excerptDuration and sampleRate as global variables via initial API call
    buffer.copyToChannel(new Float32Array(bufferData), 0);
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
};

const copyID = (id) => {
    const dummyTextArea = document.createElement("textarea");
    document.body.appendChild(dummyTextArea);
    dummyTextArea.value = id;
    dummyTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(dummyTextArea);
};

/**
 * Get a string abbreviating this excerpt's ID, using its first {@param numChars} characters, followed by an ellipsis,
 * followed by its last {@param numChars} characters.
 * @param {string} id - The excerpt ID
 * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
 * @returns {string} - The abbreviated ID, as a string
 */
const abbreviateExcerptID = (id, numChars) => {
    let abbreviation = '';
    if (id.length <= numChars * 2) {
        return id;
    }
    for (let i = 0; i < numChars; i++) {
        abbreviation += id.charAt(i);
    }
    abbreviation += '...';
    for (let i = 0; i < numChars; i++) {
        abbreviation += id.charAt(id.length - numChars + i);
    }
    return abbreviation;
};








// class Excerpt extends Component {
//
//     static defaultProps = {
//         random: false,
//         id: null
//     };
//
//     state = {
//         loading: true,
//         id: this.props.id,
//         bufferData: []
//     };
//
//     async componentDidMount() {
//         if (this.props.random) {
//             console.log("fetching random excerpt...");
//             // const response = await fetch('/random', { method: 'GET' });
//             const response = await axios.get('/random');
//             const data = await response.data;
//             console.log("response data: " + data);
//             this.setState({
//                 loading: false,
//                 id: data.excerptID,
//                 bufferData: data.excerptData
//             });
//         } else if (this.props.id) {
//             console.log("fetching audio buffer...");
//             // const response = await fetch('/excerpt', {
//             //     method: 'GET',
//             //     headers: { 'Content-Type':  'application/json' },
//             //     body: JSON.stringify({id: this.props.id}) // TODO: pass in the ID property more explicitly?
//             // });
//             const response = await axios.get('/excerpt', {
//                 params: {
//                     id: this.props.id
//                 }
//             });
//             if (response.ok) {
//                 const data = await response.data;
//                 console.log("response data: " + data);
//                 this.setState({
//                    loading: false,
//                    bufferData: data.excerptData
//                 });
//             } else {
//                 console.log("BAD REQUEST - INVALID ID")
//             }
//         } else {
//             // TODO: ERROR!
//         }
//     }
//
//     render() {
//         return (
//             <div>
//                 <h1>
//                     {this.state.loading ? 'loading excerpt...'
//                     : 'Excerpt ' + this.abbreviateExcerptID(5)}
//                 </h1>
//                 <button type='button' onClick={this.playExcerpt}>Play Excerpt</button>
//                 <button type='button' onClick={this.copyID}>Copy Excerpt ID</button>
//             </div>
//         );
//     }
//
//     playExcerpt = (event) => {
//         if (this.state.loading) {
//             return;
//         }
//         if (!window.AudioContext) {
//             if (!window.webkitAudioContext) {
//                 alert("Your browser cannot play this excerpt because it does not support any AudioContext.");
//                 return;
//             }
//             window.AudioContext = window.webkitAudioContext;
//         }
//         let context = new AudioContext();
//         let source = context.createBufferSource();
//         let buffer = context.createBuffer(1, window.excerptSize, window.sampleRate);
//         buffer.copyToChannel(new Float32Array(this.state.bufferData), 0);
//         source.buffer = buffer;
//         source.connect(context.destination);
//         source.start(0);
//     };
//
//     copyID = (event) => {
//         if (this.state.loading) {
//             return;
//         }
//         const dummyTextArea = document.createElement("textarea");
//         document.body.appendChild(dummyTextArea);
//         dummyTextArea.value = this.state.id;
//         dummyTextArea.select();
//         document.execCommand("copy");
//         document.body.removeChild(dummyTextArea);
//     };
//
//     /**
//      * Get a string abbreviating this excerpt's ID, using its first {@param numChars} characters, followed by an ellipsis,
//      * followed by its last {@param numChars} characters.
//      * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
//      * @returns {string} - The abbreviated ID, as a string
//      */
//     abbreviateExcerptID(numChars) {
//         let abbreviation = '';
//         if (this.state.id.length <= numChars * 2) {
//             return this.state.id;
//         }
//         for (let i = 0; i < numChars; i++) {
//             abbreviation += this.state.id.charAt(i);
//         }
//         abbreviation += '...';
//         for (let i = 0; i < numChars; i++) {
//             abbreviation += this.state.id.charAt(this.state.id.length - numChars + i);
//         }
//         return abbreviation;
//     }
// }

export default Excerpt;
