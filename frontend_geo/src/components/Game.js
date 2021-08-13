import React from "react"
import {
    CARD, COUNTRIESLIST, EP_COUNTRY,
    EP_RAND_LIST, GET,
    INPROGRESS, INDEX, LOADING_SCREEN_CONTAINER,
    GAME_MAIN_CONTAINER, MAIN_URL, POST, SECTION,
    TOTALCORRECT, TOTALSCORE,
    sleep, ROUTE_NEW_GAME, NETWORK_ERROR_CONTAINER, NETWORK_ERROR, ERROR_MESSAGE, BUTTON
} from "../helper/common"
import Card from "./Card"
import EndGame from "./EndGame"
import ErrorBoundary from "./ErrorBoundary"
import Loading from "./Loading"


export default class Game extends React.Component {

    state = {
        countriesList: [],
        index: 0,
        networkError: false,
        totalCorrect: 0,
        totalScore: 0,
        inProgress: false
    }

    incrementCorrect = async() => {
        await this.setState((prevState) => {
            return {totalCorrect: prevState.totalCorrect + 1}
        }, () => {
            this.props.saveToLocalStorage(TOTALCORRECT, this.state.totalCorrect)
        })
    }

    lastCard = () => {
        return (this.state.index + 1) === this.state.countriesList.length
    }

    updateTotalScore = async(score) => {
        await this.setState((prevState) => {
            return {totalScore: prevState.totalScore + score}
        }, () => {
            this.props.saveToLocalStorage(TOTALSCORE, this.state.totalScore)
        })
    }

    loadCard = async(increment) => {
        if(increment) {
            await this.setState((prevState) => {
                return {index: prevState.index + 1}
            }, () => {
                this.props.saveToLocalStorage(INDEX, this.state.index)
            })
        }
    }

    resetGame = async(newGame = false) => {
        await this.setState(
            {
                countriesList: [],
                index: 0,
                networkError: false,
                totalCorrect: 0,
                totalScore: 0
            })
        this.props.clearAllLocalStorage()
        if(newGame) {
            window.location.reload()
            return
        }
        window.location.href = ROUTE_NEW_GAME
    }

    getCountryIDName = async() => {
        if(this.state.index >= this.state.countriesList.length) {
            return false
        }
        return (this.state.countriesList[this.state.index])
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
            if(response.status === 500) {
                this.setNetworkError()
                return
            }
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
        const response = await this.fetchCardsList(this.props.gameLength)
        if(response && response.status === 200) {
            const countriesList = response.json.result
            console.log(countriesList)
            await this.setState({countriesList})
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
            console.log(json)
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
            await sleep(20)
            this.refreshPage()
        }
    }

    loadFromLocalStorage = (name) => {
        const value = localStorage.getItem(name)
        if(value === null || value === "") {
            return value
        }
        return JSON.parse(value)
    }

    loadGameFromLocalStorage = async() => {
        try {
            const countriesLS = await this.loadFromLocalStorage(COUNTRIESLIST)
            console.log(countriesLS)
            if(!countriesLS || !Array.isArray(countriesLS) || countriesLS.length === 0) {
                return false
            }
            let countriesList = countriesLS.map((element) => {
                return {"id": element.id, "name": element.name}
            })
            const index = await parseInt(this.loadFromLocalStorage(INDEX))
            const totalCorrect = await parseInt(this.loadFromLocalStorage(TOTALCORRECT))
            const totalScore = await parseInt(this.loadFromLocalStorage(TOTALSCORE))
            await this.setState(
                {
                    countriesList,
                    index,
                    totalCorrect,
                    totalScore
                })
            return true
        }
        catch(e) {
            console.error("Could not load game from local storage")
            console.error(e)
            return false
        }
    }

    loadGameState = async() => {
        const inProgress = this.loadFromLocalStorage(INPROGRESS)
        if(inProgress !== null && inProgress === true) {
            console.log("loading from local storage")
            await this.setState({inProgress: true})
            const status = await this.loadGameFromLocalStorage()
            if(status) {
                return
            }
        }
        await this.setState({inProgress: false})
        await this.fetchCountries()
        await this.saveGameState()
    }

    saveGameState = async() => {
        this.props.saveToLocalStorage(COUNTRIESLIST, this.state.countriesList)
        this.props.saveToLocalStorage(INDEX, this.state.index)
        this.props.saveToLocalStorage(TOTALCORRECT, this.state.totalCorrect)
        this.props.saveToLocalStorage(TOTALSCORE, this.state.totalScore)
        this.props.saveToLocalStorage(INPROGRESS, true)
    }

    setNetworkError = async() => {
        await this.setState({networkError: true})
    }

    componentDidMount() {
        this.loadGameState()
    }

    render() {
        return (
            <article className={GAME_MAIN_CONTAINER}>
                <ErrorBoundary>
                    {this.state.networkError
                     ? (<article className={NETWORK_ERROR_CONTAINER}>
                            <div className={ERROR_MESSAGE}>{NETWORK_ERROR}</div>
                            <button className={BUTTON}
                                    onClick={this.refreshPage}>Refresh Page
                            </button>
                        </article>)
                     : (this.state.countriesList.length > 0
                        ? <section className={SECTION + " " + CARD}>
                            {(this.state.index < this.state.countriesList.length
                              ? <Card getCountryIDName={this.getCountryIDName}
                                      fetchCountry={this.fetchCountry}
                                      incrementCorrect={this.incrementCorrect}
                                      totalScore={this.state.totalScore}
                                      updateTotalScore={this.updateTotalScore}
                                      fetchCountryList={this.fetchCardsList}
                                      loadFromLocalStorage={this.loadFromLocalStorage}
                                      saveToLocalStorage={this.props.saveToLocalStorage}
                                      resetGame={this.resetGame}
                                      gameLength={this.state.countriesList.length}
                                      lastCard={this.lastCard}
                                      index={this.state.index}
                                      setNetworkError={this.setNetworkError}
                                      loadCard={this.loadCard}/>
                              : <EndGame resetGame={this.resetGame}
                                         gameLength={this.props.gameLength}
                                         totalScore={this.state.totalScore}
                                         clearAllLocalStorage={this.props.clearAllLocalStorage}
                                         totalCorrect={this.state.totalCorrect}/>
                            )}
                        </section>
                        : <div className={LOADING_SCREEN_CONTAINER}>
                            <span>Loading</span>
                            <Loading width={9} height={2}/>
                        </div>)
                    }
                </ErrorBoundary>
            </article>
        )
    }
}
