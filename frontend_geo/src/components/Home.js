import React from "react"
import {
    BUTTON, BUTTON_ORANGE,
    BUTTON_PURPLE_BORDER,
    BUTTON_YELLOW,
    CARD_CONTAINER,
    INPROGRESS,
    NEW_GAME,
    ROUTE_GAME
} from "../helper/common"
import "../css/Home.css"
import GameOptions from "./GameOptions"

export default class Home extends React.Component {

    state = {
        inProgress: false,
        optionsVisible: false
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

    toggleOptions = () => {
        this.setState((prevState) => {
            return {optionsVisible: !prevState.optionsVisible}
        })
    }

    componentDidMount() {
        this.checkForOlderGame()
    }

    render() {
        return (
            <article className={CARD_CONTAINER + " " + NEW_GAME}>
                <ul>
                    {this.state.inProgress && <li>

                        <button className={BUTTON + " " + NEW_GAME
                                           + " " + BUTTON_YELLOW
                                           + " " + BUTTON_PURPLE_BORDER}
                                onClick={this.playGame}>Resume Game
                        </button>
                    </li>}
                    <li>
                        <button className={BUTTON + " " + NEW_GAME
                                           + " " + BUTTON_YELLOW
                                           + " " + BUTTON_PURPLE_BORDER}
                                onClick={this.startNewGame}>New Game
                        </button>
                    </li>
                    <li>
                        <button className={BUTTON + " " + NEW_GAME
                                           + " " + BUTTON_YELLOW
                                           + " " + BUTTON_PURPLE_BORDER
                                           + " " + (this.state.optionsVisible && BUTTON_ORANGE)}
                                onClick={this.toggleOptions}>{(this.state.optionsVisible && "Hide ")}Options
                        </button>
                    </li>
                    <GameOptions optionsVisible={this.state.optionsVisible}
                                 setGameLength={this.props.setGameLength}
                                 gameLength={this.props.gameLength}
                                 saveToLocalStorage={this.props.saveToLocalStorage}/>
                </ul>
            </article>
        )
    }
}
