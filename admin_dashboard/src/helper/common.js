export const MAIN_URL = "http://127.0.0.1:5000"
export const intITEMS_PER_PAGE = 20

export const USERNAME = "username"
export const PASSWORD = "password"
export const LOGIN = "login"
export const RIGHT = "right"
export const TEXT = "text"
export const GET = "GET"
export const POST = "POST"
export const ERROR_MESSAGE = "error_message"
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
export const BUTTON_CONTAINER = "button_container"
export const HEADING = "heading"
export const YES = "yes"
export const NO  = "no"
export const INDEX = "index"
export const DISABLED = "disabled"

export const TOOLTIP = "tooltip"
export const TOOLTIP_CONTAINER = "tooltip_container"

export const PAGE_NUM = "page_num"
export const ITEMS_PER_PAGE = "items_per_page"
export const OUTER_CONTAINER = "outer_container"
export const SUBHEADING = "subheading"
export const SUB_SUBHEADING = "sub_subheading"
export const SUB_SUBHEADING_CONTAINER = "sub_subheading_container"

export const LOGIN_PAGE  = "login_page"
export const INPUT_CONTAINER  = "input_container"
export const PAGE_SUB_HEADING = "page_sub_heading"
export const PAGE_HEADING_SECTION = "page_heading_section"
export const CARD_CONTAINER = "card_container"
export const DETAILS = "details"
export const SUBSECTION = "subsection"
export const CARDS_LIST_OUTER = "cards_list_outer"
export const CARDS_LIST_CONTAINER = "cards_list_container"
export const CREATE_CARD = "create_card"
export const ADD_FIELD = "add_field"
export const DELETE_FIELD = "delete_field"
export const INPUT_FIELD_CONTAINER = "input_field_container"
export const TOGGLE_SLIDER = "toggle_slider"
export const SLIDER_CONTAINER = "slider_container"

export const CLUES = "clues"
export const NAME = "name"
export const LATEST_CLUE_ADD = "latest_clue_add"

export const EP_COUNTRY = "/country"
export const EP_COUNTRIES = "/countries"
export const EP_COUNTRIES_TOTAL = "/countries/total"
export const PATH_HOME = "/home"
export const PATH_CREATE = "/create"

export const QUESTION  = "question"
export const ANS = "ans"
export const SUBMIT_MESSAGE = "submit_message"

export const get_url = (url, ...args) => {
    return url + "?" + args.reduce((arg1, arg2) => arg1 + "&" + arg2)
}

export const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
