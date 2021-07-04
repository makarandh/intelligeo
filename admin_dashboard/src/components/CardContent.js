import React from "react"
import {
    HEADING,
    CARD_CONTAINER,
    CARD_CONTENT,
    SUBSECTION,
    SUBHEADING, HOVER_TEXT, BUTTON, PATH_UPDATE, EP_COUNTRY_IMAGE, GET
} from "../helper/common"
import "../css/CardContent.css"


export default class CardContent extends React.Component {

    state = {
        imageURL: null
    }

    fetchImage = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY_IMAGE}?id=${this.props.country.id}`, GET)
        if(response.status === 200) {
            const imageBlob = await response.blob()
            const imageURL = URL.createObjectURL(imageBlob)
            console.log(imageURL)
            this.setState({
                imageURL
            })
        }
    }

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

    componentDidMount() {
        this.fetchImage()
    }

    render() {
        return (
            <article className={CARD_CONTAINER + " " + CARD_CONTENT}>
                <button className={HOVER_TEXT + " " + BUTTON}
                        onClick={this.handleEditCard}>Edit
                </button>
                <h2 className={CARD_CONTENT + " " + HEADING}>{this.props.country.name}</h2>
                {
                    this.state.imageURL &&
                    <section className={CARD_CONTENT + " " + SUBSECTION}>
                        <img src={this.state.imageURL} alt="country"/>
                    </section>
                }
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

