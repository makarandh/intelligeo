import React from "react"
import {CARD, CARD_CHOICES, CARD_CLUES, CARD_HERO_IMAGE, CARD_Q_ANS, CARD_TITLE, SUBSECTION} from "../helper/common"
import CardHero from "./CardHero"


export default class Card extends React.Component {

    render() {
        return (
            <article className={CARD}>
                <section className={CARD_HERO_IMAGE + " " + SUBSECTION}>
                    <CardHero/>
                </section>
                <section className={CARD_TITLE + " " + SUBSECTION}>
                    <div>Guess The Country</div>
                </section>
                <section className={CARD_CLUES + " " + SUBSECTION}>
                    <div>Clues placeholder</div>
                </section>
                <section className={CARD_CHOICES + " " + SUBSECTION}>
                    <div>Mulitple choice place holder</div>
                </section>
                <section className={CARD_Q_ANS + " " + SUBSECTION}>
                    <div>Questions answers placeholder</div>
                </section>
            </article>
        )
    }
}
