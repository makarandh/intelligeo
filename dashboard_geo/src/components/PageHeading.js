import React from "react"
import {GEO, HEADING, INTELLI, INTELLIGEO_LOGO, PAGE_HEADING_SECTION, PAGE_SUB_HEADING} from "../helper/common"
import "../css/PageHeading.css"

export const PageHeading = (props) => {
    return (
        <section className={PAGE_HEADING_SECTION}>
            {props.mainHeading
             ? <h1 className={HEADING}>{props.mainHeading}</h1>
             : <div className={INTELLIGEO_LOGO}>
                 <span className={INTELLI}>Intelli</span><span className={GEO}>Geo</span> <span> Admin Dashboard</span>
             </div>
            }
            {props.subHeading && <h4 className={PAGE_SUB_HEADING}>{props.subHeading}</h4>}
        </section>
    )
}

