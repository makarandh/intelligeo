"use strict"

const HIDE_ME = "hide_me"
const SHOW_ME = "show_me"

const navBarButton = document.getElementById("nav-menu-button")
const navMenu = document.getElementById("nav-menu")
const navCloseIcon = document.getElementById("nav-close-icon")
const navHamburgerIcon = document.getElementById("nav-hamburger-icon")

let menuVisible = false

const toggleMenu = () => {
    if(menuVisible) {
        navMenu.classList.remove(SHOW_ME)
        navMenu.classList.add(HIDE_ME)
        navCloseIcon.classList.remove(SHOW_ME)
        navCloseIcon.classList.add(HIDE_ME)
        console.log(navCloseIcon)
        navHamburgerIcon.classList.add(SHOW_ME)
        navHamburgerIcon.classList.remove(HIDE_ME)
        console.log(navHamburgerIcon)
    }
    else {
        navMenu.classList.remove(HIDE_ME)
        navMenu.classList.add(SHOW_ME)
        navCloseIcon.classList.remove(HIDE_ME)
        navCloseIcon.classList.add(SHOW_ME)
        console.log(navCloseIcon)
        navHamburgerIcon.classList.add(HIDE_ME)
        navHamburgerIcon.classList.remove(SHOW_ME)
        console.log(navHamburgerIcon)
    }
    menuVisible = !menuVisible
}

navBarButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleMenu()
})
