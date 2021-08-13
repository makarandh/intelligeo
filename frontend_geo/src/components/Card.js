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
    VIEW_HINTS_OUTER_CONTAINER,
    CORRECT_WRONG_ICON,
    BUTTON_NEXT,
    SCORE_PER_CARD,
    PENALTY_PER_ANS,
    SCORE,
    COUNTRY,
    QANS,
    FREEANS,
    QANSVISIBLE,
    ANSCLICKED,
    CLICKEDANS,
    CHOICES,
    BUTTON_QUIT,
    BUTTON_DANGER,
    QUIT_BUTTON_CONTAINER,
    QUIT_MESSAGE,
    QUIT_HEADING,
    ANSVIEWED,
    BUTTON_GREEN,
    PROGRESS,
    PROGRESS_BAR_TEXT,
    OUTER_CONTAINER,
    CARD_CONTAINER_CONTAINER,
    BACK_BUTTON,
    BUTTON_BLUE,
    HELP_BUTTON,
    HELP_SUBSECTION,
    SLIDE_DOWN, SLIDE_UP, BUTTON_BLUE_PRESSED, ROUTE_NEW_GAME
} from "../helper/common"
import CardHero from "./CardHero"
import Choices from "./Choices"
import Clues from "./Clues"
import HelpText from "./HelpText"
import Loading from "./Loading"
import "../css/Card.css"
import QAns from "./QAns"
import ResultIcons from "./ResultIcons"
import YesNoModal from "./YesNoModal"

export default class Card extends React.Component {

    state = {
        country: null,
        qAnsVisible: false,
        ansClicked: false,
        clickedAns: "",
        score: SCORE_PER_CARD,
        quitModalVisible: false,
        helpVisible: false
    }

    setClickedAns = async(clickedAns) => {
        await this.setState({clickedAns}, () => {
            this.props.saveToLocalStorage(CLICKEDANS, this.state.clickedAns)
        })
    }

    decrementScore = async() => {
        await this.setState((prevState) => {
            return {score: prevState.score - PENALTY_PER_ANS}
        }, () => {
            this.props.saveToLocalStorage(SCORE, this.state.score)
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
        await this.setState({country: result.json.result}, () => {
            this.props.saveToLocalStorage(COUNTRY, this.state.country)
        })
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
            window.scroll(0, 1200)
            this.props.saveToLocalStorage(QANSVISIBLE, this.state.qAnsVisible)
        })
    }

    setAnsClicked = async() => {
        await this.setState({ansClicked: true}, () => {
            window.scroll(0, 100)
            this.props.saveToLocalStorage(ANSCLICKED, this.state.ansClicked)
        })
    }

    ansIsCorrect = () => {
        if(!this.state.country) {
            return false
        }
        return this.state.country.name === this.state.clickedAns
    }

    clearLocalCardState = () => {
        localStorage.removeItem(COUNTRY)
        localStorage.removeItem(QANS)
        localStorage.removeItem(SCORE)
        localStorage.removeItem(FREEANS)
        localStorage.removeItem(QANSVISIBLE)
        localStorage.removeItem(ANSCLICKED)
        localStorage.removeItem(ANSVIEWED)
        localStorage.removeItem(CLICKEDANS)
        localStorage.removeItem(CHOICES)
    }

    loadCardStateFromLocalStorage = async() => {
        let country = await this.props.loadFromLocalStorage(COUNTRY)
        if(country === null) {
            return false
        }
        let score = SCORE_PER_CARD
        let qAnsVisible = false
        let ansClicked = false
        let clickedAns = ""
        try {
            const localScore = await this.props.loadFromLocalStorage(SCORE)
            if(localScore !== null) {
                score = parseInt(localScore)
            }
            country = await this.props.loadFromLocalStorage(COUNTRY)
            let localQAnsVisible = await this.props.loadFromLocalStorage(QANSVISIBLE)
            if(typeof localQAnsVisible === "boolean") {
                qAnsVisible = localQAnsVisible
            }
            const localAnsClicked = await this.props.loadFromLocalStorage(ANSCLICKED)
            if(localAnsClicked !== null) {
                ansClicked = localAnsClicked
            }
            const localClickedAns = await this.props.loadFromLocalStorage(CLICKEDANS)
            if(localClickedAns !== null) {
                clickedAns = localClickedAns
            }
        }
        catch(e) {
            console.error("Error loading item for current card from local storage")
            console.error(e)
            return false
        }
        await this.setState({
                                country,
                                qAnsVisible,
                                ansClicked,
                                clickedAns,
                                score
                            })
        return true
    }

    loadCard = async(increment = true, e) => {
        if(e) {
            console.log("loadcard even handler ")
            console.log(e.target)
        }
        if(!increment) {
            console.log("Attempting to load card state from local storage")
            if(await this.loadCardStateFromLocalStorage()) {
                console.log("Successfully loaded card state from local storage")
                return
            }
            console.log("Failed to load card state from local storage")
        }
        this.clearLocalCardState()
        await this.props.loadCard(increment)
        const countryIDName = await this.props.getCountryIDName()
        if(!countryIDName.id) { // game end
            return
        }
        console.log(countryIDName)
        await this.setState(
            {
                country: null,
                qAnsVisible: false,
                ansClicked: false,
                clickedAns: "",
                score: SCORE_PER_CARD
            }, () => {
                this.props.saveToLocalStorage(QANSVISIBLE, this.state.qAnsVisible)
                this.props.saveToLocalStorage(SCORE, this.state.score)
            })
        const countryID = countryIDName.id
        await this.fetchCountrySetState(countryID)
    }

    updateScoreAndCount = async() => {
        if(this.ansIsCorrect()) {
            await this.props.incrementCorrect()
            await this.props.updateTotalScore(this.state.score)
            return
        }
        await this.setState({score: 0}, () => {
            this.props.saveToLocalStorage(SCORE, this.state.score)
        })
    }

    showExitConfirm = (e) => {
        e.preventDefault()
        this.setState({quitModalVisible: true})
    }

    handleQuitYes = () => {
        this.props.resetGame()
    }

    handleQuitNo = () => {
        this.setState({quitModalVisible: false})
    }

    goback = (e) => {
        e && e.preventDefault()
        window.location.href = ROUTE_NEW_GAME
    }

    toggleViewHelp = async(e) => {
        if(e) {
            e.preventDefault()
        }
        await this.setState((prevState) => {
            return {helpVisible: !prevState.helpVisible}
        })
    }

    handleUnhandledClick = async(e) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        console.log(e.target)
        if(this.state.helpVisible) {
            await this.setState({helpVisible: false})
        }
    }

    componentDidMount() {
        this.loadCard(false)
    }

    render() {
        return (
            <div className={OUTER_CONTAINER
                            + " " + CARD_CONTAINER_CONTAINER}
                 onClick={this.handleUnhandledClick}>
                <button className={BUTTON
                                   + " " + BACK_BUTTON
                                   + " " + BUTTON_BLUE}
                        onClick={this.goback}>&#8810; Back
                </button>
                <button className={BUTTON
                                   + " " + HELP_BUTTON
                                   + " " + BUTTON_BLUE
                                   + " " + (this.state.helpVisible && BUTTON_BLUE_PRESSED)}
                        onClick={this.toggleViewHelp}>?
                </button>
                <section className={HELP_SUBSECTION
                                    + " "
                                    + (this.state.helpVisible ? SLIDE_DOWN : SLIDE_UP)}>
                    <HelpText/>
                </section>
                <article className={CARD_CONTAINER}>
                    <button className={BUTTON
                                       + " " + BUTTON_NEXT
                                       + " " + BUTTON_BLUE
                                       + " " + (this.state.ansClicked ? SHOW_ME : HIDE_ME)}
                            onClick={this.loadCard}>{this.props.lastCard()
                                                     ? <span>View End Game Score &#8811;</span>
                                                     : <span>Next &#8811;</span>}</button>
                    <YesNoModal handleYes={this.handleQuitYes}
                                handleNo={this.handleQuitNo}
                                visible={this.state.quitModalVisible}
                                heading={QUIT_HEADING}
                                message={QUIT_MESSAGE}/>
                    <section className={CARD_HERO_IMAGE + " " + SUBSECTION}>
                        <CardHero ansClicked={this.state.ansClicked}
                                  country={this.state.country}/>
                    </section>
                    <section className={CARD_TITLE + " " + SUBSECTION}>
                        <div className={CARD_HEADING + " " + HEADING}>Guess The Country</div>
                    </section>
                    <section className={SUBSECTION + " " + PROGRESS}>
                        <div className={PROGRESS_BAR_TEXT}>Question: {this.props.index +
                                                                      1}/{this.props.gameLength}</div>
                    </section>
                    {
                        this.state.country
                        ? <div>
                            <section className={CARD_CLUES + " " + SUBSECTION}>
                                <Clues getClues={this.getClues}/>
                            </section>
                            <section className={VIEW_HINTS_OUTER_CONTAINER + " " + SUBSECTION}>
                                <div className={VIEW_HINTS_CONTAINER + " " +
                                                ((this.state.qAnsVisible || this.state.ansClicked) ? HIDE_ME :
                                                 SHOW_ME)}>
                                    <button className={BUTTON + " " + VIEW_HINTS + " " + BUTTON_GREEN}
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
                                         loadFromLocalStorage={this.props.loadFromLocalStorage}
                                         saveToLocalStorage={this.props.saveToLocalStorage}
                                         setClickedAns={this.setClickedAns}
                                         fetchCountryList={this.props.fetchCountryList}/>
                            </section>
                            <section className={Q_ANS + " " + SUBSECTION}>
                                <QAns getQAns={this.getQAns}
                                      ansClicked={this.state.ansClicked}
                                      score={this.state.score}
                                      decrementScore={this.decrementScore}
                                      loadFromLocalStorage={this.props.loadFromLocalStorage}
                                      saveToLocalStorage={this.props.saveToLocalStorage}
                                      qAnsVisible={this.state.qAnsVisible}/>
                            </section>
                            <section className={QUIT_BUTTON_CONTAINER}>
                                <button className={BUTTON + " " + BUTTON_QUIT + " " + BUTTON_DANGER}
                                        onClick={this.showExitConfirm}>Quit Game
                                </button>
                            </section>
                        </div>
                        : <div className={CARD + " " + LOADING_SCREEN_CONTAINER}>
                            <span>Loading data...</span>
                            <Loading width={9} height={2}/>
                        </div>
                    }
                </article>
            </div>
        )
    }
}
