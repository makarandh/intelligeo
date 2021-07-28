import React from "react"
import {
    BUTTON, BUTTON_CONTAINER,
    CARD_CONTAINER,
    DANGER,
    INNER_CONTAINER, INVISIBLE,
    MODAL,
    MODAL_HEADING,
    MODAL_MESSAGE,
    OUTER_CONTAINER, VISIBLE
} from "../helper/common"
import "../css/Modal.css"

export default class YesNoModal extends React.Component {

    handleYes = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.props.handleYes(e)
    }

    handleNo = (e) => {
        this.props.handleNo(e)
    }

    doNothing = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    render() {
        return (
            <div onClick={this.handleNo}
                 className={`${MODAL} ${OUTER_CONTAINER} ${(this.props.visible ? VISIBLE : INVISIBLE)}`}>
                <div className={`${MODAL} ${INNER_CONTAINER}`}>
                    <article onClick={this.doNothing} className={`${CARD_CONTAINER} ${MODAL}`}>
                        <h3 className={MODAL_HEADING}>{this.props.heading}</h3>
                        <div className={MODAL_MESSAGE}>{this.props.message}</div>
                        <div className={BUTTON_CONTAINER}>
                            <button className={`${BUTTON} ${DANGER}`}
                                    onClick={this.handleYes}>Yes
                            </button>
                            <button className={BUTTON}
                                    onClick={this.handleNo}>No
                            </button>
                        </div>
                    </article>
                </div>
            </div>
        )
    }
}
