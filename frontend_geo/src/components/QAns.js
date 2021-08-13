import React from "react"
import {
    ANS_NO, ANS_YES, ANSVIEWED,
    ANSWER, BUTTON, BUTTON_DISABLED,
    BUTTON_SECONDARY, CARD_SCORE_CONTAINER,
    CARD_SCORE_PENALTY, CARD_SCORE_TEXT,
    FLY_UP, FREE_ANS, FREEANS,
    HIDE_ME, LOADING_HINTS,
    PENALTY_PER_ANS, Q_A_CONTAINER,
    Q_ANS, Q_ANS_ITEM,
    QA_INNER_CONTAINER,
    QA_OUTER_CONTAINER, QANS,
    QUESTION, SHOW_ME, sleep,
    SLIDE_IN, SUBHEADING, VIEW_ANSWER
} from "../helper/common"
import "../css/QAns.css"

export default class QAns extends React.Component {

    state = {
        qAnsVisible: false,
        randomized: false,
        qAns: [],
        freeAns: FREE_ANS,
        ansViewed: [],
        animationInProgress: false
    }

    loadQAStateFromLocalStorage = async () => {
        const qAns = this.props.loadFromLocalStorage(QANS)
        const freeAns = this.props.loadFromLocalStorage(FREEANS)
        const ansViewed = this.props.loadFromLocalStorage(ANSVIEWED)
        if(freeAns !== null && qAns !== null && ansViewed !== null) {
            await this.setState(
                {
                    randomized: true,
                    qAns,
                    freeAns,
                    ansViewed
                })
            return true
        }
        return false
    }

    randomizeQAns = async() => {
        const result = await this.loadQAStateFromLocalStorage()
        if(result) {
            return
        }
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
        await this.setState(
            {
                randomized: true,
                qAns: randQAns
            }, () => {
            this.props.saveToLocalStorage(QANS, this.state.qAns)
        })
    }

    setAnsViewed = async(index) => {
        if(this.state.ansViewed[index] || this.props.ansClicked) {
            return
        }
        await this.setState((prevState) => {
            let ansViewed = [...prevState.ansViewed]
            ansViewed[index] = true
            return {
                ansViewed,
                freeAns: prevState.freeAns - 1,
                animationInProgress: false
            }
        }, async() => {
            this.props.saveToLocalStorage(FREEANS, this.state.freeAns)
            this.props.saveToLocalStorage(ANSVIEWED, this.state.ansViewed)
            if(this.state.freeAns < 0) {
                await this.props.decrementScore()
                await this.setState({animationInProgress: true})
                await sleep(0.4)
                this.setState({animationInProgress: false})
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
                                              : " ")
                                           + (this.props.ansClicked ? " " + BUTTON_DISABLED : "")}
                                onClick={() => this.setAnsViewed(index)}>
                            <span className={VIEW_ANSWER + " " +
                                             (this.state.ansViewed[index] ? HIDE_ME : SHOW_ME)}>
                                View answer</span>
                            <span className={ANSWER + " " +
                                             (this.state.ansViewed[index] ? SHOW_ME : HIDE_ME)}>
                                {element.ans ? "Yes" : "No"}</span>
                        </button>
                    </li>)
                })
            }</ul>
        )
    }

    componentDidMount() {
        this.randomizeQAns()
    }

    render() {
        return (
            <article id={"QuestionAns"} className={QA_OUTER_CONTAINER}>
                {(this.state.randomized
                  ? <div className={Q_A_CONTAINER + " " + (this.props.qAnsVisible ? SLIDE_IN : HIDE_ME)}>
                      {(this.props.ansClicked
                        ? <div>
                            <h3 className={Q_ANS + " " + SUBHEADING}>Hints you viewed</h3>
                            <div className={CARD_SCORE_CONTAINER}>
                                <div className={CARD_SCORE_TEXT}>Scored: {this.props.score} points</div>
                            </div>
                        </div>
                        : <div className={CARD_SCORE_CONTAINER}>
                            <div className={CARD_SCORE_TEXT}>Scorable points: {this.props.score}</div>
                            <div className={CARD_SCORE_TEXT + " "
                                            + CARD_SCORE_PENALTY + " " +
                                            (this.state.animationInProgress ? FLY_UP : "")}>-{PENALTY_PER_ANS}</div>
                            {(this.state.freeAns > 0
                              ? <h3 className={Q_ANS + " " + SUBHEADING}>View {this.state.freeAns} hints for free</h3>
                              : <h3 className={Q_ANS + " " + SUBHEADING}>Hints costs {PENALTY_PER_ANS} points</h3>)}
                        </div>
                      )}
                      {this.renderQAns()}
                  </div>
                  : <div className={LOADING_HINTS}>Loading Hints...</div>)}
            </article>
        )
    }
}
