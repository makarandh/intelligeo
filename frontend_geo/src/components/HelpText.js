import React from "react"
import {
    CHOICE_COUNT,
    FREE_ANS,
    HELP_HEADING,
    HELP_PARA,
    PENALTY_PER_ANS,
} from "../helper/common"


function HelpText() {
    return (
        <article>
            <div className={HELP_PARA}><span className={HELP_HEADING}>Objective of the game </span> is
                to score points by guessing the countries correctly in each card.
            </div>
            <div className={HELP_PARA}><span
                className={HELP_HEADING}>Choose the correct option</span> from a total
                of {CHOICE_COUNT} choices.
            </div>
            <div className={HELP_PARA}><span className={HELP_HEADING}>Three clues </span> are provided
                for each country.
            </div>
            <div className={HELP_PARA}><span className={HELP_HEADING}>Additional hints </span> in the
                form of questions and answers are provided. Click "View More Hints" to view them. You
                can view upto {FREE_ANS} answers to these hints for free. Viewing additional answers
                cost you {PENALTY_PER_ANS} points.
            </div>
        </article>
    )
}

export default HelpText
