import "../css/App.css"
import React from "react"
import {
    BUTTON, CARD, EP_COUNTRY,
    EP_RAND_LIST, ERROR_MESSAGE,
    GAME_LENGTH, GET, LOADING_SCREEN_CONTAINER,
    MAIN, MAIN_URL,
    NETWORK_ERROR,
    NETWORK_ERROR_CONTAINER,
    POST, SECTION, sleep
} from "../helper/common"
import Card from "./Card"
import EndGame from "./EndGame"
import Loading from "./Loading"


export default class App extends React.Component {

    state = {
        countryList: [],
        index: 0,
        networkError: false,
        totalCorrect: 0,
        totalScore: 0
    }

    incrementCorrect = async () => {
        await this.setState((prevState) => {
            return {totalCorrect: prevState.totalCorrect + 1}
        })
    }

    updateTotalScore = async (score) => {
        await this.setState((prevState) => {
            return {totalScore: prevState.totalScore + score}
        })
    }

    goToNextCard = async(increment) => {
        if(increment) {
            await this.setState((prevState) => {
                return {index: prevState.index + 1}
            })
        }
    }

    resetGame = async() => {
        await this.setState(
            {
                countryList: [],
                index: 0,
                networkError: false,
                totalCorrect: 0,
                totalScore: 0
            })
        await this.fetchCountries()
    }

    getCountryIDName = async() => {
        if(this.state.index >= this.state.countryList.length) {
            return {}
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
            await this.setState({networkError: true}, this.autoRefresh)
            return false
        }
    }

    fetchCountries = async() => {
        const response = await this.fetchCardsList(GAME_LENGTH)
        if(response && response.status === 200) {
            this.setState({countryList: response.json.result}, () => {
                console.log(this.state.countryList.map((element) => {
                    return element.name
                }))
            })
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
                      {this.state.index < this.state.countryList.length
                       ? < Card getCountryIDName={this.getCountryIDName}
                                fetchCountry={this.fetchCountry}
                                incrementCorrect={this.incrementCorrect}
                                totalScore={this.state.totalScore}
                                updateTotalScore={this.updateTotalScore}
                                fetchCountryList={this.fetchCardsList}
                                goToNextCard={this.goToNextCard}/>
                       : <EndGame resetGame={this.resetGame}
                                  totalScore={this.state.totalScore}
                                  totalCorrect={this.state.totalCorrect}/>
                      }
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
