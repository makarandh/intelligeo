import React from "react"
import {
    HERO_IMAGE_CONTAINER,
    HERO_PERSON1,
    HERO_PERSON2,
    HERO_PERSON3,
    HERO_WORLD_MAP
} from "../helper/common"

export default class CardHero extends React.Component {
    render() {
        return (
            <div className={HERO_IMAGE_CONTAINER}>
                <img className={HERO_WORLD_MAP} src="/static/images/hero-image-world.svg" alt="world map"/>
                <img className={HERO_PERSON1} src="/static/images/hero-image-person1.svg" alt="person1"/>
                <img className={HERO_PERSON2} src="/static/images/hero-image-person2.svg" alt="person2"/>
                <img className={HERO_PERSON3} src="/static/images/hero-image-person3.svg" alt="person3"/>
            </div>
        )
    }
}
