import React from "react"
import {
    GET,
    get_url,
    intITEMS_PER_PAGE,
    PATH_COUNTRIES,
    PATH_COUNTRIES_TOTAL, CARDS_LIST_CONTAINER, CARDS_LIST_OUTER,
    ITEMS_PER_PAGE, PAGE_NUM
} from "../helper/common"
import Details from "./Details"
import "../css/CardsList.css"
import {PageHeading} from "./PageHeading"

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
            `${PAGE_NUM}=${this.state.page_num}`,
            `${ITEMS_PER_PAGE}=${intITEMS_PER_PAGE}`)
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
                return <div key={country.name}>
                    <Details country={country}/>
                </div>
            })}
        </React.Fragment>
    }

    componentDidMount() {
        this.fetchCards()
    }

    render() {
        return (
            <article className={CARDS_LIST_OUTER}>
                <PageHeading mainHeading={"Countries"}
                             subHeading={"You have " + this.state.totalCards + " cards."}/>
                <section className={CARDS_LIST_CONTAINER}>
                    {this.state.totalCards > 0 && this.createCardsListComponent()}
                </section>
            </article>
        )
    }
}

