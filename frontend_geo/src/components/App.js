import "../css/App.css"
import React from "react"
import {
    BUTTON, CARD, EP_COUNTRY,
    EP_RAND_LIST, ERROR_MESSAGE,
    GAME_LENGTH, GET, LOADING_SCREEN_CONTAINER,
    MAIN,
    MAIN_URL,
    NETWORK_ERROR,
    NETWORK_ERROR_CONTAINER,
    POST,
    SECTION, sleep
} from "../helper/common"
import Card from "./Card"
import Loading from "./Loading"


export default class App extends React.Component {

    state = {
        countryList: [],
        index: 0,
        networkError: false
    }

    setNextCard = () => {
        this.setState((prevState) => {
            const index = prevState.index + 1
            if(index >= this.state.countryList.length) {
                console.log("Reached the end of the game.")
                return {index: -1}
            }
            return {index: prevState.index + 1}
        })
    }

    getCountryIDName = () => {
        if(this.state.index === -1 || this.state.index >= this.state.countryList.length) {
            console.log("End of game. Setting country id = -1")
            return -1
        }
        return (this.state.countryList[this.state.index])
    }

    postData = async(body = {}, endpoint = "") => {
        const url = MAIN_URL + endpoint
        const response = await fetch(url, {
            method: POST,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const json = await response.json()
        const status = await response.status
        return {
            json,
            status
        }
    }

    fetchCardsList = async(listLength, exclude = null) => {
        let body = {
            "count": listLength
        }
        if(exclude) {
            body.exclude = exclude
        }
        try {
            const response = await this.postData(body, EP_RAND_LIST)
            if(response.status !== 200) {
                console.error("Couldn't fetch cards list")
                console.error(response)
            }
            else if(response.json.count !== listLength) {
                console.error(`Requested ${listLength} cards, server sent ${response.json.count}`)
            }
            // console.log(response.json.result.map(element => element.name))
            const status = response.status
            const json = response.json
            return {
                "status": status,
                "json": json
            }
        }
        catch(e) {
            console.error("The following error occurred:")
            console.error(e)
            this.setState({networkError: true}, this.autoRefresh)
            return false
        }
    }

    fetchCountries = async() => {
        const response = await this.fetchCardsList(GAME_LENGTH)
        if(response && response.status === 200) {
            this.setState({countryList: response.json.result})
        }
    }

    fetchCountry = async(countryID) => {
        const url = MAIN_URL + EP_COUNTRY + `/${countryID}`

        try {
            const response = await fetch(url, {
                method: GET,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const json = await response.json()
            const status = await response.status
            return {
                json,
                status
            }
        }
        catch(e) {
            console.error("The following error happened fetching country " + countryID)
            console.error(e)
            return false
        }
    }

    refreshPage = () => {
        window.location.reload(true)
    }

    autoRefresh = async() => {
        if(this.state.networkError) {
            await sleep(10)
            this.refreshPage()
        }
    }

    componentDidMount() {
        this.fetchCountries()
    }

    render() {
        return (
            <article className={MAIN}>
                {(this.state.networkError) ?
                 <article className={NETWORK_ERROR_CONTAINER}>
                     <div className={ERROR_MESSAGE}>{NETWORK_ERROR}</div>
                     <button className={BUTTON}
                             onClick={this.refreshPage}>Refresh Page
                     </button>
                 </article> :
                 ((this.state.countryList.length > 0)
                  ? <section className={SECTION + " " + CARD}>
                      <Card getCountryIDName={this.getCountryIDName}
                            fetchCountry={this.fetchCountry}
                            fetchCountryList={this.fetchCardsList}
                            setNextCard={this.setNextCard}/>
                  </section>
                  : <div className={LOADING_SCREEN_CONTAINER}>
                      <span>Loading</span>
                      <Loading width={9} height={2}/>
                  </div>
                 )}
            </article>
        )
    }
}
