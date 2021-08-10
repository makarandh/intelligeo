import React from "react"
import {
    BUTTON, CARD_CONTAINER, ENDGAME_TEXT, ENDGAME,
    HEADING, CENTER_TEXT_CONTAINER,
    GREEN, PLAY_AGAIN, GO_HOME
} from "../helper/common"
import "../css/EndGame.css"


export default class EndGame extends React.Component {

    startNewGame = () => {
        this.props.resetGame(true)
    }

    goToNewGamePage = () => {
        this.props.resetGame(false)
    }

    componentDidMount() {
        this.props.clearAllLocalStorage()
    }

    render() {
        return (
            <section className={CARD_CONTAINER + " " + ENDGAME}>
                <h1 className={ENDGAME + " " + HEADING}>End Game Score</h1>
                <section className={ENDGAME_TEXT}>
                    <div>Thank you for playing!</div>
                    <div>Out of <span className={GREEN}>{this.props.gameLength} </span>
                        questions, you answered
                        <span className={GREEN}> {this.props.totalCorrect} </span> correctly.
                    </div>
                    <div>You scored a total of <span className={GREEN}>{this.props.totalScore}</span> points.</div>
                </section>
                <div className={CENTER_TEXT_CONTAINER}>
                    <button className={PLAY_AGAIN + " " + ENDGAME + " " + BUTTON}
                            onClick={this.startNewGame}>Play again
                    </button>
                    <button className={GO_HOME + " " + ENDGAME + " " + BUTTON}
                            onClick={this.goToNewGamePage}>Go Home
                    </button>
                </div>
            </section>
        )
    }
}
