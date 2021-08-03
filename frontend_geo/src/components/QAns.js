import React from "react"
import {
    ANS_NO,
    ANS_YES,
    ANSWER,
    BUTTON, BUTTON_SECONDARY, FREE_ANS,
    HIDE_ME,
    Q_A_CONTAINER,
    Q_ANS, Q_ANS_ITEM, QA_INNER_CONTAINER, QA_OUTER_CONTAINER, QUESTION,
    SHOW_ME, sleep,
    SLIDE_IN, SUBHEADING, VIEW_ANSWER,
    VIEW_HINTS,
    VIEW_HINTS_CONTAINER
} from "../helper/common"
import "../css/QAns.css"

export default class QAns extends React.Component {

    state = {
        visible: false,
        randomized: false,
        qAns: [],
        freeAns: FREE_ANS,
        ansViewed: [],
    }

    randomizeQAns = () => {
        let qAns = this.props.getQAns()
        if(!qAns) {
            console.error("Question answers are empty or null")
            return
        }
        let randIndices = []
        for(let i = 0; i < qAns.length; i++) {
            randIndices.push(i)
            this.state.ansViewed.push(false)
        }
        for(let i = randIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randIndices[i], randIndices[j]] = [randIndices[j], randIndices[i]]
        }
        let randQAns = []
        randIndices.forEach((value) => {
            randQAns.push(qAns[value])
        })
        this.setState({randomized: true, qAns: randQAns})
    }

    setAnsViewed = (index) => {
        if(this.state.ansViewed[index]) {
            return
        }
        this.setState((prevState) => {
            let ansViewed = [...prevState.ansViewed]
            ansViewed[index] = true
            return {
                ansViewed,
                freeAns: prevState.freeAns - 1
            }
        })
    }

    renderQAns = () => {
        if(this.state.qAns.length < 1) {
            return <div/>
        }
        return (
            <ul className={QA_INNER_CONTAINER}>{
                this.state.qAns.map((element, index) => {
                    return (<li className={Q_ANS_ITEM} key={element.question}>
                        <span className={QUESTION}>{element.question}</span>
                        <button className={Q_ANS + " " + BUTTON
                                           + " " + BUTTON_SECONDARY + " "
                                           + (this.state.ansViewed[index]
                                              ? (element.ans
                                                 ? ANS_YES
                                                 : ANS_NO)
                                              : " ")}
                                onClick={() => this.setAnsViewed(index)}>
                            <span className={VIEW_ANSWER + " " +
                                             (this.state.ansViewed[index] ? HIDE_ME : SHOW_ME)}>
                                View answer</span>
                            <span className={ANSWER + " " +
                                             (this.state.ansViewed[index] ? SHOW_ME : HIDE_ME)}>
                                {element.ans? "Yes" : "No"}</span>
                        </button>
                    </li>)
                })
            }</ul>
        )
    }

    setVisible = async () => {
        this.setState({visible: true}, async() => {
            await sleep(0.1)
            window.scroll(0, 800)
        })
    }

    componentDidMount() {
        this.randomizeQAns()
    }

    render() {
        return (
            <article id={"QuestionAns"} className={QA_OUTER_CONTAINER}>
                {(this.state.randomized
                  ? <div className={Q_A_CONTAINER + " " + (this.state.visible ? SLIDE_IN : HIDE_ME)}>
                      {this.state.freeAns > 0
                       ? < h3 className={Q_ANS + " " + SUBHEADING}>You can view {this.state.freeAns} answers for free</h3>
                        : <h3 className={Q_ANS + " " + SUBHEADING}>Additional answers costs 10 points each</h3>
                      }
                      {this.renderQAns()}
                  </div>
                  : <div>Initializing QAns...</div>)}
                <div className={VIEW_HINTS_CONTAINER + " " + (this.state.visible ? HIDE_ME : SHOW_ME)}>
                    <button className={BUTTON + " " + VIEW_HINTS}
                            onClick={this.setVisible}>View more hints
                    </button>
                </div>
            </article>
        )
    }
}
