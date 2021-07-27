import React from "react"
import {
    ADD_FIELD, BUTTON, CLUES,
    EDIT_CARD, DELETE_FIELD,
    INDEX, INPUT_FIELD_CONTAINER,
    LATEST_CLUE_ADD, SUBHEADING,
    SUBSECTION, TOOLTIP_CONTAINER, DANGER
} from "../helper/common"
import "../css/CreateCardClues.css"

export default class EditCardClues extends React.Component {

    handleCluesListChange = (e) => {
        const index = e.target.name
        const newVal = e.target.value
        this.props.setClue(index, newVal)
    }

    deleteClue = (e) => {
        let element = e.target
        if(element.className === TOOLTIP_CONTAINER) {
            element = element.firstChild
        }
        const index = parseInt(element.getAttribute(INDEX))
        this.props.deleteClue(index)
    }

    handleEnterKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            e.preventDefault()
        }
    }

    renderClues = () => {
        return <React.Fragment>
            {this.props.getClues().map((clue, index) => {
                return (
                    <li key={`clue_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER + " " + CLUES}>
                            <input name={index}
                                   onKeyPress={this.handleEnterKeypress}
                                   onKeyDown={this.handleEnterKeypress}
                                   onKeyUp={this.handleEnterKeypress}
                                   type="text"
                                   value={clue}
                                   onChange={this.handleCluesListChange}/>
                            <div className={TOOLTIP_CONTAINER}
                                 onClick={this.deleteClue}>
                                <span tooltip={"Delete clue"}
                                      index={index}
                                      className={EDIT_CARD + " "
                                                 + DELETE_FIELD + " "
                                                 + DANGER + " "
                                                 + BUTTON}>-</span>
                            </div>
                        </div>
                    </li>
                )
            })}
        </React.Fragment>
    }

    handleLatestClue = (e) => {
        const text = e.target.value
        this.props.setLatestClue(text)
    }

    handleAddClue = (e) => {
        if(e) {
            e.stopPropagation()
            e.preventDefault()
        }
        if(this.props.getLatestClue().trim() === "") {
            return
        }
        const clues = [...this.props.getClues(), this.props.getLatestClue()]
        this.props.setClues(clues)
        this.props.setLatestClue("")
    }

    handleKeypress = (e) => {
        if(e) {
            e.stopPropagation()
        }
        if(e.key === "Enter") {
            e.preventDefault()
            this.handleAddClue(null)
        }
    }

    render() {
        return (
            <section className={`${EDIT_CARD} ${SUBSECTION} ${CLUES}`}>
                <h3 className={EDIT_CARD + " " + SUBHEADING}>Clues</h3>
                <ol>
                    {this.renderClues()}
                    <li key={"latestClue"}>
                        <div key={"cluesFieldContainer"}
                             className={INPUT_FIELD_CONTAINER + " " + CLUES}>
                            <input key={"clueLatestInput"}
                                   type="text"
                                   onKeyDown={this.handleKeypress}
                                   onKeyPress={this.handleKeypress}
                                   onKeyUp={this.handleKeypress}
                                   value={this.props.getLatestClue()}
                                   onChange={this.handleLatestClue}/>
                            <div key={"clueTooltipContainer"}
                                 className={TOOLTIP_CONTAINER}>
                                <button tooltip={"Add clue"}
                                        onClick={this.handleAddClue}
                                        id={LATEST_CLUE_ADD}
                                        disabled={this.props.getLatestClue().trim() === ""}
                                        className={EDIT_CARD + " " + ADD_FIELD + " " + BUTTON}>+
                                </button>
                            </div>
                        </div>
                    </li>
                </ol>
            </section>
        )
    }
}
