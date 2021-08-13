import React from "react"
import {CLUES} from "../helper/common"
import "../css/Clues.css"

export default class Clues extends React.Component {

    state = {
        randomized: false,
        clues: []
    }

    randomizeClues = () => {
        let clues = this.props.getClues()
        if(!clues) {
            console.error("Clues are empty or null")
            return
        }
        for(let i = clues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clues[i], clues[j]] = [clues[j], clues[i]]
        }
        if(clues.length > 3) {
            clues = clues.slice(0, 9)
        }
        this.setState({randomized: true, clues})
    }

    renderClues = () => {
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
        this.randomizeClues()
    }

    render() {
        return (
            <article className={CLUES}>
                {this.state.randomized ?
                 <div>{this.renderClues()}</div>
                                       : <div>
                     Initializing clues...
                 </div>
                }
            </article>
        )
    }
}
