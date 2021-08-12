import React from "react"
import {
    BUTTON, BUTTON_ORANGE,
    BUTTON_PURPLE_BORDER,
    BUTTON_YELLOW,
    CARD_CONTAINER,
    INPROGRESS,
    GAME_MENU,
    ROUTE_GAME, HELP_CONTAINER, SLIDE_DOWN, SLIDE_UP, CARD_CONTAINER_CONTAINER
} from "../helper/common"
import "../css/Home.css"
import ErrorBoundary from "./ErrorBoundary"
import GameOptions from "./GameOptions"
import HelpText from "./HelpText"

export default class Home extends React.Component {

    state = {
        inProgress: false,
        optionsVisible: false,
        helpVisible: false
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

    toggleHelp = () => {
        this.setState((prevState) => {
            return {helpVisible: !prevState.helpVisible}
        })
    }

    componentDidMount() {
        this.checkForOlderGame()
    }

    render() {
        return (
            <div className={CARD_CONTAINER_CONTAINER + " " + GAME_MENU}>
                <article className={CARD_CONTAINER + " " + GAME_MENU}>
                    <ErrorBoundary>
                        <ul>
                            {this.state.inProgress && <li>
                                <button className={BUTTON + " " + GAME_MENU
                                                   + " " + BUTTON_YELLOW
                                                   + " " + BUTTON_PURPLE_BORDER}
                                        onClick={this.playGame}>Resume Game
                                </button>
                            </li>}
                            <li>
                                <button className={BUTTON + " " + GAME_MENU
                                                   + " " + BUTTON_YELLOW
                                                   + " " + BUTTON_PURPLE_BORDER}
                                        onClick={this.startNewGame}>New Game
                                </button>
                            </li>
                            <li>
                                <button className={BUTTON + " " + GAME_MENU
                                                   + " " + BUTTON_YELLOW
                                                   + " " + BUTTON_PURPLE_BORDER
                                                   + " " + (this.state.helpVisible && BUTTON_ORANGE)}
                                        onClick={this.toggleHelp}>{(this.state.helpVisible && "Hide ")}How To Play
                                </button>
                            </li>
                            <article className={HELP_CONTAINER + " "
                                                + (this.state.helpVisible
                                                   ? SLIDE_DOWN
                                                   : SLIDE_UP)}>
                                <HelpText/>
                            </article>
                            <li>
                                <button className={BUTTON + " " + GAME_MENU
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
                    </ErrorBoundary>
                </article>
            </div>
        )
    }
}
