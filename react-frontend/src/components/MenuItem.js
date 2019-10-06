import React, {Component} from 'react';

class MenuItem extends Component {
    render() {
        return (
            <div>
                <button type={'button'} onClick={this.props.clickHandler}>
                    {this.props.text}
                </button>
            </div>
        );
    }
}

export default MenuItem;
