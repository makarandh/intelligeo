import React from "react"
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from "react-router-dom"
import {Suspense} from "react"
import "../css/MainRouter.css"
import {
    BUTTON, NAV_ITEM,
    NAV_LINK, NAV_LINKS,
    PATH_CREATE, PATH_UPDATE,
    PATH_HOME, TOP_BAR,
    TOP_BAR_LEFT, TOP_BAR_RIGHT,
    DANGER, LOGOUT,
    PATH_COUNTRY, TOP_BAR_CONTAINER
} from "../helper/common"
import LoadingText from "./LoadingText"

const Home = React.lazy(() => import("./Home"))
const CreateCard = React.lazy(() => import("./CreateCard"))
const UpdateCard = React.lazy(() => import("./UpdateCard"))
const Country = React.lazy(() => import("./Country"))


export class MainRouter extends React.Component {

    render() {
        return (
            <Router>
                <section>
                    <div className={TOP_BAR_CONTAINER}>
                        <header className={TOP_BAR}>
                            <nav>
                                <ul className={NAV_LINKS + " " + TOP_BAR_LEFT}>
                                    <li className={NAV_ITEM}>
                                        <NavLink className={NAV_LINK}
                                                 activeClassName={"active_nav"}
                                                 to={PATH_HOME}>Home</NavLink>
                                    </li>
                                    <li className={NAV_ITEM}>
                                        <NavLink className={NAV_LINK}
                                                 activeClassName={"active_nav"}
                                                 to={PATH_CREATE}>Create A Card</NavLink>
                                    </li>
                                </ul>
                            </nav>
                            <div className={TOP_BAR_RIGHT}>
                                <button className={BUTTON + " " + DANGER + " " + LOGOUT}
                                        onClick={this.props.logout}>Log Out
                                </button>
                            </div>
                        </header>
                    </div>
                    <Switch>
                        <Route path={PATH_CREATE}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <CreateCard fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={`${PATH_UPDATE}/:id`}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <UpdateCard fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={`${PATH_COUNTRY}/:id`}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <Country fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={PATH_HOME}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <Home fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={"/"}>
                            <Redirect to={PATH_HOME}/>
                        </Route>
                    </Switch>
                </section>
            </Router>
        )
    }
}
