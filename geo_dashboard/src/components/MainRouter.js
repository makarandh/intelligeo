import React from "react"
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from "react-router-dom"
import {Suspense} from "react"
import "../css/MainRouter.css"
import {
    BUTTON,
    NAV_ITEM,
    NAV_LINK,
    NAV_LINKS,
    PATH_CREATE, PATH_UPDATE,
    PATH_HOME,
    TOP_BAR,
    TOP_BAR_LEFT,
    TOP_BAR_RIGHT, DANGER, LOGOUT, PATH_COUNTRY
} from "../helper/common"

const Home = React.lazy(() => import("./Home"))
const CreateCard = React.lazy(() => import("./CreateCard"))
const UpdateCard = React.lazy(() => import("./UpdateCard"))
const Country = React.lazy(() => import("./Country"))


export class MainRouter extends React.Component {

    render() {
        return (
            <Router>
                <div>
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
                    <Switch>
                        <Route path={PATH_CREATE}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <CreateCard fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={`${PATH_UPDATE}/:id`}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <UpdateCard fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={`${PATH_COUNTRY}/:id`}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Country fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={PATH_HOME}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Home fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={"/"}>
                            <Redirect to={PATH_HOME}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}
