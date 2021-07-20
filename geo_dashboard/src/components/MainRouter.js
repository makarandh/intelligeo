import React from "react"
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from "react-router-dom"
import {Suspense} from "react"
import "../css/MainRouter.css"
import {
    BUTTON,
    NAV_ITEM,
    NAV_LINK,
    NAV_LINKS,
    PATH_CREATE,
    PATH_UPDATE,
    PATH_HOME,
    TOP_BAR,
    TOP_BAR_LEFT,
    TOP_BAR_RIGHT,
    DANGER,
    LOGOUT,
    PATH_COUNTRY,
    TOP_BAR_CONTAINER,
    PATH_DRAFTS,
    EP_PUBLISHED,
    SHOW_MENU,
    HIDE_MENU_TRANSLATE,
    SHOW_MENU_TRANSLATE, ROTATE_LEFT, ROTATE_RIGHT
} from "../helper/common"
import LoadingText from "./Icons/LoadingText"
import MenuArrow from "./Icons/MenuArrow"

const Home = React.lazy(() => import("./Home"))
const Drafts = React.lazy(() => import("./Drafts"))
const Published = React.lazy(() => import("./Published"))
const CreateCard = React.lazy(() => import("./CreateCard"))
const UpdateCard = React.lazy(() => import("./UpdateCard"))
const Country = React.lazy(() => import("./Country"))
const PublishedCard = React.lazy(() => import("./PublishedCard"))


export class MainRouter extends React.Component {

    state = {
        menuVisible: false
    }

    toggleMenu = (e) => {
        console.log(`Menu visible: ${!this.state.menuVisible}`)
        this.setState((prevState) => ({menuVisible: !prevState.menuVisible}))
    }

    render() {
        return (
            <Router>
                <section>
                    <div className={TOP_BAR_CONTAINER}>
                        <header className={TOP_BAR + " " + (this.state.menuVisible
                                                            ? SHOW_MENU_TRANSLATE
                                                            : HIDE_MENU_TRANSLATE)}>
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
                                                 to={PATH_DRAFTS}>Drafts</NavLink>
                                    </li>
                                    <li className={NAV_ITEM}>
                                        <NavLink className={NAV_LINK}
                                                 activeClassName={"active_nav"}
                                                 to={EP_PUBLISHED}>Published</NavLink>
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
                        <div className={SHOW_MENU + " "
                                        + (this.state.menuVisible
                                           ? ROTATE_LEFT
                                           : ROTATE_RIGHT)}>
                            <MenuArrow handleGoBack={this.toggleMenu}
                                       width={1}
                                       height={1}/>
                        </div>
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
                        <Route path={`${EP_PUBLISHED}/:id`}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <PublishedCard fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={PATH_DRAFTS}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <Drafts fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={EP_PUBLISHED}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <Published fetchOrDie={this.props.fetchOrDie}/>
                            </Suspense>
                        </Route>
                        <Route path={PATH_HOME}>
                            <Suspense fallback={<LoadingText width={16} height={2}/>}>
                                <Home getUsername={this.props.getUsername}
                                      fetchOrDie={this.props.fetchOrDie}/>
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
