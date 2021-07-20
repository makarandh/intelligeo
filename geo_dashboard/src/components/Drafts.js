import React from "react"
import {
    GET,
    get_url,
    intITEMS_PER_PAGE,
    EP_COUNTRIES,
    EP_COUNTRIES_TOTAL, CARDS_LIST_CONTAINER, CARDS_LIST_OUTER,
    ITEMS_PER_PAGE, PAGE_NUM, DRAFT_LIST_HEADING
} from "../helper/common"
import "../css/CardsList.css"
import CardContent from "./CardContent"
import {PageHeading} from "./PageHeading"

export default class Drafts extends React.Component {

    state = {
        page_num: 1,
        totalCards: 0,
        cardsList: []
    }

    fetchCardsCount = async() => {
        const response = await this.props.fetchOrDie(EP_COUNTRIES_TOTAL, GET)
        if(response.status === 200) {
            const jsonResponse = await response.json()
            this.setState({totalCards: jsonResponse.result})
        }
        else {
            console.error("Error fetching total cards")
            console.error(response)
        }
    }

    fetchCardsList = async() => {
        const url = get_url(EP_COUNTRIES,
                            `${PAGE_NUM}=${this.state.page_num}`,
                            `${ITEMS_PER_PAGE}=${intITEMS_PER_PAGE}`)
        const response = await this.props.fetchOrDie(url, GET)
        if(response.status === 200) {
            const jsonResponse = await response.json()
            this.setState({cardsList: jsonResponse.result})
        }
        else {
            console.error("Error fetching cards list")
            console.error(response)
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
                    <CardContent country={country}
                                 fetchOrDie={this.props.fetchOrDie}/>
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
                <PageHeading mainHeading={DRAFT_LIST_HEADING}
                             subHeading={"Cards not yet published. (Total: " + this.state.totalCards + ")"}/>
                <section className={CARDS_LIST_CONTAINER}>
                    {this.state.totalCards > 0 && this.createCardsListComponent()}
                </section>
            </article>
        )
    }
}

