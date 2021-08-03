import React from "react"
import {BUTTON, CHOICE_BUTTONS_CONTAINER, CHOICE_COUNT, CHOICES, CONTAINER} from "../helper/common"
import "../css/Choices.css"

export default class Choices extends React.Component {

    state = {
        randomized: false,
        countries: []
    }

    fetchChoices = async() => {
        const response = await this.props.fetchCountryList(CHOICE_COUNT - 1, this.props.countryID)
        if(response && response.status === 200) {
            const countryIDNames = response.json.result
            let countries = countryIDNames.map(element => element.name)
            countries.push(this.props.countryName)
            console.log(countries)
            for(let i = countries.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [countries[i], countries[j]] = [countries[j], countries[i]]
            }
            this.setState({countries, randomized: true})
        }
        else {
            console.error(response)
            return false
        }
    }

    processAns = (ans, e) => {
        console.log(e.target)
        if(ans === this.props.countryName) {
            console.log("Correct ans")
            return
        }
        console.log("Wrong ans")
    }

    renderChoices = () => {
        if(this.state.countries.length < CHOICE_COUNT) {
            return <div>{"Fewer than " + CHOICE_COUNT + " countries available. Please add more countries"}</div>
        }
        return (
            <div className={CHOICE_BUTTONS_CONTAINER}>{
                this.state.countries.map(element => {
                    return <button className={BUTTON + " " + CHOICES}
                                   key={element}
                                   onClick={(e) => {
                                       this.processAns(element, e)
                                   }}>
                        {element}
                    </button>
                })
            }</div>
        )
    }

    componentDidMount() {
        this.fetchChoices()
    }

    render() {
        return (
            <article className={CHOICES + " " + CONTAINER}>
                {this.state.randomized ?
                 <div>{this.renderChoices()}</div>
                                       : <div>
                     Initializing choices...
                 </div>
                }
            </article>
        )
    }
}
