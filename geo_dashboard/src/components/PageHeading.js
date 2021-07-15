import React from "react"
import {HEADING, PAGE_HEADING_SECTION, PAGE_SUB_HEADING} from "../helper/common"
import "../css/PageHeading.css"

export const PageHeading = (props) => {
    return (
        <section className={PAGE_HEADING_SECTION}>
            <h1 className={HEADING}>{props.mainHeading}</h1>
            {props.subHeading && <h4 className={PAGE_SUB_HEADING}>{props.subHeading}</h4>}
        </section>
    )
}

