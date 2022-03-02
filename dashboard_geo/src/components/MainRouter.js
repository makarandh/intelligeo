import React, {Suspense} from "react"
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom"
import "../css/MainRouter.css"
import {
    BLURIFY,
    BUTTON,
    DANGER,
    EP_PUBLISHED,
    HIDE_MENU_TRANSLATE,
    LOGOUT,
    NAV_ITEM,
    NAV_LINK,
    NAV_LINKS,
    PAGE_CONTENT,
    PATH_COUNTRY,
    PATH_CREATE,
    PATH_DRAFTS,
    PATH_HOME,
    PATH_UPDATE,
    ROTATE_LEFT,
    ROTATE_RIGHT,
    SHOW_MENU,
    SHOW_MENU_TRANSLATE,
    TOP_BAR,
    TOP_BAR_CONTAINER,
    TOP_BAR_LEFT,
    TOP_BAR_RIGHT
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
        menuVisible: false,
        windowWidth: 0
    }

    toggleMenu = (e) => {
        this.setState((prevState) => ({menuVisible: !prevState.menuVisible}))
    }

    hideMenu = () => {
        this.setState({menuVisible: false})
    }

    updateWidth = () => {
        const windowWidth = window.innerWidth
        this.setState({windowWidth})
    }

    componentDidMount() {
        this.updateWidth()
        window.addEventListener("resize", this.updateWidth)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWidth)
    }

    render() {
        return (
            <Router>
                <section>
                    <div className={TOP_BAR_CONTAINER + " "
                                    + (this.state.windowWidth < 570
                                       ? (this.state.menuVisible ? "z_index_2" : "z_index_0")
                                       : "z_index_2")}>
                        <header className={TOP_BAR + " " + (this.state.menuVisible
                                                            ? SHOW_MENU_TRANSLATE
                                                            : HIDE_MENU_TRANSLATE)}>
                            <nav onClick={this.hideMenu}>
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
                    </div>
                    <div className={SHOW_MENU + " "
                                    + (this.state.menuVisible
                                       ? ROTATE_LEFT
                                       : ROTATE_RIGHT)}>
                        <MenuArrow handleGoBack={this.toggleMenu}
                                   width={1}
                                   height={1}/>
                    </div>
                    <div className={this.state.menuVisible ? "inactivate" : ""} onClick={this.hideMenu}/>
                    <section className={PAGE_CONTENT + " "
                                        + (this.state.menuVisible ? BLURIFY : " ")}>
                        <Suspense fallback={<LoadingText width={16} height={2}/>}>
                            <Routes>
                                <Route path={PATH_CREATE}
                                       element={<CreateCard fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={`${PATH_UPDATE}/:id`}
                                       element={<UpdateCard fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={`${PATH_COUNTRY}/:id`}
                                       element={<Country fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={`${EP_PUBLISHED}/:id`}
                                       element={<PublishedCard fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={PATH_DRAFTS}
                                       element={<Drafts fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={EP_PUBLISHED}
                                       element={<Published fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={PATH_HOME}
                                       element={<Home getUsername={this.props.getUsername}
                                                      fetchOrDie={this.props.fetchOrDie}/>}/>
                                <Route path={"/"}
                                       element={<Home getUsername={this.props.getUsername}
                                                      fetchOrDie={this.props.fetchOrDie}/>}/>
                            </Routes>
                        </Suspense>
                    </section>
                </section>
            </Router>
        )
    }
}
