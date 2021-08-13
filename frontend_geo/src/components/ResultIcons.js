import React from "react"
import {
    CORRECT_ICON_CONTAINER,
    CORRECT_WRONG_ICON, HIDE_ME, IMAGES_PATH, SLIDE_IN_ICON, WRONG_ICON_CONTAINER
} from "../helper/common"
import "../css/ResultIcon.css"

export default class ResultIcons extends React.Component {
    render() {
        return (
            <div className={CORRECT_WRONG_ICON }>
                <div className={CORRECT_ICON_CONTAINER + " " + (this.props.ansIsCorrect() ? SLIDE_IN_ICON : HIDE_ME)}>
                    <img src={`${IMAGES_PATH}/tick_mark.svg`} alt="tick mark"/> <span>Correct</span>
                </div>
                <div className={WRONG_ICON_CONTAINER + " " + (this.props.ansIsCorrect() ? HIDE_ME : SLIDE_IN_ICON)}>
                    <img src={`${IMAGES_PATH}/cross_mark.svg`} alt="cross mark"/> <span>Wrong</span>
                </div>
            </div>
        )
    }
}
