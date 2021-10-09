"use strict"

const HIDE_ME = "hide_me"
const SHOW_ME = "show_me"
const btnSubmit = document.getElementById("submit-button")
const inputName = document.getElementById("name-input")
const inputEmail = document.getElementById("email-input")
const inputMessage = document.getElementById("message-input")
const nameError = document.getElementById("name-error")
const emailError = document.getElementById("email-error")
const messageError = document.getElementById("message-error")
const messageLength = document.getElementById("message-length")

const emailIsValid = (email) => {
    if(!email || typeof email !== "string") {
        return false
    }
    const reEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return reEmail.test(email)
}

const nameIsValid = (name) => {
    if(!name || typeof name !== "string") {
        return false
    }
    const reName = /^(\w+\s*)+$/
    return reName.test(name)
}

const messageIsValid = (message) => {
    return message.trim().length >= 10
}

const showElement = (element) => {
    element.classList.add(SHOW_ME)
    element.classList.remove(HIDE_ME)
}

const hideElement = (element) => {
    element.classList.add(HIDE_ME)
    element.classList.remove(SHOW_ME)
}

inputName.addEventListener("input", (e) => {
    const name = e.target.value
    if(nameIsValid(name)) {
        hideElement(nameError)
    }
})

inputEmail.addEventListener("input", (e) => {
    const email = e.target.value
    if(emailIsValid(email)) {
        hideElement(emailError)
    }
})

inputMessage.addEventListener("input", (e) => {
    const message = e.target.value
    messageLength.innerText = `${message.length}/5000`
    if(messageIsValid(message)) {
        hideElement(messageError)
    }
})

btnSubmit.addEventListener("click", (e) => {
    e.preventDefault()
    let error = false
    const name = inputName.value
    if(!nameIsValid(name)) {
        error = true
        showElement(nameError)
    }
    const email = inputEmail.value
    if(!emailIsValid(email)) {
        error = true
        showElement(emailError)
    }
    const message = inputMessage.value.trim()
    inputMessage.value = message
    messageLength.innerText = `${message.length}/5000`
    if(!messageIsValid(message)) {
        error = true
        showElement(messageError)
    }

    if(!error) {
        submit_form(name, email, message)
    }
})

const submit_form = async(name, email, message) => {
    let body = {
        "name": name,
        "email": email,
        "message": message
    }
    body = JSON.stringify(body)
    const response = await fetch("http://localhost:3000/contact-us", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    const responseBody =  await response.json()
    console.log(response.status)
    console.log(responseBody)
}


const init = () => {
    const message = inputMessage.value.trim()
    inputMessage.value = message
    messageLength.innerText = `${message.length}/5000`
}

init()
