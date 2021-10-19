"use strict"

const SLIDE_OUT = "slide_out"
const SLIDE_IN = "slide_in"
const HIDE_ME = "hide_me"
const SHOW_ME = "show_me"
const MAX_WINDOW_WIDTH = 760
const navMenu = document.getElementById("nav-menu")
const hideNavButton = document.getElementById("nav-close-icon")
const showNavButton = document.getElementById("nav-hamburger-icon")

let windowWidth = window.innerWidth
let prevWindowWidth = windowWidth
let menuVisible = false

const makeWideNavMenuVisible = () => {
    navMenu.classList.remove(SLIDE_OUT)
    navMenu.classList.add(SLIDE_IN)
}

const showNavDropdown = () => {
    showNavButton.classList.add(HIDE_ME)
    showNavButton.classList.remove(SHOW_ME)
    navMenu.classList.remove(SLIDE_OUT)
    navMenu.classList.add(SLIDE_IN)
    hideNavButton.classList.remove(SLIDE_OUT)
    hideNavButton.classList.add(SLIDE_IN)
}

const hideNavDropdown = () => {
    navMenu.classList.add(SLIDE_OUT)
    hideNavButton.classList.add(SLIDE_OUT)
    navMenu.classList.remove(SLIDE_IN)
    hideNavButton.classList.remove(SLIDE_IN)
    showNavButton.classList.add(SHOW_ME)
    showNavButton.classList.remove(HIDE_ME)
}

showNavButton.addEventListener("click", (e) => {
    showNavDropdown()
    menuVisible = true
})

hideNavButton.addEventListener("click", (e) => {
    hideNavDropdown()
    menuVisible = false
})

// window.addEventListener("resize", () => {
//     windowWidth = window.innerWidth
//     if(windowWidth > MAX_WINDOW_WIDTH && prevWindowWidth <= MAX_WINDOW_WIDTH) {
//         makeWideNavMenuVisible()
//     }
//     if(windowWidth <= MAX_WINDOW_WIDTH && prevWindowWidth > MAX_WINDOW_WIDTH) {
//         hideNavDropdown()
//     }
//     prevWindowWidth = windowWidth
// })


const init = () => {
    // if(windowWidth <= MAX_WINDOW_WIDTH) {
    //     hideNavDropdown()
    // }
    commonInit()
}

init()
