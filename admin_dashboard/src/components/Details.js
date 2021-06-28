import React from "react"
import {
    HEADING,
    CARD_CONTAINER,
    DETAILS,
    SUBSECTION,
    SUBHEADING
} from "../helper/common"
import "../css/Details.css"


export default class Details extends React.Component {

    renderClues = () => {
        return <React.Fragment>
            {this.props.country.clues.map((clue) => {
                return <li key={clue}>{clue}</li>
            })}
        </React.Fragment>
    }

    renderMeta = () => {
        return <React.Fragment>
            <li>Continent: {this.props.country.meta.continent}</li>
            <li>Region: {this.props.country.meta.region} </li>
        </React.Fragment>
    }

    renderQAns = () => {
        return <React.Fragment>
            {this.props.country.question_ans.map((qAns) => {
                return <li key={qAns.question}>
                    {qAns.question} ({qAns.ans ? <strong>Yes</strong> : <strong>No</strong>})
                </li>
            })}
        </React.Fragment>
    }

    render() {
        return (
            <article className={CARD_CONTAINER + " " + DETAILS}>
                <h2 className={DETAILS + " " + HEADING}>{this.props.country.name}</h2>
                <section className={DETAILS + " " + SUBSECTION}>
                    <h3 className={DETAILS + " " + SUBHEADING}>Clues</h3>
                    <ol>{this.renderClues()}</ol>
                </section>
                <section className={DETAILS + " " + SUBSECTION}>
                    <h3 className={DETAILS + " " + SUBHEADING}>Yes-no Questions and Answers</h3>
                    <ol>{this.renderQAns()}</ol>
                </section>
                <section className={DETAILS + " " + SUBSECTION}>
                    <h3 className={DETAILS + " " + SUBHEADING}>Extra Info</h3>
                    <ul>{this.renderMeta()}</ul>
                </section>
            </article>
        )
    }
}

