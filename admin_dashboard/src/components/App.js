import React from "react"
import "../css/App.css"
import ErrorBoundary from "./ErrorBoundary"
import {Login} from "./Login"
import {GET, MAIN_URL, NETWORK_ERROR} from "../helper/common"
import {MainRouter} from "./MainRouter"


export default class App extends React.Component {

    state = {
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        networkError: false
    }

    setNetworkError = () => {
        this.setState({networkError: true})
    }

    getRT = () => {
        const rt = localStorage.getItem("rt")
        if(rt) {
            this.setState({refreshToken: rt})
            if(!this.state.accessToken) {
                return this.getAT()
            }
            return true
        }
        return false
    }

    getAT = () => {
        const at = localStorage.getItem("at")
        if(at) {
            this.setState({accessToken: at})
            return true
        }
        return false
    }

    setRT = (refreshToken) => {
        localStorage.setItem("rt", refreshToken)
        this.setState({refreshToken})
    }

    setAT = (accessToken) => {
        localStorage.setItem("at", accessToken)
        this.setState({accessToken})
    }

    setLoginState = (loggedIn) => {
        this.setState({loggedIn})
    }

    sessionReset = () => {
        this.setState({
            refreshToken: null,
            accessToken: null,
            loggedIn: false
        })
        localStorage.removeItem("rt")
        localStorage.removeItem("at")
    }

    getHeaders = (token) => {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    getRequest = (method, token, body = null) => {
        if(body) {
            body = JSON.stringify(body)
        }
        return {
            method,
            headers: this.getHeaders(token),
            body
        }
    }

    getNewAT = async() => {
        if(!this.state.refreshToken) {
            console.log("Cannot get a new access token without a refresh token.")
            return
        }
        try {
            const request = this.getRequest(GET, this.state.refreshToken)
            const response = await fetch(MAIN_URL + "/refresh", request)
            if(response.status === 401) {
                this.sessionReset()
            }
            if(response.status !== 200) {
                console.log("Response status: " + response.status)
            }
            const json = await response.json()
            const accessToken = await json.access_token
            this.setAT(accessToken)
        }
        catch(e) {
            console.log("Exception fetching access token " + e)
            this.setState({networkError: true})
        }
    }

    fetchOrDie = async(endpoint, method, body = null, secondTry = false) => {
        if(!this.state.accessToken && !this.getAT()) {
            await this.getNewAT()
        }
        try {
            const request = this.getRequest(method, this.state.accessToken, body)
            let response = await fetch(MAIN_URL + endpoint, request)
            console.log(response)
            if(response.status === 401) {
                if(secondTry) {
                    this.sessionReset()
                    return false
                }
                await this.getNewAT()
                return await this.fetchOrDie(endpoint, method, body, true)
            }
            return response
        }
        catch(e) {
            console.log("Exception fetching access token " + e)
            this.setState({networkError: true})
            return false
        }
    }

    componentDidMount() {
        this.setLoginState(this.getRT())
    }

    refreshPage = () => {
        window.location.reload(true)
    }

    render() {
        return (
            <div className="app">
                <ErrorBoundary>
                    {
                        this.state.loggedIn ?
                        (
                            this.state.networkError ?
                            <div>
                                <div>{NETWORK_ERROR}</div>
                                <div>
                                    <button onClick={this.refreshPage}>Refresh Page</button>
                                </div>
                            </div> :
                            <MainRouter logout={this.sessionReset}
                                        fetchOrDie={this.fetchOrDie}/>
                        ) :
                        <Login setRT={this.setRT}
                               setAT={this.setAT}
                               setLoginState={this.setLoginState}/>
                    }
                </ErrorBoundary>
            </div>
        )
    }
}
