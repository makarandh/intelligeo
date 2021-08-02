import React from "react"
import {
    CARD_CONTAINER,
    CARD_CHOICES,
    CARD_CLUES,
    CARD_HERO_IMAGE,
    Q_ANS,
    CARD_TITLE,
    SUBSECTION,
    CARD_HEADING, HEADING, LOADING_SCREEN_CONTAINER, CARD
} from "../helper/common"
import CardHero from "./CardHero"
import Choices from "./Choices"
import Clues from "./Clues"
import Loading from "./Loading"
import "../css/Card.css"

export default class Card extends React.Component {

    state = {
        country: null
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

    componentDidMount() {
        const countryIDName = this.props.getCountryIDName()
        const countryID = countryIDName.id
        this.fetchCountrySetState(countryID)
    }

    render() {
        return (
            <article className={CARD_CONTAINER}>
                <section className={CARD_HERO_IMAGE + " " + SUBSECTION}>
                    <CardHero/>
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
                        <section className={CARD_CHOICES + " " + SUBSECTION}>
                            <Choices countryID={this.state.country.id}
                                     countryName={this.state.country.name}
                                     fetchCountryList={this.props.fetchCountryList}/>
                        </section>
                        <section className={Q_ANS + " " + SUBSECTION}>
                            <div>Questions answers placeholder</div>
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
