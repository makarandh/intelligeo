import React from "react"
import {
    CARD_CONTAINER,
    CARD_CHOICES,
    CARD_CLUES,
    CARD_HERO_IMAGE,
    CARD_Q_ANS,
    CARD_TITLE,
    SUBSECTION,
    CARD_HEADING
} from "../helper/common"
import CardHero from "./CardHero"
import "../css/Card.css"

export default class Card extends React.Component {

    render() {
        return (
            <article className={CARD_CONTAINER}>
                <section className={CARD_HERO_IMAGE + " " + SUBSECTION}>
                    <CardHero/>
                </section>
                <section className={CARD_TITLE + " " + SUBSECTION}>
                    <div className={CARD_HEADING}>Guess The Country</div>
                </section>
                <section className={CARD_CLUES + " " + SUBSECTION}>
                    <div>Clues placeholder</div>
                </section>
                <section className={CARD_CHOICES + " " + SUBSECTION}>
                    <div>Multiple choice place holder</div>
                </section>
                <section className={CARD_Q_ANS + " " + SUBSECTION}>
                    <div>Questions answers placeholder</div>
                </section>
            </article>
        )
    }
}
