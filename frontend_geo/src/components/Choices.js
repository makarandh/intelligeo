import React from "react"
import {BUTTON, CHOICE_BUTTONS_CONTAINER, CHOICE_COUNT, CHOICES, CONTAINER} from "../helper/common"
import "../css/Choices.css"

export default class Choices extends React.Component {

    state = {
        randomized: false,
        countries: []
    }

    fetchChoices = async() => {
        const response = await this.props.fetchCountryList(CHOICE_COUNT, this.props.countryID)
        if(response && response.status === 200) {
            const countryIDNames = response.json.result
            const countries = countryIDNames.map(element => element.name)
            this.setState({countries, randomized: true})
        }
        else {
            console.error(response)
            return false
        }
    }

    renderChoices = () => {
        if(this.state.countries.length < CHOICE_COUNT) {
            return <div>{"Fewer than " + CHOICE_COUNT + " countries available. Please add more countries"}</div>
        }
        return (
            <div className={CHOICE_BUTTONS_CONTAINER}>{
                this.state.countries.map(element => {
                    return <button className={BUTTON + " " + CHOICES}
                                   key={element}> {element}</button>
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
