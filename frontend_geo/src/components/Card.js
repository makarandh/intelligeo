import React from "react"
import {
    CARD_CONTAINER,
    CARD_CHOICES,
    CARD_CLUES,
    CARD_HERO_IMAGE,
    Q_ANS,
    CARD_TITLE,
    SUBSECTION,
    CARD_HEADING,
    HEADING,
    LOADING_SCREEN_CONTAINER,
    CARD,
    VIEW_HINTS_CONTAINER,
    HIDE_ME,
    SHOW_ME,
    BUTTON,
    VIEW_HINTS,
    VIEW_HINTS_OUTER_CONTAINER, CORRECT_WRONG_ICON
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
        clickedAns: ""
    }

    setClickedAns = (clickedAns) => {
        console.log("ClickedAns " + clickedAns)
        this.setState({clickedAns})
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
        this.setState({country: result.json.result})
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
        this.setState({qAnsVisible: true}, async() => {
            window.scroll(0, 1100)
        })
    }

    setAnsClicked = () => {
        this.setState({ansClicked: true}, () => {
            window.scroll(0, 100)
        })
    }

    ansIsCorrect = () => {
        if(!this.state.country) {
            return false
        }
        return (this.state.country.name === this.state.clickedAns)
    }

    componentDidMount() {
        const countryIDName = this.props.getCountryIDName()
        const countryID = countryIDName.id
        this.fetchCountrySetState(countryID)
    }

    render() {
        return (
            <article className={CARD_CONTAINER}>
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
                                     setAnsClicked={this.setAnsClicked}
                                     ansClicked={this.state.ansClicked}
                                     clickedAns={this.state.clickedAns}
                                     setClickedAns={this.setClickedAns}
                                     fetchCountryList={this.props.fetchCountryList}/>
                        </section>
                        <section className={Q_ANS + " " + SUBSECTION}>
                            <QAns getQAns={this.getQAns}
                                  ansClicked={this.state.ansClicked}
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
