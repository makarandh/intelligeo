import React from "react"
import {
    BUTTON,
    BUTTON_DISABLED, BUTTON_YELLOW,
    CHOICE_BUTTONS_CONTAINER,
    CHOICE_COUNT,
    CHOICES,
    CONTAINER,
    CORRECT_ANS, WRONG_ANS
} from "../helper/common"
import "../css/Choices.css"

export default class Choices extends React.Component {

    state = {
        randomized: false,
        countries: [],
    }

    loadChoicesFromLocalStorage = async () => {
        const countries = this.props.loadFromLocalStorage(CHOICES)
        if(countries !== null) {
            await this.setState({countries, randomized: true})
            return true
        }
        return false
    }

    loadChoices = async () => {
        const result = await this.loadChoicesFromLocalStorage()
        if(!result) {
            await this.fetchChoices()
        }
    }

    fetchChoices = async() => {
        const response = await this.props.fetchCountryList(CHOICE_COUNT - 1, this.props.countryID)
        if(response && response.status === 200) {
            const countryIDNames = response.json.result
            let countries = countryIDNames.map(element => element.name)
            countries.push(this.props.countryName)
            for(let i = countries.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [countries[i], countries[j]] = [countries[j], countries[i]]
            }
            await this.setState({countries, randomized: true}, () => {
                this.props.saveToLocalStorage(CHOICES, this.state.countries)
            })
        } else if(response && response.status === 500) {
            this.props.setNetworkError()
        }
        else {
            console.error(response)
            return false
        }
    }

    processAns = async (ans) => {
        if(this.props.ansClicked) {
            return
        }
        await this.props.setAnsClicked()
        await this.props.setClickedAns(ans)
        await this.props.updateScoreAndCount()
    }

    getClassNames = (element) => {
        let classList = ""
        if(!this.props.ansClicked) {
            return classList
        }
        classList += " " + BUTTON_DISABLED
        if(this.props.countryName === element) {
            classList += " " + CORRECT_ANS
            return classList
        }
        if(this.props.clickedAns !== element) {
            return classList
        }
        classList += " " + WRONG_ANS
        return classList
    }

    renderChoices = () => {
        if(this.state.countries.length === 0) {
            return <div>{"No choices available. Please add at least one country"}</div>
        }
        return (
            <div className={CHOICE_BUTTONS_CONTAINER}>{
                this.state.countries.map(element => {
                    return <button className={BUTTON + " " +  BUTTON_YELLOW + " " + CHOICES
                                              + " " + this.getClassNames(element)}
                                   key={element}
                                   id={element}
                                   onClick={() => {
                                       this.processAns(element)
                                   }}>
                        {element}
                    </button>
                })
            }</div>
        )
    }

    componentDidMount() {
        this.loadChoices()
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
