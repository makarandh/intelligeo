import React from "react"
import {UPDATE, UPDATE_CARD, UPDATE_CARD_HEADING} from "../helper/common"
import EditCard from "./EditCard"
import "../css/UpdateCard.css"

export default class UpdateCard extends React.Component {
    render() {
        const path = window.location.pathname
        const index = path.lastIndexOf("/") + 1
        const countryID = parseInt(path.substring(index))
        return (
            <div>
                <EditCard fetchOrDie={this.props.fetchOrDie}
                          operation={UPDATE}
                          countryID={countryID}
                          heading={UPDATE_CARD_HEADING}
                          buttonTitle={UPDATE_CARD}/>
            </div>
        )
    }
}
