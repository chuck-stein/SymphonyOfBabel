import React, { Component } from 'react';

class Excerpt extends Component {

    // TODO: this should be in props, not state
    state = {
        id: 0, // TODO: once movement/section/measure/excerpt structure is implemented, id should be a string (e.g. '5v120ui5p')
        headerText: 'Excerpt ' + this.abbreviateExcerptID(5)
    };

    render() {
        return (
            <div>
                <h1>{'Excerpt ' + this.abbreviateExcerptID(5)}</h1>
            </div>
        );
    }

    /**
     * Get a string abbreviating this excerpt's ID, using its first {@param numChars} digits, followed by an ellipsis,
     * followed by its last {@param numChars} digits.
     * @param {number} numChars - The number of characters to which the beginning and end of the ID will be abbreviated
     * @returns {string} - The abbreviated ID, as a string
     */
    abbreviateExcerptID(numChars) {
        let abbreviation = '';
        let idAsString = String(this.props.id); // TODO: should there be protection if props has no id?
        if (idAsString.length <= numChars * 2) {
            return idAsString;
        }
        for (i = 0; i < numChars; i++) {
            abbreviation += idAsString.charAt(i);
        }
        abbreviation += '...';
        for (i = 0; i < numChars; i++) {
            abbreviation += idAsString.charAt(idAsString.length - numChars + i);
        }
        return abbreviation;
    }
}

export default Excerpt;
