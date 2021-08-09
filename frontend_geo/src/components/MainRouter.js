import "../css/MainRouter.css"
import React from "react"
import {Suspense} from "react"
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom"
import {
    ANSCLICKED, CHOICES, CLICKEDANS,
    COUNTRIESLIST,
    COUNTRY, FREEANS,
    INDEX,
    INPROGRESS, QANS, QANSVISIBLE,
    ROUTE_GAME,
    ROUTE_NEW_GAME, SCORE,
    TOTALCORRECT,
    TOTALSCORE
} from "../helper/common"
import Loading from "./Loading"

const Home = React.lazy(() => import("./Home"))
const Game = React.lazy(() => import("./Game"))


export default class MainRouter extends React.Component {

    clearAllLocalStorage = () => {
        localStorage.removeItem(COUNTRIESLIST)
        localStorage.removeItem(INDEX)
        localStorage.removeItem(TOTALCORRECT)
        localStorage.removeItem(TOTALSCORE)
        localStorage.removeItem(INPROGRESS)
        localStorage.removeItem(COUNTRY)
        localStorage.removeItem(QANS)
        localStorage.removeItem(SCORE)
        localStorage.removeItem(FREEANS)
        localStorage.removeItem(QANSVISIBLE)
        localStorage.removeItem(ANSCLICKED)
        localStorage.removeItem(CLICKEDANS)
        localStorage.removeItem(CHOICES)
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={ROUTE_GAME}>
                        <Suspense fallback={<Loading width={9} height={2}/>}>
                            <Game clearAllLocalStorage={this.clearAllLocalStorage}/>
                        </Suspense>
                    </Route>
                    <Route path={`${ROUTE_GAME}/*`}>
                        <Redirect to={ROUTE_GAME}/>
                    </Route>
                    <Route path={ROUTE_NEW_GAME}>
                        <Suspense fallback={<Loading width={9} height={2}/>}>
                            <Home clearAllLocalStorage={this.clearAllLocalStorage}/>
                        </Suspense>
                    </Route>
                    <Route path={`${ROUTE_NEW_GAME}/*`}>
                        <Redirect to={ROUTE_NEW_GAME}/>
                    </Route>
                    <Route path={"/"}>
                        <div><a href="/game">Home</a></div>
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}
