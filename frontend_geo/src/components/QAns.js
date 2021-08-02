import React from "react"
import {Q_ANS} from "../helper/common"

export default class QAns extends React.Component {

    state = {
        randomized: false,
        clues: []
    }

    randomizeQAns = () => {
        let clues = this.props.getQAns()
        if(!clues) {
            console.error("Clues are empty or null")
            return
        }
        console.log("Before: " + clues)
        for(let i = clues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clues[i], clues[j]] = [clues[j], clues[i]]
        }
        console.log("After: " + clues)
        this.setState({randomized: true, clues})
    }

    renderQAns = () => {
        if(this.state.clues.length < 3) {
            return <div/>
        }
        return (
            <ul>{
                this.state.clues.slice(0, 3).map(element => <li key={element}>{element}</li>)
            }</ul>
        )
    }

    componentDidMount() {
        this.randomizeQAns()
    }

    render() {
        return (
            <article className={Q_ANS}>
                {this.state.randomized ?
                 <div>{this.renderQAns()}</div>
                                       : <div>
                     Initializing QAns...
                 </div>
                }
            </article>
        )
    }
}
