import React from "react"
import {
    ADD_FIELD, DELETE_FIELD,
    BUTTON, EDIT_CARD,
    INDEX, YES, NO,
    INPUT_FIELD_CONTAINER,
    SLIDER_CONTAINER,
    SUBHEADING, SUBSECTION,
    TOGGLE_SLIDER, TOOLTIP_CONTAINER, DANGER, QUESTION_ANSWERS
} from "../helper/common"


export default class EditCardQA extends React.Component {

    handleQuestionListChange = (e) => {
        const index = e.target.name
        const newQ = e.target.value
        const ans = this.props.getQA(index).ans
        this.props.setQA(index, {
                "question": newQ,
                "ans": ans
            }
        )
    }

    handleAnswerListClick = (e) => {
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
        const index = parseInt(checkbox.name)
        checkbox.checked = !checkbox.checked
        const ans = checkbox.checked
        const question = this.props.getQA(index).question
        this.props.setQA(index, {
            "question": question,
            "ans": ans
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
        this.props.deleteQA(index)
    }

    handleEnterKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            e.preventDefault()
        }
    }

    renderQAns = () => {
        return <React.Fragment>
            {this.props.getQAs().map((qAns, index) => {
                return (
                    <li key={`qAns_${index}`}>
                        <div className={INPUT_FIELD_CONTAINER + " " + QUESTION_ANSWERS}
                             onClick={this.handleAnswerListClick}>
                            <input name={index}
                                   onKeyPress={this.handleEnterKeypress}
                                   onKeyDown={this.handleEnterKeypress}
                                   onKeyUp={this.handleEnterKeypress}
                                   type="text"
                                   spellCheck={"true"}
                                   onChange={this.handleQuestionListChange}
                                   value={qAns.question}/>
                            <div className={SLIDER_CONTAINER}>
                                <input type="checkbox"
                                       name={index}
                                       onChange={this.stopPropagation}
                                       checked={qAns.ans}/>
                                <span className={TOGGLE_SLIDER}>
                                    {
                                        qAns.ans
                                        ? <span className={"yes"}>Yes</span>
                                        : <span className={"no"}>No</span>
                                    }
                                </span>
                            </div>
                            <div className={TOOLTIP_CONTAINER}
                                 onClick={this.deleteQuestion}>
                                <span tooltip={"Delete Question"}
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

    handleLatestQ = (e) => {
        e.stopPropagation()
        const text = e.target.value
        this.props.setLatestQ(text)
    }

    handleLatestAns = (e) => {
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
        const ans = !this.props.getLatestA()
        this.props.setLatestA(ans)
    }

    handleAddQA = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        if(this.props.getLatestQ().trim() === "") {
            return
        }

        const newQA = {
            "question": this.props.getLatestQ(),
            "ans": this.props.getLatestA()
        }
        this.props.setQAs([...this.props.getQAs(), newQA])
        this.props.setLatestQ("")
        this.props.setLatestA(false)
    }

    handleKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            e.preventDefault()
            this.handleAddQA(null)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <section className={EDIT_CARD + " " + SUBSECTION}>
                <h3 className={EDIT_CARD + " " + SUBHEADING}>Yes-no Questions and Answers</h3>
                <ol>
                    {this.renderQAns()}
                    <li key={"latestQA"}>
                        <div key={"qaFieldContainer"}
                             onClick={this.handleLatestAns}
                             className={INPUT_FIELD_CONTAINER + " " + QUESTION_ANSWERS}>
                            <input type="text"
                                   spellCheck={"true"}
                                   onChange={this.handleLatestQ}
                                   onKeyPress={this.handleKeypress}
                                   onKeyDown={this.handleKeypress}
                                   onKeyUp={this.handleKeypress}
                                   value={this.props.getLatestQ()}/>
                            <div className={SLIDER_CONTAINER}>
                                <input type="checkbox"
                                       onChange={this.stopPropagation}
                                       checked={this.props.getLatestA()}/>
                                <span className={TOGGLE_SLIDER}>
                                            {
                                                this.props.getLatestA()
                                                ? <span className={YES}>Yes</span>
                                                : <span className={NO}>No</span>
                                            }
                                        </span>
                            </div>
                            <div className={TOOLTIP_CONTAINER}>
                                <button tooltip={"Add question"}
                                        onClick={this.handleAddQA}
                                        disabled={this.props.getLatestQ().trim() === ""}
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
