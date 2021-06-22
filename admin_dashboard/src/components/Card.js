import React from "react"
import {strCARD} from "../helper/common"

export default class Card extends React.Component {

    renderClues = () => {
        return <ul>
            {this.props.country.clues.map((clue) => {
                return <li key={clue}>{clue}</li>
            })}
        </ul>
    }

    renderMeta = () => {
        return <ul>
            {this.props.country.meta.map((meta) => {
                return <li key={meta.continent + meta.region}>
                    <div>Continent: {meta.continent}</div>
                    <div>Region: {meta.region} </div>
                </li>
            })}
        </ul>
    }

    renderQAns = () => {
        return <ul>
            {this.props.country.question_ans.map((qAns) => {
                return <li key={qAns[0]}>{qAns[0]} ({qAns[1] ?<span>Yes</span> : <span>No</span>})</li>
            })}
        </ul>
    }

    render() {
        return (
            <div className={strCARD}>
                <div className={"title"}>{this.props.country.name}</div>
                <div>
                    <div className={"title-2"}>Clues</div>
                    <div>{this.renderClues()}</div>
                </div>
                <div>
                    <div className={"title-2"}>Yes-no Questions and Answers</div>
                    <div>{this.renderQAns()}</div>
                </div>
                <div>
                    <div className={"title-2"}>Extra Info</div>
                    <div>{this.renderMeta()}</div>
                </div>
            </div>
        )
    }
}

