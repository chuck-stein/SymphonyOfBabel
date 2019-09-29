import React, { Component } from 'react';

class ExcerptHeader extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.text}</h1>
            </div>
        );
    }
}

export default ExcerptHeader;
