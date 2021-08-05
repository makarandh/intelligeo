import React from "react"
import {
    CARD_CONTAINER, CARD_CHOICES, CARD_CLUES,
    CARD_HERO_IMAGE, Q_ANS, CARD_TITLE,
    SUBSECTION, CARD_HEADING, HEADING,
    LOADING_SCREEN_CONTAINER, CARD,
    VIEW_HINTS_CONTAINER, HIDE_ME,
    SHOW_ME, BUTTON, VIEW_HINTS,
    VIEW_HINTS_OUTER_CONTAINER,
    CORRECT_WRONG_ICON, BUTTON_NEXT, SCORE_PER_CARD, PENALTY_PER_ANS
} from "../helper/common"
import CardHero from "./CardHero"
import Choices from "./Choices"
import Clues from "./Clues"
import Loading from "./Loading"
import "../css/Card.css"
import QAns from "./QAns"
import ResultIcons from "./ResultIcons"

export default class Card extends React.Component {

    state = {
        country: null,
        qAnsVisible: false,
        ansClicked: false,
        clickedAns: "",
        score: SCORE_PER_CARD
    }

    setClickedAns = async(clickedAns) => {
        await this.setState({clickedAns})
    }

    decrementScore = async() => {
        await this.setState((prevState) => {
            return {score: prevState.score - PENALTY_PER_ANS}
        })
    }

    fetchCountrySetState = async(countryID) => {
        const result = await this.props.fetchCountry(countryID)
        if(!result) {
            return
        }
        if(result.status !== 200) {
            console.error("Error fetching country")
            console.error(result)
            return
        }
        await this.setState({country: result.json.result})
    }

    getClues = () => {
        if(!this.state.country || !this.state.country.clues) {
            return false
        }
        return this.state.country.clues
    }

    getQAns = () => {
        if(!this.state.country || !this.state.country.question_ans) {
            return false
        }
        return this.state.country.question_ans
    }

    setQAnsVisible = async() => {
        await this.setState({qAnsVisible: true}, async() => {
            window.scroll(0, 1100)
        })
    }

    setAnsClicked = async() => {
        await this.setState({ansClicked: true}, () => {
            window.scroll(0, 100)
        })
    }

    ansIsCorrect = () => {
        if(!this.state.country) {
            return false
        }
        return this.state.country.name === this.state.clickedAns
    }

    goToNextCard = async(increment = true) => {
        await this.props.goToNextCard(increment)
        const countryIDName = await this.props.getCountryIDName()
        if(!countryIDName.id) {
            return
        }
        await this.setState({
                                country: null,
                                qAnsVisible: false,
                                ansClicked: false,
                                clickedAns: "",
                                score: SCORE_PER_CARD
                            })
        const countryID = countryIDName.id
        await this.fetchCountrySetState(countryID)
    }

    updateScoreAndCount = async () => {
        if(this.ansIsCorrect()) {
            await this.props.incrementCorrect()
            await this.props.updateTotalScore(this.state.score)
            return
        }
        await this.setState({score: 0})
    }

    componentDidMount() {
        this.goToNextCard(false)
    }

    render() {
        return (
            <article className={CARD_CONTAINER}>
                <button className={BUTTON
                                   + " " + BUTTON_NEXT
                                   + " " + (this.state.ansClicked ? SHOW_ME : HIDE_ME)}
                        onClick={this.goToNextCard}>Next &#8811;</button>
                <section className={CARD_HERO_IMAGE + " " + SUBSECTION}>
                    <CardHero ansClicked={this.state.ansClicked}
                              country={this.state.country}/>
                </section>
                <section className={CARD_TITLE + " " + SUBSECTION}>
                    <div className={CARD_HEADING + " " + HEADING}>Guess The Country</div>
                </section>
                {
                    this.state.country
                    ? <div>
                        <section className={CARD_CLUES + " " + SUBSECTION}>
                            <Clues getClues={this.getClues}/>
                        </section>
                        <section className={VIEW_HINTS_OUTER_CONTAINER + " " + SUBSECTION}>
                            <div className={VIEW_HINTS_CONTAINER + " " +
                                            ((this.state.qAnsVisible || this.state.ansClicked) ? HIDE_ME : SHOW_ME)}>
                                <button className={BUTTON + " " + VIEW_HINTS}
                                        onClick={this.setQAnsVisible}>View more hints
                                </button>
                            </div>
                        </section>
                        <section className={CORRECT_WRONG_ICON + " " + SUBSECTION + " " +
                                            ((this.state.ansClicked) ? SHOW_ME : HIDE_ME)}>
                            <ResultIcons ansIsCorrect={this.ansIsCorrect}
                                         ansClicked={this.state.ansClicked}/>
                        </section>
                        <section className={CARD_CHOICES + " " + SUBSECTION}>
                            <Choices countryID={this.state.country.id}
                                     countryName={this.state.country.name}
                                     updateScoreAndCount={this.updateScoreAndCount}
                                     setAnsClicked={this.setAnsClicked}
                                     ansClicked={this.state.ansClicked}
                                     clickedAns={this.state.clickedAns}
                                     setClickedAns={this.setClickedAns}
                                     fetchCountryList={this.props.fetchCountryList}/>
                        </section>
                        <section className={Q_ANS + " " + SUBSECTION}>
                            <QAns getQAns={this.getQAns}
                                  ansClicked={this.state.ansClicked}
                                  score={this.state.score}
                                  decrementScore={this.decrementScore}
                                  qAnsVisible={this.state.qAnsVisible}/>
                        </section>
                    </div>
                    : <div className={CARD + " " + LOADING_SCREEN_CONTAINER}>
                        <span>Loading data...</span>
                        <Loading width={9} height={2}/>
                    </div>
                }
            </article>
        )
    }
}
