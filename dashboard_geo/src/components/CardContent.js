import React from "react"
import {
    HEADING,
    CARD_CONTAINER,
    CARD_CONTENT,
    SUBSECTION,
    SUBHEADING,
    HOVER_TEXT,
    BUTTON,
    PATH_UPDATE,
    PHOTO_CREDIT_CONTAINER,
    NO_PHOTO_CREDIT,
    BUTTON_CONTAINER,
    EP_PUBLISH,
    POST,
    ERROR_MESSAGE,
    ERROR_VISIBLE,
    ERROR_HIDDEN,
    PUBLISH_MESSAGE,
    MOVED_TO_PUBLISHED,
    MOVED_TO_DRAFTS,
    TIMESTAMP_CONTAINER,
    TIMESTAMP,
} from "../helper/common"
import "../css/CardContent.css"
import ImageDisplay from "./ImageDisplay"


export default class CardContent extends React.Component {

    state = {
        submitting: false,
        showNotification: false
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

    handlePubEvent = async(e) => {
        e.preventDefault()
        this.setState({
                          submitting: true,
                          showNotification: true
                      })
        let publish = true
        let message = MOVED_TO_PUBLISHED
        if(this.props.published) {
            publish = false
            message = MOVED_TO_DRAFTS
        }
        const body = {
            "id": this.props.country.id,
            "publish": publish
        }
        document.getElementById(PUBLISH_MESSAGE + this.props.country.id).innerText = message
        this.setState({showNotification: true})
        const response = await this.props.fetchOrDie(EP_PUBLISH, POST, body)
        if(response && response.status === 200) {
            window.location.reload()
        }
    }

    getReadableDate = (isoDate) => {
        const date = new Date(isoDate)
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        return dateTimeFormat.format(date)
    }

    render() {
        return (
            <article className={CARD_CONTAINER + " " + CARD_CONTENT}>
                {
                    (!this.props.published) &&
                    <button
                        className={HOVER_TEXT + " " + BUTTON}
                        onClick={this.handleEditCard}>Edit
                    </button>
                }
                <h2 className={CARD_CONTENT + " " + HEADING}>{this.props.country.name}</h2>
                {
                    this.props.country.image_info && this.props.country.image_info.image_uploaded &&
                    <section>
                        <ImageDisplay fetchOrDie={this.props.fetchOrDie}
                                      countryID={this.props.country.id}
                                      image_uploaded={this.props.country.image_info.image_uploaded}/>
                        {
                            (this.props.country.image_info.photographer && this.props.country.image_info.url)
                            ? <div className={CARD_CONTENT + " " + PHOTO_CREDIT_CONTAINER}>
                                <span>Photo by </span>
                                <a href={this.props.country.image_info.url}
                                   rel={"noreferrer"}
                                   target={"_blank"}>
                                    {this.props.country.image_info.photographer}
                                </a>
                            </div>
                            : <div className={CARD_CONTENT + " " + NO_PHOTO_CREDIT}>
                                Please provide photo credit and link.
                            </div>
                        }
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
                <section className={CARD_CONTENT + " " + SUBSECTION + " " + BUTTON_CONTAINER}>
                    <div id={PUBLISH_MESSAGE + this.props.country.id}
                         className={PUBLISH_MESSAGE + " " + ERROR_MESSAGE + " " +
                                    ((this.state.showNotification || this.state.submitting)
                                     ? ERROR_VISIBLE
                                     : ERROR_HIDDEN)}/>
                    <button className={CARD_CONTENT + " " + BUTTON}
                            onClick={this.handlePubEvent}>
                        {this.props.published
                         ? <span>Move To Drafts</span>
                         : <span>Publish Card</span>}
                    </button>
                </section>
                <section className={CARD_CONTENT + " " + SUBSECTION + " " + TIMESTAMP_CONTAINER}>
                    <div className={CARD_CONTENT + " " + TIMESTAMP}>Added
                        by {this.props.country.added_by} on {this.getReadableDate(
                            this.props.country.created_at)}</div>
                    {
                        this.props.published
                        ? <div className={CARD_CONTENT + " " + TIMESTAMP}>Published
                            by {this.props.country.published_by} on {this.getReadableDate(
                                this.props.country.published_at)}
                        </div>
                        : <div className={CARD_CONTENT + " " + TIMESTAMP}>Last modified
                            by {this.props.country.last_modified_by} on {this.getReadableDate(
                                this.props.country.last_modified_at)}
                        </div>
                    }
                </section>
            </article>
        )
    }
}
