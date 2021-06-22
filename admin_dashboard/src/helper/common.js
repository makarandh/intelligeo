export const MAIN_URL = "http://127.0.0.1:5000"
export const ITEMS_PER_PAGE = 20

export const USERNAME = "username"
export const PASSWORD = "password"
export const LOGIN = "login"
export const RIGHT = "right"
export const TEXT = "text"
export const GET = "GET"
export const POST = "POST"
export const ERROR_VISIBLE = "error_visible"
export const ERROR_HIGHLIGHT = "error_highlight"
export const ERROR_HIDDEN = "error_hidden"
export const NETWORK_ERROR = "Error: Cannot connect to server. Please make sure your internet connection is working" +
                             " and try to refresh the page."
export const AUTH_ERROR = "Invalid credentials. Please make sure your username and password are correct."
export const SERVER_ERROR = "A server error has occurred. Please try again later. If the problem persists, please" +
                            " contact the system administrator."
export const UNKNOWN_ERROR = "An unknown error has occurred. Please try again later. If the problem persists, please" +
                             " contact the system administrator."
export const TOP_BAR = "top_bar"
export const TOP_BAR_LEFT = "top_bar_left"
export const TOP_BAR_RIGHT = "top_bar_right"
export const NAV_LINKS = "nav_links"
export const NAV_ITEM = "nav_item"
export const NAV_LINK = "nav_link"
export const BUTTON = "button"
export const strPAGE_NUM = "page_num"
export const strITEMS_PER_PAGE = "items_per_page"
export const strCARD = "card"

export const PATH_COUNTRIES = "/countries"
export const PATH_COUNTRIES_TOTAL = "/countries/total"
export const PATH_HOME = "/home"

export const get_url = (url, ...args) => {
    return url + "?" + args.reduce((arg1, arg2) => arg1 + "&" + arg2)
}
