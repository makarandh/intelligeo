import React from "react"
import {
    AUTH_ERROR,
    ERROR_HIDDEN, ERROR_HIGHLIGHT,
    ERROR_VISIBLE,
    LOGIN,
    MAIN_URL,
    NETWORK_ERROR,
    PASSWORD,
    POST,
    SERVER_ERROR, TEXT,
    UNKNOWN_ERROR,
    USERNAME
} from "../helper/common"
import "../css/Login.css"


export class Login extends React.Component {

    state = {
        username: "",
        password: "",
        displayUserError: false,
        displayPassError: false,
        attemptingLogin: false,
        errorMessage: null
    }

    postData = async(body = {}, endpoint = "") => {
        const url = MAIN_URL + "/" + endpoint
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

    hideError = (element) => {
        element.classList.remove(ERROR_VISIBLE)
        element.classList.add(ERROR_HIDDEN)
    }

    handleOnChange = (e) => {
        if(e.target.id === USERNAME) {
            this.setState({username: e.target.value}, this.checkUsernameEmpty)
        }
        if(e.target.id === PASSWORD) {
            this.setState({password: e.target.value}, this.checkPasswordEmpty)
        }
    }

    checkUsernameEmpty = () => {
        if(this.state.username === "") {
            this.setState({displayUserError: true})
            return true
        }
        this.setState({displayUserError: false})
        return false
    }

    checkPasswordEmpty = () => {
        if(this.state.password === "") {
            this.setState({displayPassError: true})
            return true
        }
        this.setState({displayPassError: false})
        return false
    }

    handleLoginSubmit = async(e) => {
        e.preventDefault()
        let error = false
        if(this.checkUsernameEmpty()) {
            this.setState({errorMessage: null})
            error = true
        }
        if(this.checkPasswordEmpty() || error) {
            this.setState({errorMessage: null})
            return
        }

        const body = {
            username: this.state.username,
            password: this.state.password
        }

        try {
            const result = await this.postData(body, LOGIN)
            switch(result.status) {
                case 200:
                    this.props.setRT(result.json.refresh_token)
                    this.props.setAT(result.json.access_token)
                    this.setState({errorMessage: null})
                    this.props.setLoginState(true)
                    break
                case 401:
                    this.setState({errorMessage: AUTH_ERROR})
                    break
                case 500:
                    this.setState({errorMessage: SERVER_ERROR})
                    break
                default:
                    this.setState({errorMessage: UNKNOWN_ERROR})
                    break
            }
        }
        catch(e) {
            console.log(`An error with name: ${e.name} occurred submitting the login form ${e.message}`)
            this.setState({errorMessage: NETWORK_ERROR})
        }
    }

    render() {
        return (
            <div id="outer_container">
                <form id="login-form">
                    <div className="form_heading">Log in</div>
                    <div className="input_container username">
                        <input className={"form_item form_item_0 " + (this.state.displayUserError && ERROR_HIGHLIGHT)}
                               id={USERNAME}
                               type={TEXT}
                               value={this.state.username}
                               onChange={this.handleOnChange}
                               autoFocus={this.state.displayUserError}
                               placeholder={USERNAME}/>
                        <div className={"error_message username "
                                        + (this.state.displayUserError
                                           ? ERROR_VISIBLE
                                           : ERROR_HIDDEN)}>Username cannot be blank
                        </div>
                    </div>
                    <div className="input_container password">
                        <input className={"form_item form_item_1 " + (this.state.displayPassError && ERROR_HIGHLIGHT)}
                               type={PASSWORD}
                               id={PASSWORD}
                               value={this.state.password}
                               onChange={this.handleOnChange}
                               autoFocus={this.state.displayPassError && (!this.state.displayUserError)}
                               placeholder={PASSWORD}/>
                        <div className={"error_message password "
                                        + (this.state.displayPassError
                                           ? ERROR_VISIBLE
                                           : ERROR_HIDDEN)}>Password cannot be blank
                        </div>
                    </div>
                    <button className="form_item form_item_2 button login"
                            id="submit_button"
                            disabled={this.state.displayPassError || this.state.displayUserError}
                            type={"submit"}
                            onClick={this.handleLoginSubmit}>{this.state.attemptingLogin ? "Logging in..." : "Submit"}
                    </button>
                    <div className={"error_message generic_error "
                                    + (this.state.errorMessage
                                       ? ERROR_VISIBLE
                                       : ERROR_HIDDEN)}>{this.state.errorMessage}</div>
                </form>
            </div>
        )
    }
}
