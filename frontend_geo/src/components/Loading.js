import React from "react"
import {LOADING, OUTER_CONTAINER} from "../helper/common"

export const Loading = (props) => {
    return (
        <div className={LOADING + " " + OUTER_CONTAINER}>
            <svg x="0" y="0"
                 width={(props.width ? `${props.width*16}px` : "100px")}
                 height={(props.height ? `${props.height*16}px` : "30px")}
                 viewBox="0 1 257 30"
                 preserveAspectRatio="xMidYMid meet">
                <g transform="translate(-44,0)">
                    <rect height="40" width="20" y="1" x="45" fill="#008000">
                        <animate id="p1" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="0s; p10.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="71" fill="#008000">
                        <animate id="p2" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p1.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="97" fill="#008000">
                        <animate id="p3" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p2.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="123" fill="#008000">
                        <animate id="p4" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p3.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="149" fill="#008000">
                        <animate id="p5" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p4.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="175" fill="#008000">
                        <animate id="p6" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p5.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="201" fill="#008000">
                        <animate id="p7" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p6.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="227" fill="#008000">
                        <animate id="p8" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p7.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="253" fill="#008000">
                        <animate id="p9" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p8.end"/>
                    </rect>
                    <rect height="40" width="20" y="1" x="279" fill="#008000">
                        <animate id="p10" attributeName="fill" attributeType="XML" from="#7CFC00" to="#008000" dur="0.1s" fill="freeze" begin="p9.end"/>
                    </rect>
                </g>
            </svg>
        </div>
    )
}

export default Loading
