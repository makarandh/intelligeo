import React from "react"
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from "react-router-dom"
import {Suspense} from "react"
import "../css/TopBar.css"
import {BUTTON, NAV_ITEM, NAV_LINK, NAV_LINKS, PATH_HOME, TOP_BAR, TOP_BAR_LEFT, TOP_BAR_RIGHT} from "../helper/common"

const Home = React.lazy(() => import("./Home"))
const Settings = React.lazy(() => import("./CreateCard"))


export class TopBar extends React.Component {
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
                                             to="/create">Create A Card</NavLink>
                                </li>
                            </ul>
                        </nav>
                        <div className={TOP_BAR_RIGHT}>
                            <button className={BUTTON + " logout"} onClick={this.props.logout}>Log Out</button>
                        </div>
                    </header>
                    <Switch>
                        <Route path="/create">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Settings/>
                            </Suspense>
                        </Route>
                        <Route path={PATH_HOME}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Home fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route exact path={"/"}>
                            <Redirect to={PATH_HOME}/>
                        </Route>
                        <Route path={"*"}>
                            <div>404</div>
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}
