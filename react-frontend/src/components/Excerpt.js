import React, { Component } from 'react';

class Excerpt extends Component {

    state = {
        loading: true,
        id: -1,
        bufferData: []
    };

    async componentDidMount() {
        const response = await fetch('/excerpt');
        const data = await response.json();
        this.setState({
            loading: false,
            id: data.excerptID,
            bufferData: data.excerptData
        });
    }

    render() {
        return (
            <div>
                <h1>
                    {this.state.loading ? 'loading excerpt...'
                    : 'Excerpt ' + this.abbreviateExcerptID(5)}
                </h1>
                <button type='button' onClick={this.playExcerpt}>Play Excerpt</button>
            </div>
        );
    }

    playExcerpt = (event) => {
        if (this.state.loading) {
            return;
        }
        console.log("buffer data type: " + typeof this.state.bufferData);
        console.log("buffer data element type: " + typeof this.state.bufferData[0]);
        console.log("Buffer data: " + this.state.bufferData);
        if (!window.AudioContext) {
            if (!window.webkitAudioContext) {
                alert("Your browser cannot play this excerpt because it does not support any AudioContext.");
                return;
            }
            window.AudioContext = window.webkitAudioContext;
        }
        let context = new AudioContext();
        let source = context.createBufferSource();
        let buffer = context.createBuffer(1, window.excerptSize, window.sampleRate);
        buffer.copyToChannel(new Float32Array(this.state.bufferData), 0);
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        console.log("Excerpt should be playing...");
    };

    /**
     * Get a string abbreviating this excerpt's ID, using its first {@param numChars} characters, followed by an ellipsis,
     * followed by its last {@param numChars} characters.
     * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
     * @returns {string} - The abbreviated ID, as a string
     */
    abbreviateExcerptID(numChars) {
        let abbreviation = '';
        if (this.state.id.length <= numChars * 2) {
            return this.state.id;
        }
        for (let i = 0; i < numChars; i++) {
            abbreviation += this.state.id.charAt(i);
        }
        abbreviation += '...';
        for (let i = 0; i < numChars; i++) {
            abbreviation += this.state.id.charAt(this.state.id.length - numChars + i);
        }
        return abbreviation;
    }
}

export default Excerpt;
