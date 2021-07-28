import React from "react"
import {
    SUBSECTION,
    CARD_CONTENT,
    IMAGE_THUMBNAIL,
    EP_COUNTRY_IMAGE,
    GET, LOADING
} from "../helper/common"
import "../css/CreateCardClues.css"
import LoadingImage from "./Icons/LoadingImage"

export default class ImageDisplay extends React.Component {
    state = {
        imageBlobURL: null
    }

    fetchImage = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY_IMAGE}?id=${this.props.countryID}`, GET)
        if(response.status === 200) {
            const imageBlob = await response.blob()
            const imageBlobURL = URL.createObjectURL(imageBlob)
            this.setState({
                              imageBlobURL
                          })
            if(this.props.setThumbnailEmpty) {
                this.props.setThumbnailEmpty(false)
            }
        }
        else if(this.props.setThumbnailEmpty) {
            this.props.setThumbnailEmpty(true)
        }
    }

    componentDidMount() {
        if(this.props.image_uploaded) {
            this.fetchImage()
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.props.image_uploaded &&
                 <section className={CARD_CONTENT + " " + SUBSECTION + " " + IMAGE_THUMBNAIL}>
                     {(this.state.imageBlobURL && (!this.props.thumbnailEmpty))
                      ? <img src={this.state.imageBlobURL} alt="country"/>
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
