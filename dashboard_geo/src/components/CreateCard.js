import React from "react"
import {ADD_CARD, CREATE, CREATE_CARD_HEADING} from "../helper/common"
import EditCard from "./EditCard"

export default class CreateCard extends React.Component {
    render() {
        return (
            <div>
                <EditCard fetchOrDie={this.props.fetchOrDie}
                          operation={CREATE}
                          heading={CREATE_CARD_HEADING}
                          buttonTitle={ADD_CARD}/>
            </div>
        )
    }
}
