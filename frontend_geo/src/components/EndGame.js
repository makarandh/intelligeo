import React from "react"
import {
    CARD_CONTAINER, ENDGAME
} from "../helper/common"
import "../css/EndGame.css"


export default class EndGame extends React.Component {
    render() {
        return (
            <section className={CARD_CONTAINER + " " + ENDGAME}>
                Your game has ended
            </section>
        )
    }
}
