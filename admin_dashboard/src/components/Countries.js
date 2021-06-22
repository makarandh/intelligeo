import React from "react"
import {
    GET,
    get_url,
    ITEMS_PER_PAGE,
    PATH_COUNTRIES,
    PATH_COUNTRIES_TOTAL,
    strITEMS_PER_PAGE,
    strPAGE_NUM
} from "../helper/common"
import Card from "./Card"

export default class Countries extends React.Component {

    state = {
        page_num: 1,
        totalCards: 0,
        cardsList: []
    }

    fetchCardsCount = async() => {
        const response = await this.props.fetchOrDie(PATH_COUNTRIES_TOTAL, GET)
        if(response.status === 200) {
            const jsonResponse = await response.json()
            this.setState({totalCards: jsonResponse.result})
        }
        else {
            console.log("Error fetching total cards")
            console.log(response)
        }
    }

    fetchCardsList = async() => {
        const url = get_url(PATH_COUNTRIES,
            `${strPAGE_NUM}=${this.state.page_num}`,
            `${strITEMS_PER_PAGE}=${ITEMS_PER_PAGE}`)
        const response = await this.props.fetchOrDie(url, GET)
        if(response.status === 200) {
            const jsonResponse = await response.json()
            this.setState({cardsList: jsonResponse.result})
        }
        else {
            console.log("Error fetching cards list")
            console.log(response)
        }
    }

    fetchCards = async() => {
        await this.fetchCardsCount()
        if(this.state.totalCards > 0) {
            await this.fetchCardsList()
        }
    }

    createCardsListComponent = () => {
        return <React.Fragment>
            {this.state.cardsList.map((country) => {
                return <li key={country.name}>
                    <Card country={country}/>
                </li>
            })}
        </React.Fragment>
    }

    componentDidMount() {
        this.fetchCards()
    }

    render() {
        return (
            <div>
                <div>
                    <h3>Countries</h3>
                    <div>
                        <div>There are {this.state.totalCards} cards</div>
                        {this.state.totalCards > 0 && <ul>{this.createCardsListComponent()}</ul>}
                    </div>
                </div>
            </div>
        )
    }
}

