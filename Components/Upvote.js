import React from 'react';
// Upvote/Downvote referenced from StackOverflow
class Upvote extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            count: 0,
            addend: 0 // either 1, 0, or -1
        }
    }

    toggleIncrement = () => {
        this.setState(prevState => ({
            addend: prevState.addend === 1 ? 0 : 1
        }))
    }

    toggleDecrement = () => {

        this.setState(prevState => ({
            addend: prevState.addend === -1 ? 0 : -1
        }))
    }

    render() {
        return (
            <div>
                <button onClick={this.toggleIncrement}>
                    +
                </button>
                <span>{this.state.count + this.state.addend}</span>
                <button onClick={this.toggleDecrement}>
                    -
                </button>
            </div>
        );
    }
}

export default Upvote;