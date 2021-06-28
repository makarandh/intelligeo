import React from "react"
import "../css/CreateCard.css"
import {
    CREATE_CARD,
    SUB_SUBHEADING, SUB_SUBHEADING_CONTAINER,
    SUBHEADING, SUBSECTION
} from "../helper/common"


export default class CreateCardMeta extends React.Component {

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    handleContinentChange = (e) => {
        const continent = e.target.value
        this.props.setContinent(continent)
    }

    handleRegionChange = (e) => {
        const region = e.target.value
        this.props.setRegion(region)
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <section className={CREATE_CARD + " " + SUBSECTION}>
                <h3 className={CREATE_CARD + " " + SUBHEADING}>Extra Info</h3>
                <ul>
                    <li key={"continent"}>
                        <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                            <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Continent: </label>
                            <input type="text"
                                   onChange={this.handleContinentChange}
                                   value={this.props.getContinent()}/>
                        </div>
                    </li>
                    <li key={"region"}>
                        <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                            <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Region: </label>
                            <input type="text"
                                   onChange={this.handleRegionChange}
                                   value={this.props.getRegion()}/>
                        </div>
                    </li>
                </ul>
            </section>
        )
    }
}
