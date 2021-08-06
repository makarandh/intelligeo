import React from "react"
import {
    ANS_BELOW_IMAGE,
    ANS_IMAGE_CONTAINER,
    HERO_IMAGE_CONTAINER,
    HERO_PERSON1,
    HERO_PERSON2,
    HERO_PERSON3,
    HERO_WORLD_MAP, HIDE_ME, IMAGE_URL, PHOTO_CREDIT_CONTAINER, SHOW_ME, WORLD_MAP_CONTAINER
} from "../helper/common"
import "../css/Cardhero.css"

export default class CardHero extends React.Component {

    getCountryName = () => {
        if(!this.props.country || !this.props.country.name) {
            return ""
        }
        return this.props.country.name
    }

    getImageInfoURL = () => {
        if(!this.props.country || !this.props.country.image_info || !this.props.country.image_info.url) {
            return ""
        }
        return this.props.country.image_info.url
    }

    getImageURL = () => {
        if(!this.props.country || !this.props.country.id) {
            return ""
        }
        return IMAGE_URL + "/" + this.props.country.id + ".webp"
    }

    getPhotographer = () => {
        if(!this.props.country || !this.props.country.image_info || !this.props.country.image_info.photographer) {
            return ""
        }
        return this.props.country.image_info.photographer
    }

    render() {
        return (
            <div className={HERO_IMAGE_CONTAINER}>
                <div className={WORLD_MAP_CONTAINER + " " + (this.props.ansClicked ? HIDE_ME : SHOW_ME)}>
                    <img className={HERO_WORLD_MAP} src="/static/images/hero-image-world.svg" alt="world map"/>
                    <img className={HERO_PERSON1} src="/static/images/hero-image-person1.svg" alt="person1"/>
                    <img className={HERO_PERSON2} src="/static/images/hero-image-person2.svg" alt="person2"/>
                    <img className={HERO_PERSON3} src="/static/images/hero-image-person3.svg" alt="person3"/>
                </div>
                <div className={ANS_IMAGE_CONTAINER + " " + (this.props.ansClicked ? SHOW_ME : HIDE_ME)}>
                    <img src={this.getImageURL()} alt="Answer"/>
                    <div className={PHOTO_CREDIT_CONTAINER}>
                        <span>Photo by </span>
                        <a href={this.getImageInfoURL()}
                           rel={"noreferrer"}
                           target={"_blank"}>
                            {this.getPhotographer()}
                        </a>
                    </div>
                    <div className={ANS_BELOW_IMAGE}>{this.getCountryName()}</div>
                </div>
            </div>
        )
    }
}
