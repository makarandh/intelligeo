import React from "react"
import {
    BUTTON,
    CARD_CONTAINER, ENDGAME
} from "../helper/common"
import "../css/EndGame.css"


export default class EndGame extends React.Component {
    render() {
        return (
            <section className={CARD_CONTAINER + " " + ENDGAME}>
                <div>Your game has ended</div>
                <button className={BUTTON}
                        onClick={this.props.resetGame}>Play again
                </button>
            </section>
        )
    }
}
