import React from "react"
import "../css/EditCard.css"
import {
    BUTTON, BUTTON_CONTAINER,
    CARD_CONTAINER, CLUES, EDIT_CARD, EP_COUNTRY, ERROR_VISIBLE, ERROR_HIDDEN, ERROR_MESSAGE,
    HEADING, NAME, OUTER_CONTAINER, POST, SUBHEADING,
    SUBSECTION, sleep, SUBMIT_MESSAGE, UPDATE, GET, PATH_HOME, PUT, DELETE
} from "../helper/common"
import EditCardClues from "./EditCardClues"
import EditCardMeta from "./EditCardMeta"
import EditCardQA from "./EditCardQA"


export default class EditCard extends React.Component {

    state = {
        name: "",
        clues: [],
        questionAns: [],
        meta: {
            continent: "",
            region: ""
        },
        latestClue: "",
        latestQuestion: "",
        latestAns: false,
        showNotification: false,
        submitting: false
    }

    getClues = () => {
        return this.state.clues
    }

    setClues = (clues) => {
        this.saveToLocalStorage(CLUES, clues)
        this.setState({clues})
    }

    getClue = (index) => {
        return this.state.clues[index]
    }

    setClue = (index, clue) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), clue, ...prevState.clues.slice(index + 1)]
            this.saveToLocalStorage(CLUES, clues)
            return {clues}
        })
    }

    getLatestClue = () => {
        return this.state.latestClue
    }

    setLatestClue = (latestClue) => {
        this.saveToLocalStorage("latestClue", latestClue)
        this.setState({latestClue})
    }

    deleteClue = (index) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), ...prevState.clues.slice(index + 1)]
            this.saveToLocalStorage(CLUES, clues)
            return {clues}
        })
    }

    getQAs = () => {
        return this.state.questionAns
    }

    setQAs = (questionAns) => {
        this.saveToLocalStorage("questionAns", questionAns)
        this.setState({questionAns})
    }

    getQA = (index) => {
        return this.state.questionAns[index]
    }

    setQA = (index, QA) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const questionAns = [...prevState.questionAns.slice(0, index), QA,
                                 ...prevState.questionAns.slice(index + 1)]
            this.saveToLocalStorage("questionAns", questionAns)
            return {questionAns}
        })
    }

    getLatestQ = () => {
        return this.state.latestQuestion
    }

    getLatestA = () => {
        return this.state.latestAns
    }

    setLatestQ = (latestQuestion) => {
        this.saveToLocalStorage("latestQuestion", latestQuestion)
        this.setState({latestQuestion})
    }

    setLatestA = (latestAns) => {
        this.saveToLocalStorage("latestAns", latestAns)
        this.setState({latestAns})
    }

    deleteQA = (index) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const questionAns = [...prevState.questionAns.slice(0, index), ...prevState.questionAns.slice(index + 1)]
            this.saveToLocalStorage("questionAns", questionAns)
            return {questionAns}
        })
    }

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    getContinent = () => {
        return this.state.meta.continent
    }

    getRegion = () => {
        return this.state.meta.region
    }

    setContinent = (continent) => {
        this.setState((prevState) => {
            const meta = {
                region: prevState.meta.region,
                continent
            }
            this.saveToLocalStorage("meta", meta)
            return {meta}
        })
    }

    setRegion = (region) => {
        this.setState((prevState) => {
            const meta = {
                region,
                continent: prevState.meta.continent
            }
            this.saveToLocalStorage("meta", meta)
            return {meta}
        })
    }

    addLatestItems = async() => {
        if(this.state.latestClue && this.state.latestClue !== "") {
            await this.setState((prevState) => {
                const clues = [...prevState.clues, prevState.latestClue]
                this.saveToLocalStorage(CLUES, clues)
                this.saveToLocalStorage("latestClue", "")
                return {
                    clues,
                    latestClue: ""
                }
            })
        }

        if(this.state.latestQuestion && this.state.latestQuestion !== "") {
            this.setState((prevState) => {
                const latestQA = {
                    "question": prevState.latestQuestion,
                    "ans": prevState.latestAns
                }
                const questionAns = [...prevState.questionAns, latestQA]
                this.saveToLocalStorage("questionAns", questionAns)
                this.saveToLocalStorage("latestQuestion", "")
                this.saveToLocalStorage("latestAns", false)
                return {
                    questionAns,
                    latestQuestion: "",
                    latestAns: false
                }
            })
        }
    }

    handleNameChange = (e) => {
        const name = e.target.value
        this.saveToLocalStorage(NAME, name)
        this.setState({name})
    }

    loadAllFromLocalStorage = (name = "",
                               clues = [],
                               questionAns = [],
                               meta = {},
                               latestQuestion = "",
                               latestClue = "",
                               latestAns = false) => {
        let lname = this.loadFromLocalStorage(NAME)
        if(lname === null) {
            lname = name
        }
        let lclues = this.loadFromLocalStorage(CLUES)
        if(lclues === null) {
            lclues = clues
        }
        let lquestionAns = this.loadFromLocalStorage("questionAns")
        if(lquestionAns === null) {
            lquestionAns = questionAns
        }
        let lmeta = this.loadFromLocalStorage("meta")
        if(lmeta === null) {
            lmeta = meta
        }
        let llatestQuestion = this.loadFromLocalStorage("latestQuestion")
        if(llatestQuestion === null) {
            llatestQuestion = latestQuestion
        }
        let llatestClue = this.loadFromLocalStorage("latestClue")
        if(llatestClue === null) {
            llatestClue = latestClue
        }
        let llatestAns = this.loadFromLocalStorage("latestAns")
        if(llatestAns === null) {
            llatestAns = latestAns
        }
        this.setState({
            name: lname,
            clues: lclues,
            questionAns: lquestionAns,
            meta: lmeta,
            latestClue: llatestClue,
            latestQuestion: llatestQuestion,
            latestAns: llatestAns
        })
    }

    loadFromLocalStorage = (name) => {
        name = `${this.props.operation}.${name}`
        const value = localStorage.getItem(name)
        if(value === null || value === "") {
            return value
        }
        console.log("name: ", name)
        console.log(value)
        return JSON.parse(value)
    }

    saveToLocalStorage = (name, item) => {
        name = `${this.props.operation}.${name}`
        localStorage.setItem(name, JSON.stringify(item))
    }

    clearLocalStorage = (name) => {
        name = `${this.props.operation}.${name}`
        localStorage.removeItem(name)
    }

    clearAllLocalStorage = () => {
        this.clearLocalStorage(NAME)
        this.clearLocalStorage(CLUES)
        this.clearLocalStorage("questionAns")
        this.clearLocalStorage("meta")
        this.clearLocalStorage("latestQuestion")
        this.clearLocalStorage("latestClue")
        this.clearLocalStorage("latestAns")
    }

    handleSubmit = async(e) => {
        e.preventDefault()
        await this.addLatestItems()
        this.setState({
            submitting: true,
            showNotification: false
        })
        document.getElementById(SUBMIT_MESSAGE).innerText = "Submitting card..."
        const requestBody = {
            "name": this.state.name,
            "clues": this.state.clues,
            "question_ans": this.state.questionAns,
            "meta": this.state.meta,
            "id": this.props.countryID
        }
        let method = POST
        let operated = "added"
        if(this.props.operation === UPDATE) {
            method = PUT
            operated = "updated"
        }
        const response = await this.props.fetchOrDie(EP_COUNTRY, method, requestBody)
        this.setState({
            submitting: false
        })
        if(response.status === 201 || response.status === 200) {
            document.getElementById(SUBMIT_MESSAGE).innerText = `Country ${operated} successfully.`
            this.clearAllLocalStorage()
            if(this.props.operation === UPDATE) {
                this.setState({
                    showNotification: true
                })
                await sleep(1000)
                window.location.href = PATH_HOME
            }
            this.setState({
                name: "",
                clues: [],
                questionAns: [],
                meta: {
                    continent: "",
                    region: ""
                },
                latestClue: "",
                latestQuestion: "",
                latestAns: false,
                showNotification: true
            })
            await sleep(2000)
            this.setState({
                showNotification: false
            })
        }
        else {
            const jsonMessage = await response.json()
            const message = jsonMessage.message
            document.getElementById(SUBMIT_MESSAGE).innerText = message
            console.log("Response error: ", message)
            this.setState({
                showNotification: true
            })
        }
    }

    handleUpdateDataLoading = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY}?id=${this.props.countryID}`, GET)

        if(response.status === 404) {
            this.clearAllLocalStorage()
            window.location.href = PATH_HOME
            return
        }
        if(this.loadFromLocalStorage("id") !== this.props.countryID) {
            this.clearAllLocalStorage()
        }
        const jsonData = (await response.json()).result
        console.log(jsonData.name, jsonData.clues, jsonData.question_ans, jsonData.meta)
        this.loadAllFromLocalStorage(jsonData.name, jsonData.clues, jsonData.question_ans, jsonData.meta)
        this.saveToLocalStorage("id", this.props.countryID)
    }

    handleReset = (e) => {
        e.preventDefault()
        this.setState({
            showNotification: false,
            submitting: false
        })
        this.clearAllLocalStorage()
        this.handleUpdateDataLoading()
    }

    handleDelete = async (e) => {
        e.preventDefault()
        const response = await this.props.fetchOrDie(`${EP_COUNTRY}?id=${this.props.countryID}`, DELETE)
        if(response.status === 200) {
            this.clearAllLocalStorage()
            this.setState({
                showNotification: true
            })
            document.getElementById(SUBMIT_MESSAGE).innerText = `Country deleted successfully.`
            await sleep(1000)
            window.location.href = PATH_HOME
        }
        else {
            const jsonMessage = await response.json()
            const message = jsonMessage.message
            document.getElementById(SUBMIT_MESSAGE).innerText = message
            console.log("Response error: ", message)
            this.setState({
                showNotification: true
            })
        }
    }

    componentDidMount() {
        if(this.props.operation === UPDATE) {
            this.handleUpdateDataLoading()
        }
        else {
            this.loadAllFromLocalStorage()
        }
    }

    render() {
        return (
            <article className={OUTER_CONTAINER + " " + EDIT_CARD}>
                <form className={CARD_CONTAINER + " " + EDIT_CARD}>
                    <h2 className={HEADING + " " + EDIT_CARD}>{this.props.heading}</h2>
                    <section className={EDIT_CARD + " " + SUBSECTION + " " + NAME}>
                        <h3 className={EDIT_CARD + " " + SUBHEADING + " " + NAME}>Name</h3>
                        <input type="text"
                               onChange={this.handleNameChange}
                               value={this.state.name}/>
                    </section>
                    <EditCardClues setClue={this.setClue}
                                   getClue={this.getClue}
                                   setClues={this.setClues}
                                   getClues={this.getClues}
                                   deleteClue={this.deleteClue}
                                   setLatestClue={this.setLatestClue}
                                   getLatestClue={this.getLatestClue}/>
                    <EditCardQA setQA={this.setQA}
                                getQA={this.getQA}
                                setQAs={this.setQAs}
                                getQAs={this.getQAs}
                                deleteQA={this.deleteQA}
                                setLatestQ={this.setLatestQ}
                                setLatestA={this.setLatestA}
                                getLatestQ={this.getLatestQ}
                                getLatestA={this.getLatestA}/>
                    <EditCardMeta setContinent={this.setContinent}
                                  getContinent={this.getContinent}
                                  setRegion={this.setRegion}
                                  getRegion={this.getRegion}/>
                    <section className={EDIT_CARD + " " +
                                        SUBSECTION + " " +
                                        BUTTON_CONTAINER + " " +
                                        (this.props.operation === UPDATE ? UPDATE : "")}>
                        <div id={SUBMIT_MESSAGE}
                             className={ERROR_MESSAGE + " " + ((this.state.showNotification || this.state.submitting)
                                                               ? ERROR_VISIBLE
                                                               : ERROR_HIDDEN)}/>
                        {
                            this.props.operation === UPDATE
                            && <button className={EDIT_CARD + " " + BUTTON + " undo"}
                                       onClick={this.handleReset}>Undo Changes
                            </button>
                        }
                        <button className={EDIT_CARD + " " + BUTTON + " submit"}
                                disabled={this.state.submitting || this.state.name === ""}
                                onClick={this.handleSubmit}>{this.props.buttonTitle}
                        </button>
                        {
                            this.props.operation === UPDATE
                            && <button className={EDIT_CARD + " " + BUTTON + " delete"}
                                       onClick={this.handleDelete}>Delete Country
                            </button>
                        }
                    </section>
                </form>
            </article>
        )
    }
}
