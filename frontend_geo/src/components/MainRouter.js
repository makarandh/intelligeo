import React, {Suspense} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import "../css/MainRouter.css"
import {
    ANSCLICKED,
    ANSVIEWED,
    CHOICES,
    CLICKEDANS,
    COUNTRIESLIST,
    COUNTRY,
    EVERYTHING_EXCEPT_FOOTER,
    FREEANS,
    GAMELENGTH,
    INDEX,
    INPROGRESS,
    LONG_GAME_LENGTH,
    MEDIUM_GAME_LENGTH,
    QANS,
    QANSVISIBLE,
    ROUTE_GAME,
    ROUTE_NEW_GAME,
    SCORE,
    SHORT_GAME_LENGTH,
    TOTALCORRECT,
    TOTALSCORE
} from "../helper/common"
import Footer from "./Footer"
import Header from "./Header"
import Loading from "./Loading"


const Home = React.lazy(() => import("./Home"))
const Game = React.lazy(() => import("./Game"))


export default class MainRouter extends React.Component {

    state = {
        gameLength: MEDIUM_GAME_LENGTH
    }

    setGameLength = async(gameLength) => {
        await this.setState({gameLength})
    }

    saveToLocalStorage = (name, item) => {
        localStorage.setItem(name, JSON.stringify(item))
    }

    loadGameLengthFromStorage = async() => {
        let gameLength = localStorage.getItem(GAMELENGTH)
        if(gameLength === null) {
            return
        }
        gameLength = JSON.parse(gameLength)
        if(typeof gameLength !== "number") {
            return
        }
        if(gameLength === SHORT_GAME_LENGTH || gameLength === MEDIUM_GAME_LENGTH || gameLength === LONG_GAME_LENGTH) {
            await this.setState({gameLength})
        }
    }

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
        localStorage.removeItem(ANSVIEWED)
    }

    componentDidMount() {
        this.loadGameLengthFromStorage()
    }

    render() {
        return (
            <div>
                <article className={EVERYTHING_EXCEPT_FOOTER}>
                    <Header/>
                    <BrowserRouter>
                        <Suspense fallback={<Loading width={9} height={2}/>}>
                            <Routes>
                                <Route path={ROUTE_GAME}
                                       element={<Game saveToLocalStorage={this.saveToLocalStorage}
                                                      gameLength={this.state.gameLength}
                                                      clearAllLocalStorage={this.clearAllLocalStorage}/>}/>
                                <Route path={`${ROUTE_GAME}/*`}
                                       element={<Game saveToLocalStorage={this.saveToLocalStorage}
                                                      gameLength={this.state.gameLength}
                                                      clearAllLocalStorage={this.clearAllLocalStorage}/>}/>
                                <Route path={ROUTE_NEW_GAME}
                                       element={<Home saveToLocalStorage={this.saveToLocalStorage}
                                                      setGameLength={this.setGameLength}
                                                      gameLength={this.state.gameLength}
                                                      clearAllLocalStorage={this.clearAllLocalStorage}/>}/>
                                <Route path={`${ROUTE_NEW_GAME}/*`}
                                       element={<Home saveToLocalStorage={this.saveToLocalStorage}
                                                      setGameLength={this.setGameLength}
                                                      gameLength={this.state.gameLength}
                                                      clearAllLocalStorage={this.clearAllLocalStorage}/>}/>

                                <Route path={"/"}
                                       element={<div><br/><br/><br/><br/><br/><a href="/game">Home</a></div>}/>
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </article>
                <Footer/>
            </div>
        )
    }
}
