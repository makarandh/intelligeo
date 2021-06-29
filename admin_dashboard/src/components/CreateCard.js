import React from "react"
import "../css/CreateCard.css"
import {
    BUTTON, BUTTON_CONTAINER,
    CARD_CONTAINER, CLUES, CREATE_CARD, EP_COUNTRY, ERROR_VISIBLE, ERROR_HIDDEN, ERROR_MESSAGE,
    HEADING, NAME, OUTER_CONTAINER, POST, SUBHEADING,
    SUBSECTION, sleep, SUBMIT_MESSAGE
} from "../helper/common"
import CreateCardClues from "./CreateCardClues"
import CreateCardMeta from "./CreateCardMeta"
import CreateCardQA from "./CreateCardQA"


export default class CreateCard extends React.Component {

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

    addLatestItems = () => {
        if(this.state.latestClue && this.state.latestClue !== "") {
            this.setState((prevState) => {
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

    loadFromLocalStorage = (name) => {
        const value = localStorage.getItem(name)
        if(value === null || value === "") {
            return value
        }
        console.log("name: ", name)
        console.log(value)
        return JSON.parse(value)
    }

    clearAllLocalStorage = () => {
        localStorage.removeItem(NAME)
        localStorage.removeItem(CLUES)
        localStorage.removeItem("questionAns")
        localStorage.removeItem("meta")
        localStorage.removeItem("latestQuestion")
        localStorage.removeItem("latestClue")
        localStorage.removeItem("latestAns")
    }

    loadAllFromLocalStorage = () => {
        let name = this.loadFromLocalStorage(NAME)
        if(name === null) {
            name = ""
        }
        let clues = this.loadFromLocalStorage(CLUES)
        if(clues === null) {
            clues = []
        }
        let questionAns = this.loadFromLocalStorage("questionAns")
        if(questionAns === null) {
            questionAns = []
        }
        let meta = this.loadFromLocalStorage("meta")
        if(meta === null) {
            meta = {
                "continent": "",
                "region": ""
            }
        }
        let latestQuestion = this.loadFromLocalStorage("latestQuestion")
        if(latestQuestion === null) {
            latestQuestion = ""
        }
        let latestClue = this.loadFromLocalStorage("latestClue")
        if(latestClue === null) {
            latestClue = ""
        }
        let latestAns = this.loadFromLocalStorage("latestAns")
        if(latestAns === null) {
            latestAns = false
        }
        this.setState({
            name,
            clues,
            questionAns,
            meta,
            latestClue,
            latestQuestion,
            latestAns
        })
    }

    saveToLocalStorage = (name, item) => {
        localStorage.setItem(name, JSON.stringify(item))
    }

    handleSubmit = async(e) => {
        e.preventDefault()
        this.addLatestItems()
        this.setState({
            submitting: true,
            showNotification: false
        })
        document.getElementById(SUBMIT_MESSAGE).innerText = "Submitting card..."
        const requestBody = {
            "name": this.state.name,
            "clues": this.state.clues,
            "question_ans": this.state.questionAns,
            "meta": this.state.meta
        }
        const response = await this.props.fetchOrDie(EP_COUNTRY, POST, requestBody)
        this.setState({
            submitting: false
        })
        if(response.status === 201) {
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
            this.clearAllLocalStorage()
            document.getElementById(SUBMIT_MESSAGE).innerText = "Country added successfully."
            await sleep(5000)
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

    componentDidMount() {
        this.loadAllFromLocalStorage()
    }

    render() {
        return (
            <article className={OUTER_CONTAINER + " " + CREATE_CARD}>
                <form className={CARD_CONTAINER + " " + CREATE_CARD}>
                    <h2 className={HEADING + " " + CREATE_CARD}>Add A New Country</h2>
                    <section className={CREATE_CARD + " " + SUBSECTION + " " + NAME}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING + " " + NAME}>Name:</h3>
                        <input type="text"
                               onChange={this.handleNameChange}
                               value={this.state.name}/>
                    </section>
                    <CreateCardClues setClue={this.setClue}
                                     getClue={this.getClue}
                                     setClues={this.setClues}
                                     getClues={this.getClues}
                                     deleteClue={this.deleteClue}
                                     setLatestClue={this.setLatestClue}
                                     getLatestClue={this.getLatestClue}/>
                    <CreateCardQA setQA={this.setQA}
                                  getQA={this.getQA}
                                  setQAs={this.setQAs}
                                  getQAs={this.getQAs}
                                  deleteQA={this.deleteQA}
                                  setLatestQ={this.setLatestQ}
                                  setLatestA={this.setLatestA}
                                  getLatestQ={this.getLatestQ}
                                  getLatestA={this.getLatestA}/>
                    <CreateCardMeta setContinent={this.setContinent}
                                    getContinent={this.getContinent}
                                    setRegion={this.setRegion}
                                    getRegion={this.getRegion}/>
                    <section className={CREATE_CARD + " " + SUBSECTION + " " + BUTTON_CONTAINER}>
                        <div id={SUBMIT_MESSAGE}
                             className={ERROR_MESSAGE + " " + ((this.state.showNotification || this.state.submitting)
                                                               ? ERROR_VISIBLE
                                                               : ERROR_HIDDEN)}/>
                        <button className={CREATE_CARD + " " + BUTTON}
                                disabled={this.state.submitting}
                                onClick={this.handleSubmit}>Add Card
                        </button>
                    </section>
                </form>
            </article>
        )
    }
}
