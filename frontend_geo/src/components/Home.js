import React from "react"
import {
    BUTTON, BUTTON_PURPLE_BORDER,
    BUTTON_YELLOW, CARD_CONTAINER, INPROGRESS,
    NEW_GAME, ROUTE_GAME
} from "../helper/common"
import "../css/Home.css"

export default class Home extends React.Component {

    state = {
        inProgress: false
    }

    checkForOlderGame = async() => {
        let inProgress = localStorage.getItem(INPROGRESS)
        if(inProgress === null) {
            return
        }
        inProgress = JSON.parse(inProgress)
        if(typeof inProgress === "boolean") {
            await this.setState({inProgress})
        }
    }

    startNewGame = () => {
        this.props.clearAllLocalStorage()
        this.playGame()
    }

    playGame = () => {
        window.location.href = ROUTE_GAME
    }

    componentDidMount() {
        this.checkForOlderGame()
    }

    render() {
        return (
            <article className={CARD_CONTAINER + " " + NEW_GAME}>
                {this.state.inProgress && <ul>
                    <button className={BUTTON + " " + NEW_GAME
                                       + " " + BUTTON_YELLOW
                                       + " " + BUTTON_PURPLE_BORDER}
                            onClick={this.playGame}>Resume Game
                    </button>
                </ul>}
                <ul>
                    <button className={BUTTON + " " + NEW_GAME
                                       + " " + BUTTON_YELLOW
                                       + " " + BUTTON_PURPLE_BORDER}
                            onClick={this.startNewGame}>New Game
                    </button>
                </ul>
                <ul>
                    <button className={BUTTON + " " + NEW_GAME
                                       + " " + BUTTON_YELLOW
                                       + " " + BUTTON_PURPLE_BORDER}>Options
                    </button>
                </ul>
            </article>
        )
    }
}
