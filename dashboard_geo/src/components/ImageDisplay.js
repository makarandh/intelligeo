import React from "react"
import {
    IMAGE_URL,
    SUBSECTION,
    CARD_CONTENT,
    IMAGE_THUMBNAIL,
    LOADING
} from "../helper/common"
import "../css/CreateCardClues.css"
import LoadingImage from "./Icons/LoadingImage"

export default class ImageDisplay extends React.Component {
    state = {
        showImage: true
    }

    getImageURL = () => {
        if(!this.props.countryID) {
            return ""
        }
        return IMAGE_URL + "/" + this.props.countryID + ".webp"
    }

    setShowImage = () => {
        this.setState({showImage: true})
        this.props.setThumbnailEmpty && this.props.setThumbnailEmpty(false)
    }

    unsetShowImage = () => {
        this.setState({showImage: false})
        this.props.setThumbnailEmpty && this.props.setThumbnailEmpty(true)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.image_uploaded &&
                 <section className={CARD_CONTENT + " " + SUBSECTION + " " + IMAGE_THUMBNAIL}>
                     {(this.state.showImage && (!this.props.thumbnailEmpty))
                      ? <img src={this.getImageURL()}
                             alt="country"
                             onError={this.unsetShowImage}
                             onLoad={this.setShowImage}/>
                      :
                      <div className={CARD_CONTENT + " " + SUBSECTION + " " + LOADING}>
                          <LoadingImage width={4}
                                        height={4}/>
                      </div>
                     }
                 </section>
                }
            </React.Fragment>
        )
    }
}
