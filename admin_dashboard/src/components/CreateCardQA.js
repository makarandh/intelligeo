import React from "react"
import {
    ADD_FIELD, DELETE_FIELD,
    BUTTON, CREATE_CARD,
    INDEX, YES, NO,
    INPUT_FIELD_CONTAINER,
    SLIDER_CONTAINER,
    SUBHEADING, SUBSECTION,
    TOGGLE_SLIDER, TOOLTIP_CONTAINER
} from "../helper/common"


export default class CreateCardQA extends React.Component {

    handleQuestionListChange = (e) => {
        const index = e.target.name
        const newQ = e.target.value
        const ans = this.props.getQA(index)[1]
        this.props.setQA(index, [newQ, ans])
    }

    handleAnswerListClick = (e) => {
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
        const index = parseInt(checkbox.name)
        checkbox.checked = !checkbox.checked
        const ans = checkbox.checked
        const question = this.props.getQA(index)[0]
        this.props.setQA(index, [question, ans])
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

    renderQAns = () => {
        return <React.Fragment>
            {this.props.getQAs().map((qAns, index) => {
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

        const newQA = [this.props.getLatestQ(), this.props.getLatestA()]
        this.props.setQAs([...this.props.getQAs(), newQA])
        this.props.setLatestQ("")
        this.props.setLatestA(false)
    }

    handleQuestionKeypress = (e) => {
        e && e.stopPropagation()
        if(e.key === "Enter") {
            this.handleAddQA(null)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        return (
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
                                        className={CREATE_CARD + " " + ADD_FIELD + " " + BUTTON}>+
                                </button>
                            </div>
                        </div>
                    </li>
                </ol>
            </section>
        )
    }
}
