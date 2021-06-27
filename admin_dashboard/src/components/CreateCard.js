import React from "react"
import "../css/CreateCard.css"
import {
    ADD_FIELD, BUTTON, BUTTON_CONTAINER, CARD_CONTAINER,
    CREATE_CARD, DELETE_FIELD, HEADING, INDEX, INPUT_FIELD_CONTAINER,
    LATEST_CLUE_ADD, NO, OUTER_CONTAINER, SLIDER_CONTAINER,
    SUB_SUBHEADING, SUB_SUBHEADING_CONTAINER, SUBHEADING,
    SUBSECTION, TOGGLE_SLIDER, TOOLTIP_CONTAINER, YES
} from "../helper/common"


export default class CreateCard extends React.Component {

    state = {
        name: "",
        clues: [
            "It's a big country.", "It's in an island.", "It's a tropical country."
        ],
        questionAns: [
            [
                "Is it a landlocked country?",
                false
            ],
            [
                "Is it a constitutional monarchy?",
                true
            ],
            [
                "Is it a cold country?",
                false
            ],
            [
                "Is it a touristic country?",
                true
            ]
        ],
        meta: {
            continent: "",
            region: ""
        },
        latestClue: "",
        latestQuestion: "",
        latestAns: false
    }

    handleCluesListChange = (e) => {
        const i = e.target.name
        const newVal = e.target.value
        this.setState((prevState) => {
            let clues = prevState.clues
            clues[i] = newVal
            return {clues}
        })
    }

    deleteClue = (e) => {
        let element = e.target
        if(element.className === TOOLTIP_CONTAINER) {
            element = element.firstChild
        }
        const index = parseInt(element.getAttribute(INDEX))
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), ...prevState.clues.slice(index + 1)]
            return {clues}
        })
    }

    renderClues = () => {
        return <React.Fragment>
            {this.state.clues.map((clue, index) => {
                return (
                    <li key={`clue_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER}>
                            <input name={index}
                                   type="text"
                                   value={clue}
                                   onChange={this.handleCluesListChange}/>
                            <div className={TOOLTIP_CONTAINER}
                                 onClick={this.deleteClue}>
                                <span tooltip={"Delete clue"}
                                      index={index}
                                      className={CREATE_CARD + " " + DELETE_FIELD + " " + BUTTON}>-</span>
                            </div>
                        </div>
                    </li>
                )
            })}
        </React.Fragment>
    }

    handleQuestionListChange = (e) => {
        console.log("QuestionListChange")
        console.log(e.target)
        const i = e.target.name
        const newVal = e.target.value
        this.setState((prevState) => {
            let qAns = prevState.questionAns
            qAns[i][0] = newVal
            return {questionAns: qAns}
        })
    }

    handleAnswerListClick = (e) => {
        console.log("handleAnswerListClick")
        console.log(e.target)
        let checkbox = e.target
        if(e.target.className === "") {
            return
        }
        console.log(e.target.className)
        switch(checkbox.className) {
            case TOGGLE_SLIDER:
            case SLIDER_CONTAINER:
                checkbox = checkbox.parentElement.firstChild
                break
            case YES:
            case NO:
                checkbox = checkbox.parentElement.parentElement.firstChild
                break
            case INPUT_FIELD_CONTAINER:
                checkbox = checkbox.firstChild
                break
            default:
                console.error(`${checkbox} not recognized`)
                return
        }
        const index = checkbox.name
        checkbox.checked = !checkbox.checked
        this.setState((prevState) => {
            const qAns = prevState.questionAns
            console.log(qAns)
            qAns[index][1] = checkbox.checked
            return {
                questionAns: qAns
            }
        })
    }

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    deleteQuestion = (e) => {
        let element = e.target
        if(element.className === TOOLTIP_CONTAINER) {
            element = element.firstChild
        }
        const index = parseInt(element.getAttribute(INDEX))
        this.setState((prevState) => {
            const qAns = [...prevState.questionAns.slice(0, index), ...prevState.questionAns.slice(index + 1)]
            return {questionAns: qAns}
        })
    }

    renderQAns = () => {
        return <React.Fragment>
            {this.state.questionAns.map((qAns, index) => {
                return (
                    <li key={`qAns_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER}
                             onClick={this.handleAnswerListClick}>
                            <input name={index}
                                   type="text"
                                   onChange={this.handleQuestionListChange}
                                   value={qAns[0]}/>
                            <div className={SLIDER_CONTAINER}>
                                <input type="checkbox"
                                       name={index}
                                       onChange={this.stopPropagation}
                                       checked={qAns[1]}/>
                                <span className={TOGGLE_SLIDER}>
                                    {
                                        qAns[1]
                                        ? <span className={"yes"}>Yes</span>
                                        : <span className={"no"}>No</span>
                                    }
                                </span>
                            </div>
                            <div className={TOOLTIP_CONTAINER}
                                 onClick={this.deleteQuestion}>
                                <span tooltip={"Delete Question"}
                                      index={index}
                                      className={CREATE_CARD + " " + DELETE_FIELD + " " + BUTTON}>-</span>
                            </div>
                        </div>
                    </li>
                )
            })}
        </React.Fragment>
    }

    handleLatestClue = (e) => {
        const text = e.target.value
        this.setState({latestClue: text})
    }

    handleLatestQ = (e) => {
        e.stopPropagation()
        const text = e.target.value
        this.setState({latestQuestion: text})
    }

    handleLatestAns = (e) => {
        console.log(e.target)
        let checkbox = e.target
        if(e.target.className === "") {
            return
        }
        switch(checkbox.className) {
            case TOGGLE_SLIDER:
            case SLIDER_CONTAINER:
                checkbox = checkbox.parentElement.firstChild
                break
            case YES:
            case NO:
                checkbox = checkbox.parentElement.parentElement.firstChild
                break
            case INPUT_FIELD_CONTAINER:
                checkbox = checkbox.firstChild
                break
            default:
                console.error(`${checkbox} not recognized`)
                return
        }
        checkbox.checked = !checkbox.checked
        this.setState((prevState) => {
            return {
                latestAns: !prevState.latestAns
            }
        })
    }

    handleAddClue = (e) => {
        console.log("handleAddClue")
        console.log(e)
        e && e.preventDefault()
        e && console.log(e.target)
        if(this.state.latestClue.trim() === "") {
            return
        }
        this.setState((prevState) => {
            const clues = [...prevState.clues, prevState.latestClue]
            return {
                clues,
                latestClue: ""
            }
        })
    }

    handleAddQA = (e) => {
        console.log("handleAddQA")
        e && e.preventDefault()
        e && e.stopPropagation()
        e && console.log(e.target)
        if(this.state.latestQuestion.trim() === "") {
            return
        }
        this.setState((prevState) => {
            const newQA = [prevState.latestQuestion, prevState.latestAns]
            const qAns = [...prevState.questionAns, newQA]
            return {
                questionAns: qAns,
                latestQuestion: "",
                latestAns: false
            }
        })
    }

    handleQuestionKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            this.handleAddQA(null)
        }
    }

    handleClueKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            this.handleAddClue(null)
        }
    }

    handleContinentChange = (e) => {
        const continent = e.target.value
        this.setState((prevState) => ({

            meta: {
                region: prevState.meta.region,
                continent
            }
        }))
    }

    handleRegionChange = (e) => {
        const region = e.target.value
        this.setState((prevState) => ({

            meta: {
                region,
                continent: prevState.meta.continent
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
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
                            <li key={"latestClue"}>
                                <div key={"cluesFieldContainer"}
                                     className={INPUT_FIELD_CONTAINER}>
                                    <input key={"clueLatestInput"}
                                           type="text"
                                           onKeyDown={this.handleClueKeypress}
                                           value={this.state.latestClue}
                                           onChange={this.handleLatestClue}/>
                                    <div key={"clueTooltipContainer"}
                                         className={TOOLTIP_CONTAINER}>
                                        <button tooltip={"Add clue"}
                                                onClick={this.handleAddClue}
                                                id={LATEST_CLUE_ADD}
                                                disabled={this.state.latestClue === ""}
                                                className={CREATE_CARD + " " + ADD_FIELD + " " + BUTTON}>+
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Yes-no Questions and Answers</h3>
                        <ol>
                            {this.renderQAns()}
                            <li key={"latestQA"}>
                                <div key={"qaFieldContainer"}
                                     onClick={this.handleLatestAns}
                                     className={INPUT_FIELD_CONTAINER}>
                                    <input type="text"
                                           onChange={this.handleLatestQ}
                                           onKeyDown={this.handleQuestionKeypress}
                                           value={this.state.latestQuestion}/>
                                    <div className={SLIDER_CONTAINER}>
                                        <input type="checkbox"
                                               onChange={this.stopPropagation}
                                               checked={this.state.latestAns}/>
                                        <span className={TOGGLE_SLIDER}>
                                            {
                                                this.state.latestAns
                                                ? <span className={YES}>Yes</span>
                                                : <span className={NO}>No</span>
                                            }
                                        </span>
                                    </div>
                                    <div className={TOOLTIP_CONTAINER}>
                                        <button tooltip={"Add question"}
                                                onClick={this.handleAddQA}
                                                disabled={this.state.latestQuestion === ""}
                                                className={CREATE_CARD + " " + ADD_FIELD + " " + BUTTON}>+
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Extra Info</h3>
                        <ul>
                            <li key={"continent"}>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Continent: </label>
                                    <input type="text"
                                           onChange={this.handleContinentChange}
                                           value={this.state.meta.continent}/>
                                </div>
                            </li>
                            <li key={"region"}>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Region: </label>
                                    <input type="text"
                                           onChange={this.handleRegionChange}
                                           value={this.state.meta.region}/>
                                </div>
                            </li>
                        </ul>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION + " " + BUTTON_CONTAINER}>
                        <button className={CREATE_CARD + " " + BUTTON}
                                onClick={this.handleSubmit}>Add Card
                        </button>
                    </section>
                </form>
            </article>
        )
    }
}
