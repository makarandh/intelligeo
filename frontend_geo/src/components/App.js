import "../css/App.css"
import React from "react"
import {EP_RAND_LIST, GAME_LENGTH, MAIN, MAIN_URL, POST, SECTION} from "../helper/common"
import Card from "./Card"
import Loading from "./Loading"


export default class App extends React.Component {

    state = {
        countryList: []
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

    fetchCountryList = async() => {
        const body = {
            "count": GAME_LENGTH
        }
        const response = await this.postData(body, EP_RAND_LIST)
        if(response.status !== 200) {
            console.error("Couldn't fetch country list")
            console.error(response)
            return
        }
        if(response.json.count !== GAME_LENGTH) {
            console.error(`Requested ${GAME_LENGTH} cards, server sent ${response.json.count}`)
        }
        this.setState({countryList: response.json.result})
    }

    componentDidMount() {
        this.fetchCountryList()
    }

    render() {
        return (
            <article className={MAIN}>
                {(this.state.countryList.length > 0)
                 ? <section className={SECTION}>
                     <Card/>
                 </section>
                 : <Loading width={9} height={2}/>
                }
            </article>
        )
    }
}
