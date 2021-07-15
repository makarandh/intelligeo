import React from "react"
import Countries from "./Countries"


export default class Home extends React.Component {
    render() {
        return (
            <div>
                <Countries fetchOrDie={this.props.fetchOrDie}/>
            </div>
        )
    }
}

