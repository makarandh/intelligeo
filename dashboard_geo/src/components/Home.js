import React from "react"
import {
    DESCRIPTION,
    EP_PUBLISHED,
    HOME,
    INNER_CONTAINER,
    OUTER_CONTAINER,
    PATH_CREATE,
    PATH_DRAFTS,
    SUBHEADING, TITLE
} from "../helper/common"
import {PageHeading} from "./PageHeading"
import "../css/Home.css"

export default class Home extends React.Component {

    state = {
        username: ""
    }

    getUsername = async() => {
        const username = await this.props.getUsername()
        this.setState({username})
    }

    componentDidMount() {
        this.getUsername()
    }

    render() {
        return (
            <article>
                <PageHeading/>
                <section className={HOME + " " + OUTER_CONTAINER}>
                    <h2 className={HOME + " " + SUBHEADING}>Hello {this.state.username}! What would you like to do?</h2>
                    <ol className={HOME + " " + INNER_CONTAINER}>
                        <li><a href={PATH_CREATE}>
                            <span className={HOME + " " + TITLE}>Create a card</span>
                            <span className={HOME + " " + DESCRIPTION}>
                                You can add new cards here.
                            </span>
                        </a></li>
                        <li><a href={PATH_DRAFTS}>
                            <span className={HOME + " " + TITLE}>View Drafts</span>
                            <span className={HOME + " " + DESCRIPTION}>
                                These are the cards that have been added, but not yet published.
                                A card has to be published for it to be used in the game.
                            </span>
                        </a></li>
                        <li><a href={EP_PUBLISHED}>
                            <span className={HOME + " " + TITLE}>View published cards</span>
                            <span className={HOME + " " + DESCRIPTION}>
                                Published cards are being used in the game.
                            </span>
                        </a></li>
                    </ol>
                </section>
            </article>
        )
    }
}
