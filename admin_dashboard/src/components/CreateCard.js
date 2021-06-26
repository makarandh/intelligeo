import React from "react"
import "../css/CreateCard.css"
import {
    ADD_FIELD,
    BUTTON, BUTTON_CONTAINER,
    CARD_CONTAINER,
    CREATE_CARD,
    DELETE_FIELD,
    HEADING, INPUT_FIELD_CONTAINER,
    OUTER_CONTAINER, SLIDER_CONTAINER,
    SUB_SUBHEADING,
    SUB_SUBHEADING_CONTAINER,
    SUBHEADING,
    SUBSECTION, TOGGLE_SLIDER
} from "../helper/common"


export default class CreateCard extends React.Component {

    state = {
        name: null,
        clues: [
            "It's a big country.", "It's in an island."
        ],
        question_ans: [
            [
                "Is it a landlocked country?",
                false
            ],
            [
                "Is it a constitutional monarchy?",
                true
            ]
        ],
        meta: {
            continent: null,
            region: null
        }
    }

    renderClues = () => {
        return <React.Fragment>
            {this.state.clues.map((clue, index) => {
                return (
                    <li key={`clue_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER}>
                            <input type="text" value={clue}/>
                            <span className={CREATE_CARD + " " + DELETE_FIELD + " " + BUTTON}>-</span>
                        </div>
                    </li>
                )
            })}
        </React.Fragment>
    }

    renderQAns = () => {
        return <React.Fragment>
            {this.state.question_ans.map((qAns, index) => {
                return (
                    <li key={`qAns_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER}>
                            <input type="text" value={qAns[0]}/>
                            <div className={SLIDER_CONTAINER}>
                                <input type="checkbox" checked={qAns[1]}/>
                                <span className={TOGGLE_SLIDER}>{qAns[1] ? <span className={"yes"}>Yes</span> :
                                                                 <span className={"no"}>No</span>}</span>
                            </div>
                            <span className={CREATE_CARD + " " + DELETE_FIELD + " " + BUTTON}>-</span>
                        </div>
                    </li>
                )
            })}
        </React.Fragment>
    }

    render() {
        return (
            <article className={OUTER_CONTAINER + " " + CREATE_CARD}>
                <form className={CARD_CONTAINER + " " + CREATE_CARD}>
                    <h2 className={HEADING + " " + CREATE_CARD}>Add A New Country</h2>
                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Clues</h3>
                        <ol>
                            {this.renderClues()}
                            <li>
                                <div className={INPUT_FIELD_CONTAINER}>
                                    <input type="text"/>
                                    <span className={CREATE_CARD + " " + ADD_FIELD + " " + BUTTON}>+</span>
                                </div>
                            </li>
                        </ol>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Yes-no Questions and Answers</h3>
                        <ol>
                            {this.renderQAns()}
                            <li>
                                <div className={INPUT_FIELD_CONTAINER}>
                                    <input type="text"/>
                                    <span className={CREATE_CARD + " " + ADD_FIELD + " " + BUTTON}>+</span>
                                </div>
                            </li>
                        </ol>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Extra Info</h3>
                        <ul>
                            <li>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Continent: </label>
                                    <input type="text" value={this.state.meta.continent}/>
                                </div>
                            </li>
                            <li>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Region: </label>
                                    <input type="text" value={this.state.meta.region}/>
                                </div>
                            </li>
                        </ul>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION + " " + BUTTON_CONTAINER}>
                        <button className={CREATE_CARD + " " + BUTTON}>Add Card</button>
                    </section>
                </form>
            </article>
        )
    }
}
