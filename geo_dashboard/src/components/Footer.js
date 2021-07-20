import React from "react"
import {COPYRIGHT, FOOTER, FOOTER_CONTENT, OUTER_CONTAINER} from "../helper/common"
import "../css/Footer.css"

export default class Footer extends React.Component {

    getCurrentYear = () => {
        return new Date().getFullYear()
    }

    render() {
        return (
            <footer id={FOOTER + " " + OUTER_CONTAINER}>
                <section className={FOOTER + " " + FOOTER_CONTENT}>
                <div className={COPYRIGHT}>
                    <small>&copy; Copyright {this.getCurrentYear()}, IntelliDeep</small>
                </div>
                </section>
            </footer>
        )
    }
}
