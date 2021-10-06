import React from "react"
import "../css/App.css"
import ErrorBoundary from "./ErrorBoundary"
import Footer from "./Footer"
import {Login} from "./Login"
import {
    APP_CONTENT,
    BUTTON,
    ERROR_MESSAGE,
    GET,
    LOGGED_IN_COOKIE,
    MAIN_URL,
    NETWORK_ERROR,
    NETWORK_ERROR_CONTAINER, sleep, USERNAME
} from "../helper/common"
import {MainRouter} from "./MainRouter"


export default class App extends React.Component {

    state = {
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        networkError: false,
        loggedInCookieSet: false,
        username: ""
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
        this.setState({
                          loggedIn
                      })
        this.setLoginCookie(loggedIn)
    }

    setUsername = (username) => {
        localStorage.setItem(USERNAME, username)
        this.setState({username})
    }

    getUsername = async() => {
        let username = this.state.username
        if(!username) {
            username = localStorage.getItem(USERNAME)
        }
        if(!username) {
            let response = await this.fetchOrDie("/username", GET)
            if(!response || response.status !== 200) {
                return false
            }
            response = await response.json()
            username = await response.result
        }
        return username
    }

    sessionReset = () => {
        this.setState({
                          refreshToken: null,
                          accessToken: null,
                          loggedIn: false
                      })
        localStorage.removeItem("rt")
        localStorage.removeItem("at")
        localStorage.removeItem(USERNAME)
        this.setLoginCookie(false)
    }

    getHeaders = (token, formdata = false, method) => {
        if(method === GET || formdata) {
            return {
                "Authorization": `Bearer ${token}`
            }
        }
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    getRequest = (method, token, body = null, formdata = false) => {
        if((!formdata) && body) {
            body = JSON.stringify(body)
        }
        return {
            method,
            headers: this.getHeaders(token, formdata, method),
            body
        }
    }

    getNewAT = async() => {
        if(!this.state.refreshToken) {
            console.error("Cannot get a new access token without a refresh token.")
            return
        }
        try {
            const request = this.getRequest(GET, this.state.refreshToken)
            const response = await fetch(MAIN_URL + "/refresh", request)
            const responseJson = await response.json()
            if(response.status === 401) {
                this.sessionReset()
            }
            if(response.status !== 200) {
                console.error("Response status: " + response.status)
                console.error(responseJson)
            }
            const accessToken = await responseJson.access_token
            this.setAT(accessToken)
        }
        catch(e) {
            console.error("Exception fetching access token " + e)
            this.setState({networkError: true}, () => {
                this.autoRefresh()
            })
        }
    }

    fetchOrDie = async(endpoint = null, method = null, body = null, formdata = false, secondTry = false) => {
        if(endpoint === null || method === null) {
            return false
        }
        if(!this.state.accessToken && !this.getAT()) {
            await this.getNewAT()
        }
        try {
            const request = this.getRequest(method, this.state.accessToken, body, formdata)
            let response = await fetch(MAIN_URL + endpoint, request)
            if(response.status === 401) {
                if(secondTry) {
                    this.sessionReset()
                    return false
                }
                await this.getNewAT()
                return await this.fetchOrDie(endpoint, method, body, formdata, true)
            }
            return response
        }
        catch(e) {
            console.error("Exception fetching request " + e)
            this.setState({networkError: true}, this.autoRefresh)
            return false
        }
    }

    componentDidMount() {
        this.setLoginState(this.getRT())
    }

    refreshPage = () => {
        window.location.reload(true)
    }

    setLoginCookie = (value) => {
        value = (value ? "true" : "false")
        document.cookie = `${LOGGED_IN_COOKIE}=${value}; SameSite=Strict; path=/`
        this.setState({loggedInCookieSet: value})
    }

    autoRefresh = async() => {
        if(this.state.networkError) {
            await sleep(10)
            this.refreshPage()
        }
    }

    render() {
        return (
            <div className="app">

                <div className={APP_CONTENT}>
                    <ErrorBoundary>
                        {
                            (this.state.loggedIn && this.state.loggedInCookieSet) ?
                            (
                                this.state.networkError ?
                                <article className={NETWORK_ERROR_CONTAINER}>
                                    <div className={ERROR_MESSAGE}>{NETWORK_ERROR}</div>
                                    <button className={BUTTON}
                                            onClick={this.refreshPage}>Refresh Page
                                    </button>
                                </article> :
                                <MainRouter getUsername={this.getUsername}
                                            logout={this.sessionReset}
                                            fetchOrDie={this.fetchOrDie}/>
                            ) :
                            <Login setRT={this.setRT}
                                   setAT={this.setAT}
                                   setUsername={this.setUsername}
                                   setLoginState={this.setLoginState}/>
                        }
                    </ErrorBoundary>
                </div>
                <Footer/>
            </div>
        )
    }
}
