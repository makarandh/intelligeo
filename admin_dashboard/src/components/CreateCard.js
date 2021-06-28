import React from "react"
import "../css/CreateCard.css"
import {
    BUTTON, BUTTON_CONTAINER,
    CARD_CONTAINER, CREATE_CARD,
    HEADING, OUTER_CONTAINER,
    SUB_SUBHEADING, SUB_SUBHEADING_CONTAINER,
    SUBHEADING, SUBSECTION
} from "../helper/common"
import CreateCardClues from "./CreateCardClues"
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
        latestAns: false
    }

    getClues = () => {
        return this.state.clues
    }

    setClues = (clues) => {
        this.setState({clues})
    }

    getClue = (index) => {
        return this.state.clues[index]
    }

    setClue = (index, clue) => {
        this.setState((prevState) => {
            const newClues = [...prevState.clues.slice(0, index), clue, ...prevState.clues.slice(index + 1)]
            return {clues: newClues}
        })
    }

    getLatestClue = () => {
        return this.state.latestClue
    }

    setLatestClue = (latestClue) => {
        this.setState({latestClue})
    }

    deleteClue = (index) => {
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), ...prevState.clues.slice(index + 1)]
            return {clues}
        })
    }

    getQAs = () => {
        return this.state.questionAns
    }

    setQAs = (questionAns) => {
        this.setState({questionAns})
    }

    getQA = (index) => {
        return this.state.questionAns[index]
    }

    setQA = (index, QA) => {
        console.log(QA)
        console.log(index)
        const newQAs = [...this.state.questionAns.slice(0, index), QA, ...this.state.questionAns.slice(index + 1)]
        console.log("newQAs:")
        console.log(newQAs)
        console.log("State:")
        console.log(this.state.questionAns)
        this.setState((prevState) => {
            const newQAs = [...prevState.questionAns.slice(0, index), QA, ...prevState.questionAns.slice(index + 1)]
            return {questionAns: newQAs}
        })
    }

    getLatestQ = () => {
        return this.state.latestQuestion
    }

    getLatestA = () => {
        return this.state.latestAns
    }

    setLatestQ = (latestQuestion) => {
        this.setState({latestQuestion})
    }

    setLatestA = (latestAns) => {
        this.setState({latestAns})
    }

    deleteQA = (index) => {
        this.setState((prevState) => {
            const questionAns = [...prevState.questionAns.slice(0, index), ...prevState.questionAns.slice(index + 1)]
            return {questionAns}
        })
    }

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    handleContinentChange = (e) => {
        const continent = e.target.value
        this.setState((prevState) => ({

            meta: {
                region: prevState.meta.region,
                continent
            }
        }))
    }

    handleRegionChange = (e) => {
        const region = e.target.value
        this.setState((prevState) => ({

            meta: {
                region,
                continent: prevState.meta.continent
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <article className={OUTER_CONTAINER + " " + CREATE_CARD}>
                <form className={CARD_CONTAINER + " " + CREATE_CARD}>
                    <h2 className={HEADING + " " + CREATE_CARD}>Add A New Country</h2>

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

                    <section className={CREATE_CARD + " " + SUBSECTION}>
                        <h3 className={CREATE_CARD + " " + SUBHEADING}>Extra Info</h3>
                        <ul>
                            <li key={"continent"}>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Continent: </label>
                                    <input type="text"
                                           onChange={this.handleContinentChange}
                                           value={this.state.meta.continent}/>
                                </div>
                            </li>
                            <li key={"region"}>
                                <div className={CREATE_CARD + " " + SUB_SUBHEADING_CONTAINER}>
                                    <label className={CREATE_CARD + " " + SUB_SUBHEADING}>Region: </label>
                                    <input type="text"
                                           onChange={this.handleRegionChange}
                                           value={this.state.meta.region}/>
                                </div>
                            </li>
                        </ul>
                    </section>
                    <section className={CREATE_CARD + " " + SUBSECTION + " " + BUTTON_CONTAINER}>
                        <button className={CREATE_CARD + " " + BUTTON}
                                onClick={this.handleSubmit}>Add Card
                        </button>
                    </section>
                </form>
            </article>
        )
    }
}
