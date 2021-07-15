import React from "react"
import "../css/EditCard.css"
import {
    BUTTON, BUTTON_CONTAINER, CARD_CONTAINER,
    CLUES, EDIT_CARD, EP_COUNTRY, ERROR_VISIBLE,
    ERROR_HIDDEN, ERROR_MESSAGE, HEADING, NAME,
    OUTER_CONTAINER, POST, SUBHEADING, SUBSECTION,
    sleep,
    SUBMIT_MESSAGE, UPDATE, GET, PATH_HOME, PUT,
    DELETE, UPLOAD_IMAGE, EP_COUNTRY_IMAGE,
    PATH_COUNTRY, LONG_ERROR, DANGER, SUBMIT, UNDO,
    DELETE_CARD, DELETE_IMAGE, CARD, IMAGE, COUNTRY_NAME, QUESTION_ANS, META, IMAGE_INFO
} from "../helper/common"
import BackArrow from "./BackArrow"
import EditCardClues from "./EditCardClues"
import EditCardMeta from "./EditCardMeta"
import EditCardQA from "./EditCardQA"
import EditCardImage from "./EditCardImage"
import YesNoModal from "./YesNoModal"


export default class EditCard extends React.Component {

    state = {
        name: "",
        clues: [],
        questionAns: [],
        meta: {
            continent: "",
            region: ""
        },
        imageInfo: {
            url: "",
            photographer: "",
            image_uploaded: false
        },
        latestClue: "",
        latestQuestion: "",
        latestAns: false,
        showNotification: false,
        submitting: false,
        deleteModalVisible: false,
        imageError: false,
        longError: false,
        modalHeading: null,
        modalMessage: null,
        deleteContent: null,
        thumbnailEmpty: true,
        imageErrorMessage: null
    }

    deleteCardModalHeading = "Delete Card"
    deleteCardModalMessage = "Are you sure you want to delete this country?"
    deleteImageModalHeading = "Delete Image"
    deleteImageModalMessage = "Are you sure you want to delete the image for this country?"
    imageErrorType = "Error: Please select an image file."
    imageErrorDelete = "Error deleting image."

    componentDidMount() {
        if(this.props.operation === UPDATE) {
            this.handleUpdateDataLoading()
        }
        else {
            this.loadAllFromLocalStorage()
        }
    }

    getClues = () => {
        return this.state.clues
    }

    setClues = (clues) => {
        this.saveToLocalStorage(CLUES, clues)
        this.setState({clues})
    }

    getClue = (index) => {
        return this.state.clues[index]
    }

    setClue = (index, clue) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), clue, ...prevState.clues.slice(index + 1)]
            this.saveToLocalStorage(CLUES, clues)
            return {clues}
        })
    }

    getLatestClue = () => {
        return this.state.latestClue
    }

    setLatestClue = (latestClue) => {
        this.saveToLocalStorage("latestClue", latestClue)
        this.setState({latestClue})
    }

    deleteClue = (index) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const clues = [...prevState.clues.slice(0, index), ...prevState.clues.slice(index + 1)]
            this.saveToLocalStorage(CLUES, clues)
            return {clues}
        })
    }

    getQAs = () => {
        return this.state.questionAns
    }

    setQAs = (questionAns) => {
        this.saveToLocalStorage(QUESTION_ANS, questionAns)
        this.setState({questionAns})
    }

    getQA = (index) => {
        return this.state.questionAns[index]
    }

    setQA = (index, QA) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const questionAns = [...prevState.questionAns.slice(0, index), QA,
                                 ...prevState.questionAns.slice(index + 1)]
            this.saveToLocalStorage(QUESTION_ANS, questionAns)
            return {questionAns}
        })
    }

    getLatestQ = () => {
        return this.state.latestQuestion
    }

    getLatestA = () => {
        return this.state.latestAns
    }

    setLatestQ = (latestQuestion) => {
        this.saveToLocalStorage("latestQuestion", latestQuestion)
        this.setState({latestQuestion})
    }

    setLatestA = (latestAns) => {
        this.saveToLocalStorage("latestAns", latestAns)
        this.setState({latestAns})
    }

    deleteQA = (index) => {
        index = parseInt(index)
        this.setState((prevState) => {
            const questionAns = [...prevState.questionAns.slice(0, index), ...prevState.questionAns.slice(index + 1)]
            this.saveToLocalStorage(QUESTION_ANS, questionAns)
            return {questionAns}
        })
    }

    setPhotographer = (photographer) => {
        this.setState((prevState) => {
            const imageInfo = {
                url: prevState.imageInfo.url,
                image_uploaded: prevState.imageInfo.image_uploaded,
                photographer
            }
            this.saveToLocalStorage(IMAGE_INFO, imageInfo)
            return {imageInfo}
        })
    }

    setImageURL = (url) => {
        this.setState((prevState) => {
            const imageInfo = {
                url,
                image_uploaded: prevState.imageInfo.image_uploaded,
                photographer: prevState.imageInfo.photographer
            }
            this.saveToLocalStorage(IMAGE_INFO, imageInfo)
            return {imageInfo}
        })
    }

    setImageUploaded = (image_uploaded) => {
        this.setState((prevState) => {
            const imageInfo = {
                url: prevState.imageInfo.url,
                image_uploaded,
                photographer: prevState.imageInfo.photographer
            }
            this.saveToLocalStorage(IMAGE_INFO, imageInfo)
            return {imageInfo}
        })
    }

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    getContinent = () => {
        return this.state.meta.continent
    }

    getRegion = () => {
        return this.state.meta.region
    }

    setContinent = (continent) => {
        this.setState((prevState) => {
            const meta = {
                region: prevState.meta.region,
                continent
            }
            this.saveToLocalStorage(META, meta)
            return {meta}
        })
    }

    setRegion = (region) => {
        this.setState((prevState) => {
            const meta = {
                region,
                continent: prevState.meta.continent
            }
            this.saveToLocalStorage(META, meta)
            return {meta}
        })
    }

    loadAllFromLocalStorage = (name = "",
                               clues = [],
                               questionAns = [],
                               meta = {
                                   "continent": "",
                                   "region": ""
                               },
                               imageInfo = {
                                   "photographer": "",
                                   "url": "",
                                   image_uploaded: false
                               },
                               latestQuestion = "",
                               latestClue = "",
                               latestAns = false) => {

        let lname = this.loadFromLocalStorage(NAME)
        if(lname === null) {
            lname = name
        }
        let lclues = this.loadFromLocalStorage(CLUES)
        if(lclues === null) {
            lclues = clues
        }
        let lquestionAns = this.loadFromLocalStorage(QUESTION_ANS)
        if(lquestionAns === null) {
            lquestionAns = questionAns
        }
        let lmeta = this.loadFromLocalStorage(META)
        if(lmeta === null) {
            lmeta = meta
        }
        let llatestQuestion = this.loadFromLocalStorage("latestQuestion")
        if(llatestQuestion === null) {
            llatestQuestion = latestQuestion
        }
        let llatestClue = this.loadFromLocalStorage("latestClue")
        if(llatestClue === null) {
            llatestClue = latestClue
        }
        let llatestAns = this.loadFromLocalStorage("latestAns")
        if(llatestAns === null) {
            llatestAns = latestAns
        }
        let limageInfo = this.loadFromLocalStorage(IMAGE_INFO)
        if(limageInfo === null) {
            limageInfo = imageInfo
        }
        this.setState({
                          name: lname,
                          clues: lclues,
                          questionAns: lquestionAns,
                          meta: lmeta,
                          latestClue: llatestClue,
                          latestQuestion: llatestQuestion,
                          latestAns: llatestAns,
                          imageInfo: limageInfo
                      })
    }

    addLatestItems = async() => {
        if(this.state.latestClue && this.state.latestClue !== "") {
            await this.setState((prevState) => {
                const clues = [...prevState.clues, prevState.latestClue]
                this.saveToLocalStorage(CLUES, clues)
                this.saveToLocalStorage("latestClue", "")
                return {
                    clues,
                    latestClue: ""
                }
            })
        }

        if(this.state.latestQuestion && this.state.latestQuestion !== "") {
            this.setState((prevState) => {
                const latestQA = {
                    "question": prevState.latestQuestion,
                    "ans": prevState.latestAns
                }
                const questionAns = [...prevState.questionAns, latestQA]
                this.saveToLocalStorage(QUESTION_ANS, questionAns)
                this.saveToLocalStorage("latestQuestion", "")
                this.saveToLocalStorage("latestAns", false)
                return {
                    questionAns,
                    latestQuestion: "",
                    latestAns: false
                }
            })
        }
    }

    handleNameChange = (e) => {
        const name = e.target.value
        this.saveToLocalStorage(NAME, name)
        this.setState({name})
    }

    loadFromLocalStorage = (name) => {
        name = `${this.props.operation}.${name}`
        const value = localStorage.getItem(name)
        if(value === null || value === "") {
            return value
        }
        return JSON.parse(value)
    }

    saveToLocalStorage = (name, item) => {
        name = `${this.props.operation}.${name}`
        localStorage.setItem(name, JSON.stringify(item))
    }

    clearLocalStorage = (name) => {
        name = `${this.props.operation}.${name}`
        localStorage.removeItem(name)
    }

    clearAllLocalStorage = () => {
        this.clearLocalStorage(NAME)
        this.clearLocalStorage(CLUES)
        this.clearLocalStorage(QUESTION_ANS)
        this.clearLocalStorage(META)
        this.clearLocalStorage(IMAGE_INFO)
        this.clearLocalStorage("latestQuestion")
        this.clearLocalStorage("latestClue")
        this.clearLocalStorage("latestAns")
    }

    clearState = async() => {
        await this.setState({
                                name: "",
                                clues: [],
                                questionAns: [],
                                meta: {
                                    continent: "",
                                    region: ""
                                },
                                latestClue: "",
                                latestQuestion: "",
                                latestAns: false,
                                imageError: false
                            })
    }

    submitImage = async(countryID) => {
        const imageElement = document.getElementById(UPLOAD_IMAGE)
        const image = imageElement.files[0]
        if(!image || image.type.split("/")[0] !== "image") {
            return true // We don't need to submit image, so there is no error
        }
        let imageFormData = new FormData()
        imageFormData.append("image", image)
        imageFormData.append("id", countryID)
        const imageResponse = await this.props.fetchOrDie(EP_COUNTRY_IMAGE, POST, imageFormData, true)
        if(imageResponse.status === 200 || imageResponse.status === 201) {
            imageElement.value = null
            return true
        }
        return false
    }

    submitTextFields = async() => {
        const imageInfo = {
            "url": this.state.imageInfo.url,
            "photographer": this.state.imageInfo.photographer
        }
        const requestBody = {
            "name": this.state.name,
            "clues": this.state.clues,
            "question_ans": this.state.questionAns,
            "meta": this.state.meta,
            "id": this.props.countryID,
            "image_info": imageInfo
        }
        let method = POST
        if(this.props.operation === UPDATE) {
            method = PUT
        }
        const response = await this.props.fetchOrDie(EP_COUNTRY, method, requestBody)
        const responseJson = await response.json()
        if(response.status === 200 || response.status === 201) {
            return responseJson.result
        }
        console.error(responseJson)
        return false
    }

    handleSubmit = async(e) => {
        e.preventDefault()
        await this.addLatestItems()
        this.setState({
                          submitting: true,
                          showNotification: true,
                          longError: false
                      })

        document.getElementById(SUBMIT_MESSAGE).innerText = "Submitting card..."
        const submitFormResponse = await this.submitTextFields()
        if(!submitFormResponse) {
            document.getElementById(SUBMIT_MESSAGE).innerText = "Error submitting data."
            this.setState({
                              showNotification: true,
                              submitting: false
                          })
            return
        }

        let countryID = this.props.countryID
        if(!countryID) {
            countryID = submitFormResponse
        }
        document.getElementById(SUBMIT_MESSAGE).innerText = "Uploading image..."
        const submitImageSuccess = await this.submitImage(countryID)
        this.setState({
                          submitting: false
                      })

        let operated = "added"
        if(this.props.operation === UPDATE) {
            operated = "updated"
        }
        let notification_message = `Country ${operated}.`
        if(!submitImageSuccess) {
            notification_message = `${notification_message}. But could not upload image.`
            this.setState({
                              longError: true
                          })
        }
        document.getElementById(SUBMIT_MESSAGE).innerText = notification_message
        this.setState({
                          showNotification: true
                      })

        if(submitImageSuccess) {
            this.clearAllLocalStorage()
            this.clearState()
            window.location.href = `${PATH_COUNTRY}/${countryID}`
        }
    }

    handleUpdateDataLoading = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY}?id=${this.props.countryID}`, GET)

        if(response.status === 404) {
            this.clearAllLocalStorage()
            window.location.href = PATH_HOME
            return
        }
        if(response.status !== 200 && response.status !== 201) {
            console.error(`Error loading data`)
            console.error(response)
            return
        }
        if(this.loadFromLocalStorage("id") !== this.props.countryID) {
            this.clearAllLocalStorage()
        }
        let jsonData = await response.json()
        jsonData = jsonData.result
        this.loadAllFromLocalStorage(jsonData.name,
                                     jsonData.clues,
                                     jsonData.question_ans,
                                     jsonData.meta,
                                     jsonData.image_info)
        this.saveToLocalStorage("id", this.props.countryID)
    }

    handleReset = (e) => {
        e.preventDefault()
        this.setState({
                          showNotification: false,
                          submitting: false
                      })
        this.clearAllLocalStorage()
        this.handleUpdateDataLoading()
    }

    handleDeleteCard = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY}?id=${this.props.countryID}`, DELETE)
        if(response.status === 200) {
            this.clearState()
            this.clearAllLocalStorage()
            this.setState({
                              showNotification: true
                          })
            document.getElementById(SUBMIT_MESSAGE).innerText = `Country deleted successfully.`
            await sleep(1)
            window.location.href = PATH_HOME
        }
        else {
            const jsonMessage = await response.json()
            const message = jsonMessage.message
            document.getElementById(SUBMIT_MESSAGE).innerText = message
            console.error("Response error: ", message)
            this.setState({
                              showNotification: true
                          })
        }
    }

    handleDeleteImage = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY_IMAGE}?id=${this.props.countryID}`, DELETE)
        if(response.status === 200) {
            this.setState({thumbnailEmpty: true})
            this.setImageUploaded(false)
        }
        else {
            const jsonMessage = await response.json()
            const message = jsonMessage.message
            console.error("Response error: ", message)
            this.setState({
                              imageError: true,
                              imageErrorMessage: this.imageErrorDelete
                          })
            this.waitAndHideError({imageError: false}, 5000)
        }
    }

    handleDelete = async(e) => {
        e.preventDefault()
        if(this.state.deleteContent === CARD) {
            await this.handleDeleteCard()
        }
        if(this.state.deleteContent === IMAGE) {
            await this.handleDeleteImage()
        }
        this.setState({deleteContent: null})
    }

    handleDeleteYes = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
                          deleteModalVisible: false
                      })
        this.handleDelete(e)
    }

    handleDeleteNo = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
                          deleteModalVisible: false,
                          deleteContent: null
                      })
    }

    showConfirmDeleteModal = (e) => {
        e.preventDefault()
        console.log(e.target.name)
        if(e.target.name === DELETE_CARD + BUTTON) {
            this.setState({
                              deleteModalVisible: true,
                              modalHeading: this.deleteCardModalHeading,
                              modalMessage: this.deleteCardModalMessage,
                              deleteContent: CARD
                          })
            return
        }
        if(e.target.name === DELETE_IMAGE + BUTTON) {
            this.setState({
                              deleteModalVisible: true,
                              modalHeading: this.deleteImageModalHeading,
                              modalMessage: this.deleteImageModalMessage,
                              deleteContent: IMAGE
                          })
        }
    }

    goHome = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        window.location.href = PATH_HOME
    }

    waitAndHideError = async(errorStateObject, sleepSeconds = 3) => {
        console.log("will wait then hide error")
        await sleep(sleepSeconds)
        console.log("timeout")
        this.setState(errorStateObject)
    }

    handleImageChange = (e) => {
        const image_to_upload = e.target.files[0]
        const filetype = image_to_upload.type.split("/")[0]
        if(filetype !== "image") {
            this.setState({
                              imageError: true,
                              imageErrorMessage: this.imageErrorType
                          })
            e.target.value = null
            this.waitAndHideError({imageError: false}, 5)
        }
        else {
            this.setState({imageError: false})
        }
    }

    setThumbnailEmpty = (state) => {
        this.setState({
                          thumbnailEmpty: state
                      })
    }

    render() {
        return (
            <article className={OUTER_CONTAINER + " " + EDIT_CARD}>
                <BackArrow handleGoBack={this.goHome}
                           width={1}
                           height={1}/>
                <YesNoModal handleYes={this.handleDeleteYes}
                            handleNo={this.handleDeleteNo}
                            visible={this.state.deleteModalVisible}
                            heading={this.state.modalHeading}
                            message={this.state.modalMessage}/>
                <form className={CARD_CONTAINER + " " + EDIT_CARD}>
                    <h2 className={HEADING + " " + EDIT_CARD}>{this.props.heading}</h2>
                    <section className={EDIT_CARD + " " + SUBSECTION + " " + NAME}>
                        <h3 className={EDIT_CARD + " " + SUBHEADING + " " + NAME}>Name</h3>
                        <input type="text"
                               placeholder={COUNTRY_NAME}
                               onChange={this.handleNameChange}
                               value={this.state.name}/>
                    </section>

                    <EditCardImage fetchOrDie={this.props.fetchOrDie}
                                   handleURLChange={this.handleURLChange}
                                   imageErrorMessage={this.state.imageErrorMessage}
                                   imageError={this.state.imageError}
                                   handleImageChange={this.handleImageChange}
                                   showConfirmDeleteModal={this.showConfirmDeleteModal}
                                   setPhotographer={this.setPhotographer}
                                   photographer={this.state.imageInfo.photographer}
                                   setImageURL={this.setImageURL}
                                   url={this.state.imageInfo.url}
                                   setImageUploaded={this.setImageUploaded}
                                   image_uploaded={this.state.imageInfo.image_uploaded}
                                   thumbnailEmpty={this.state.thumbnailEmpty}
                                   setThumbnailEmpty={this.setThumbnailEmpty}
                                   countryID={this.props.countryID}/>
                    <EditCardClues setClue={this.setClue}
                                   getClue={this.getClue}
                                   setClues={this.setClues}
                                   getClues={this.getClues}
                                   deleteClue={this.deleteClue}
                                   setLatestClue={this.setLatestClue}
                                   getLatestClue={this.getLatestClue}/>
                    <EditCardQA setQA={this.setQA}
                                getQA={this.getQA}
                                setQAs={this.setQAs}
                                getQAs={this.getQAs}
                                deleteQA={this.deleteQA}
                                setLatestQ={this.setLatestQ}
                                setLatestA={this.setLatestA}
                                getLatestQ={this.getLatestQ}
                                getLatestA={this.getLatestA}/>
                    <EditCardMeta setContinent={this.setContinent}
                                  getContinent={this.getContinent}
                                  setRegion={this.setRegion}
                                  getRegion={this.getRegion}/>
                    <section className={EDIT_CARD + " " +
                                        SUBSECTION + " " +
                                        BUTTON_CONTAINER + " " +
                                        (this.props.operation === UPDATE ? UPDATE : "")}>
                        <div id={SUBMIT_MESSAGE}
                             className={ERROR_MESSAGE + " " +
                                        ((this.state.showNotification || this.state.submitting)
                                         ? ERROR_VISIBLE
                                         : ERROR_HIDDEN) + " " +
                                        (this.state.longError && LONG_ERROR)}/>
                        {
                            this.props.operation === UPDATE
                            && <button className={EDIT_CARD + " " + BUTTON + " " + UNDO}
                                       onClick={this.handleReset}>Undo Changes
                            </button>
                        }
                        <button className={EDIT_CARD + " " + BUTTON + " " + SUBMIT}
                                disabled={this.state.submitting || this.state.name === ""}
                                onClick={this.handleSubmit}>{this.props.buttonTitle}
                        </button>
                        {
                            this.props.operation === UPDATE
                            && <button className={EDIT_CARD + " " + BUTTON + " " + DANGER + " " + DELETE_CARD}
                                       name={DELETE_CARD + BUTTON}
                                       onClick={this.showConfirmDeleteModal}>Delete Country
                            </button>
                        }
                    </section>
                </form>
            </article>
        )
    }
}
