import React from "react"
import {
    SUBSECTION, CARD_CONTENT, IMAGE_THUMBNAIL, EP_COUNTRY_IMAGE, GET
} from "../helper/common"
import "../css/CreateCardClues.css"

export default class ImageThumbnail extends React.Component {
    state = {
        imageURL: null
    }

    fetchImage = async() => {
        const response = await this.props.fetchOrDie(`${EP_COUNTRY_IMAGE}?id=${this.props.countryID}`, GET)
        if(response.status === 200) {
            const imageBlob = await response.blob()
            const imageURL = URL.createObjectURL(imageBlob)
            this.setState({
                imageURL
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
        this.fetchImage()
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.imageURL && (!this.props.thumbnailEmpty) &&
                    <section className={CARD_CONTENT + " " + SUBSECTION + " " + IMAGE_THUMBNAIL}>
                        <img src={this.state.imageURL} alt="country"/>
                    </section>
                }
            </React.Fragment>
        )
    }
}
