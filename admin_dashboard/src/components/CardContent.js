import React from "react"
import {
    HEADING,
    CARD_CONTAINER,
    CARD_CONTENT,
    SUBSECTION,
    SUBHEADING, HOVER_TEXT, BUTTON, PATH_UPDATE
} from "../helper/common"
import "../css/Details.css"


export default class CardContent extends React.Component {

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

    handleEditCard = (e) => {
        e.preventDefault()
        window.location.href = `${PATH_UPDATE}/${this.props.country.id}`
    }

    render() {
        console.log(this.props.country)
        return (
            <article className={CARD_CONTAINER + " " + CARD_CONTENT}>
                <button className={HOVER_TEXT + " " + BUTTON}
                        onClick={this.handleEditCard}>Edit
                </button>
                <h2 className={CARD_CONTENT + " " + HEADING}>{this.props.country.name}</h2>
                <section className={CARD_CONTENT + " " + SUBSECTION}>
                    <h3 className={CARD_CONTENT + " " + SUBHEADING}>Clues</h3>
                    <ol>{this.renderClues()}</ol>
                </section>
                <section className={CARD_CONTENT + " " + SUBSECTION}>
                    <h3 className={CARD_CONTENT + " " + SUBHEADING}>Yes-no Questions and Answers</h3>
                    <ol>{this.renderQAns()}</ol>
                </section>
                <section className={CARD_CONTENT + " " + SUBSECTION}>
                    <h3 className={CARD_CONTENT + " " + SUBHEADING}>Extra Info</h3>
                    <ul>{this.renderMeta()}</ul>
                </section>
            </article>
        )
    }
}

