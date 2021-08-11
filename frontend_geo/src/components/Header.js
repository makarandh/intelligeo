import React from "react"
import {HEADER, OUTER_CONTAINER} from "../helper/common"
import "../css/Header.css"


function Header() {
    return (
        <header className={HEADER + " " + OUTER_CONTAINER}>
            <article className="intelligeo-logo">
                <a href="https://geo.intellideep.digital">
                    <span className="intelli">Intelli</span><span className="geo">Geo</span>
                </a>
            </article>
        </header>
    )
}

export default Header
