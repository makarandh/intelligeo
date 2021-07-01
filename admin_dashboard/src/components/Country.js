import React from "react"
import {
    GET, SINGLE_CARDS_PAGE, EP_COUNTRY, PATH_HOME, OUTER_CONTAINER, INNER_CONTAINER
} from "../helper/common"
import CardContent from "./CardContent"
import "../css/Country.css"
import {PageHeading} from "./PageHeading"

export default class Country extends React.Component {

    state = {
        country: {},
        dataFetched: false
    }

    fetchCard = async() => {
        const path = window.location.pathname
        const index = path.lastIndexOf("/") + 1
        const countryID = parseInt(path.substring(index))
        const response = await this.props.fetchOrDie(`${EP_COUNTRY}?id=${countryID}`, GET)

        if(response.status === 404) {
            window.location.href = PATH_HOME
            return
        }
        const jsonData = (await response.json()).result
        this.setState({
            country: jsonData,
            dataFetched: true
        })
    }

    componentDidMount() {
        this.fetchCard()
    }

    render() {
        return (
            <section className={SINGLE_CARDS_PAGE + " " + OUTER_CONTAINER}>
                <PageHeading mainHeading={"Country"}/>
                <div className={SINGLE_CARDS_PAGE + " " + INNER_CONTAINER}>
                    {
                        this.state.dataFetched
                        ? <CardContent country={this.state.country}/>
                        : <div>Loading...</div>
                    }
                </div>
            </section>
        )
    }
}

