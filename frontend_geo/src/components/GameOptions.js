import React from "react"
import {
    BUTTON, GAMELENGTH,
    LONG_GAME_LENGTH, MEDIUM_GAME_LENGTH, OPTION, OPTION_CONTAINER,
    OPTION_GAME_LENGTH, OPTION_LONG,
    OPTION_MEDIUM, OPTION_SHORT,
    OPTIONS_CONTAINER, OPTIONS_SUBSECTION,
    SHORT_GAME_LENGTH, SLIDE_DOWN, SLIDE_UP, SUBHEADING, SUBSECTION
} from "../helper/common"
import "../css/GameOptions.css"

export default class GameOptions extends React.Component {

    handleRadioChange = async(e) => {
        const gameLength = parseInt(e.target.value)
        await this.props.setGameLength(gameLength)
        this.props.saveToLocalStorage(GAMELENGTH, gameLength)
    }

    render() {
        return (
            <section className={SUBSECTION
                                + " " + OPTIONS_SUBSECTION
                                + " " + (this.props.optionsVisible
                                         ? SLIDE_DOWN
                                         : SLIDE_UP)}>
                <h3 className={SUBHEADING}>Game length </h3>
                <div>(Only applicable to new games)</div>
                <div className={OPTIONS_CONTAINER}>
                    <fieldset onChange={this.handleRadioChange}>
                        <div>
                            <label className={OPTION_CONTAINER} htmlFor={OPTION_SHORT}>
                                <input type="radio"
                                       id={OPTION_SHORT}
                                       name={OPTION_GAME_LENGTH}
                                       checked={this.props.gameLength === SHORT_GAME_LENGTH}
                                       value={SHORT_GAME_LENGTH}/>
                                <div className={OPTION_SHORT
                                                + " " + OPTION
                                                + " " + BUTTON}>
                                    Short ({SHORT_GAME_LENGTH} cards)
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className={OPTION_CONTAINER} htmlFor={OPTION_MEDIUM}>
                                <input type="radio"
                                       id={OPTION_MEDIUM}
                                       name={OPTION_GAME_LENGTH}
                                       checked={this.props.gameLength === MEDIUM_GAME_LENGTH}
                                       value={MEDIUM_GAME_LENGTH}/>
                                <div className={OPTION_MEDIUM
                                                + " " + OPTION
                                                + " " + BUTTON}>
                                    Medium ({MEDIUM_GAME_LENGTH} cards)
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className={OPTION_CONTAINER} htmlFor={OPTION_LONG}>
                                <input type="radio"
                                       id={OPTION_LONG}
                                       name={OPTION_GAME_LENGTH}
                                       checked={this.props.gameLength === LONG_GAME_LENGTH}
                                       value={LONG_GAME_LENGTH}/>
                                <div className={OPTION_LONG
                                                + " " + OPTION
                                                + " " + BUTTON}>
                                    Long ({LONG_GAME_LENGTH} cards)
                                </div>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </section>
        )
    }
}
