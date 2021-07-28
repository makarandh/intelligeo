import React from "react"
import {
    SUBSECTION,
    EDIT_CARD,
    UPLOAD_IMAGE,
    UPLOAD_IMAGE_CONTAINER,
    FILENAME, BUTTON, DANGER, DELETE_IMAGE, ERROR_MESSAGE, ERROR_VISIBLE, ERROR_HIDDEN, PHOTO_CREDIT
} from "../helper/common"
import "../css/CreateCardClues.css"
import ImageDisplay from "./ImageDisplay"

export default class EditCardImage extends React.Component {

    handlePhotographerChange = (e) => {
        let photographer = e.target.value
        if(photographer === null) {
            photographer = ""
        }
        this.props.setPhotographer(photographer)
    }

    handleURLChange = (e) => {
        let url = e.target.value
        if(url === null) {
            url = ""
        }
        this.props.setImageURL(url)
    }

    handleKeypress = (e) => {
        if(e) {
            e.stopPropagation()
        }
        if(e.key === "Enter") {
            e.preventDefault()
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.image_uploaded &&
                    <ImageDisplay countryID={this.props.countryID}
                                  fetchOrDie={this.props.fetchOrDie}
                                  setThumbnailEmpty={this.props.setThumbnailEmpty}
                                  thumbnailEmpty={this.props.thumbnailEmpty}
                                  image_uploaded={this.props.image_uploaded}/>
                }
                <section className={EDIT_CARD + " " + SUBSECTION + " " + UPLOAD_IMAGE}>
                    <div className={EDIT_CARD + " " + UPLOAD_IMAGE_CONTAINER}>
                        <label><span>Select image</span>
                            <input type="file"
                                   id={UPLOAD_IMAGE}
                                   onChange={this.props.handleImageChange}
                                   name={FILENAME}/></label>
                        {(!this.props.thumbnailEmpty) &&
                         <button className={EDIT_CARD + " " + BUTTON + " " + DANGER + " " + DELETE_IMAGE}
                                 name={DELETE_IMAGE + BUTTON}
                                 onClick={this.props.showConfirmDeleteModal}>Delete Image
                         </button>}
                    </div>
                    <div className={ERROR_MESSAGE + " " + (this.props.imageError
                                                           ? ERROR_VISIBLE
                                                           : ERROR_HIDDEN)}>{this.props.imageErrorMessage}
                    </div>
                    <div className={EDIT_CARD + " " + PHOTO_CREDIT}>
                        <label><span>Photographer</span>
                            <input type="text"
                                   onKeyDown={this.handleKeypress}
                                   onKeyPress={this.handleKeypress}
                                   onKeyUp={this.handleKeypress}
                                   onChange={this.handlePhotographerChange}
                                   value={this.props.photographer}/>
                        </label>
                    </div>
                    <div className={EDIT_CARD + " " + PHOTO_CREDIT}>
                        <label><span>Link</span>
                            <input type="text"
                                   onKeyDown={this.handleKeypress}
                                   onKeyPress={this.handleKeypress}
                                   onKeyUp={this.handleKeypress}
                                   onChange={this.handleURLChange}
                                   value={this.props.url}/>
                        </label>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
