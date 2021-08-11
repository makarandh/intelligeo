import React from "react"
import {COPYRIGHT, FOOTER, FOOTER_CONTENT, OUTER_CONTAINER} from "../helper/common"
import "../css/Footer.css"

const getCurrentYear = () => {
    return new Date().getFullYear()
}

function Footer() {
    return (
        <footer className={FOOTER + " " + OUTER_CONTAINER}>
            <section className={FOOTER + " " + FOOTER_CONTENT}>
                <div className={COPYRIGHT}>
                    &copy; Copyright {getCurrentYear()}, IntelliDeep
                </div>
            </section>
        </footer>
    )
}


export default Footer
