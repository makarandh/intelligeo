"use strict"

const HIDE_ME = "hide-me"
const SHOW_ME = "show-me"
const INPUT_ERROR_TRUE = "input-error-true"
const BTN_SUBMITTING = "btn-submitting"
const ERROR_MESSAGE = "error-message"
const SUCCESS_MESSAGE = "success-message"
const SUBMIT_ERROR_TEXT = "Sorry, we are unable to send your message!\n" +
                          "Please make sure your internet connection is working and try again later."
const SUBMIT_SUCCESS_TEXT = "Your message has been submitted. Thank you!"
let submitting = false
const btnSubmit = document.getElementById("submit-button")
const inputName = document.getElementById("name-input")
const inputEmail = document.getElementById("email-input")
const inputMessage = document.getElementById("message-input")
const nameError = document.getElementById("name-error")
const emailError = document.getElementById("email-error")
const messageError = document.getElementById("message-error")
const messageLength = document.getElementById("message-length")
const submitResult = document.getElementById("submit-result")
const CONTACT_URL = "https://api.geo.intellideep.digital/contact-us"
// const CONTACT_URL = "http://127.0.0.1:3000/contact-us"


const emailIsValid = (email) => {
    if(!email || typeof email !== "string") {
        return false
    }
    const reEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/
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

const setErrorBackground = (element) => {
    element.classList.add(INPUT_ERROR_TRUE)
}

const removeErrorBackground = (element) => {
    element.classList.remove(INPUT_ERROR_TRUE)
}

inputName.addEventListener("input", (e) => {
    const name = e.target.value
    if(nameIsValid(name)) {
        hideElement(nameError)
        removeErrorBackground(inputName)
    }
})

inputEmail.addEventListener("input", (e) => {
    const email = e.target.value
    if(emailIsValid(email)) {
        hideElement(emailError)
        removeErrorBackground(inputEmail)
    }
})

inputMessage.addEventListener("input", (e) => {
    const message = e.target.value
    messageLength.innerText = `${message.length}/5000`
    if(messageIsValid(message)) {
        hideElement(messageError)
        removeErrorBackground(inputMessage)
    }
})

btnSubmit.addEventListener("click", (e) => {
    e.preventDefault()
    let error = false
    const name = inputName.value
    if(!nameIsValid(name)) {
        error = true
        showElement(nameError)
        setErrorBackground(inputName)
    }
    const email = inputEmail.value
    if(!emailIsValid(email)) {
        error = true
        showElement(emailError)
        setErrorBackground(inputEmail)
    }
    const message = inputMessage.value.trim()
    inputMessage.value = message
    messageLength.innerText = `${message.length}/5000`
    if(!messageIsValid(message)) {
        error = true
        showElement(messageError)
        setErrorBackground(inputMessage)
    }

    if(!error) {
        submitForm(name, email, message)
    }
})

const updateSubmitButton = () => {
    if(submitting && !btnSubmit.classList.contains(BTN_SUBMITTING)) {
        btnSubmit.classList.add(BTN_SUBMITTING)
        btnSubmit.innerText = "Submitting..."
        return
    }
    if(!submitting && btnSubmit.classList.contains(BTN_SUBMITTING)) {
        btnSubmit.classList.remove(BTN_SUBMITTING)
        btnSubmit.innerText = "Submit"
    }
}

const updateSubmitSuccessUI = () => {
    submitResult.innerText = SUBMIT_SUCCESS_TEXT
    if(!submitResult.classList.contains(SUCCESS_MESSAGE)) {
        submitResult.classList.add(SUCCESS_MESSAGE)
    }
    if(submitResult.classList.contains(ERROR_MESSAGE)) {
        submitResult.classList.remove(ERROR_MESSAGE)
    }
    showElement(submitResult)
    inputName.value = ""
    inputEmail.value = ""
    inputMessage.value = ""
    messageLength.innerText = "0/5000"
}

const updateSubmitFailUI = () => {
    submitResult.innerText = SUBMIT_ERROR_TEXT
    if(!submitResult.classList.contains(ERROR_MESSAGE)) {
        submitResult.classList.add(ERROR_MESSAGE)
    }
    if(submitResult.classList.contains(SUCCESS_MESSAGE)) {
        submitResult.classList.remove(SUCCESS_MESSAGE)
    }
    showElement(submitResult)
}

const submitForm = async(name, email, message) => {
    if(submitting) {
        return
    }
    submitting = true
    updateSubmitButton()
    hideElement(submitResult)

    let body = {
        "name": name,
        "email": email,
        "message": message
    }
    body = JSON.stringify(body)

    try {
        const response = await fetch(CONTACT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        // const responseBody = await response.json()
        const responseStatus = response.status
        submitting = false
        updateSubmitButton()
        if(responseStatus === 200) {
            updateSubmitSuccessUI()
            return
        }
        updateSubmitFailUI()
    }
    catch(e) {
        console.error("The below error occurred trying to submit the contact form: ")
        console.error(e)
        submitting = false
        updateSubmitButton()
        showElement(submitResult)
        updateSubmitFailUI()
    }
}

const init = () => {
    const message = inputMessage.value.trim()
    inputMessage.value = message
    messageLength.innerText = `${message.length}/5000`
    commonInit()
}

init()
