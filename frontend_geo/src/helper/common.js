// export const MAIN_URL = "https://api.geo.intellideep.digital"
// export const MAIN_URL = "https://localhost:5000"
export const MAIN_URL = "http://localhost:3000"

export const GET = "GET"
export const POST = "POST"

// Endpoints
export const EP_RAND_LIST = "/random-list"
export const EP_COUNTRY = "/published"


export const GAME_LENGTH = 10
export const CHOICE_COUNT = 9

export const OUTER_CONTAINER = "outer_container"
export const LOADING = "loading"
export const MAIN = "main"
export const CARD = "card"
export const CARD_CONTAINER = "card_container"
export const SUBSECTION = "subsection"
export const LOADING_SCREEN_CONTAINER = "loading_screen_container"
export const SECTION = "section"
export const CARD_HERO_IMAGE = "card_hero_image"
export const CARD_TITLE = "card_title"
export const CARD_CLUES = "card_clues"
export const CARD_CHOICES = "card_choices"
export const CLUES = "clues"
export const Q_ANS = "q_ans"
export const HERO_IMAGE_CONTAINER = "hero_image_container"
export const HERO_WORLD_MAP = "hero_world_map"
export const HERO_PERSON1 = "hero_person1"
export const HERO_PERSON2 = "hero_person2"
export const HERO_PERSON3 = "hero_person3"
export const CARD_HEADING = "card_heading"
export const HEADING = "heading"
export const BUTTON = "button"
export const CHOICE_BUTTONS_CONTAINER = "choice_buttons_container"
export const CHOICES = "choices"
export const CONTAINER = "container"

export const NETWORK_ERROR_CONTAINER = "network_error_container"
export const ERROR_MESSAGE = "error_message"
export const NETWORK_ERROR = "Error: Cannot connect to server. Please make sure your internet connection is working" +
                             " and try to refresh the page."

export const sleep = async(seconds) => {
    return new Promise(resolve => setTimeout(resolve, 1000*seconds))
}
