import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MainPage from './MainPage'
export default function Carousel() {

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        pauseOnHover: false,
        arrows: false
    };
    return (
        <Slider {...settings}>
            <div>
                <MainPage bgImg="images/background/bg-deadpool-and-wolverine.png" title="Deadpool and Wolverine" titleImg="images/deadpool-and-wolverine.jpeg" year="2024" rating="R-rated" time="2Hr 8Min" genre="Action|Dark Comedy|Superhero" desc="Deadpool is offered a place in the Marvel Cinematic Universe by the Time Variance Authority, but instead recruits a variant of Wolverine to save his universe from extinction." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-despicable-me.jpg" title="Despicable Me 4" titleImg="images/despicable-me.jpg" year="2024" rating="PG" time="1Hr 34Min" genre="Animation|Comedy|Family" desc="Gru, Lucy, Margo, Edith, and Agnes welcome a new member to the family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his girlfriend Valentina, and the family is forced to go on the run." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-inside-out-2.jpg" title="Inside Out 2" titleImg="images/inside-out-2.jpg" year="2024" rating="PG" time="1Hr 36Min" genre="Animation|Comedy|Drama" desc="A sequel that features Riley entering puberty and experiencing brand new, more complex emotions as a result. As Riley tries to adapt to her teenage years, her old emotions try to adapt to the possibility of being replaced." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-kingdom-of-the-planet-of-the-apes.jpg" title="Kingdom of the Planet of the Apes" titleImg="images/kingdom-of-the-planet-of-the-apes.jpg" year="2024" rating="PG-13" time="2Hr 25Min" genre="Action|Sci-Fi|Thriller" desc="Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past and make choices that will define a future for apes and humans alike." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-furiosa.jpg" title="Furiosa: A Mad Max Saga" titleImg="images/furiosa.jpg" year="2024" rating="R-rated" time="2Hr 28Min" genre="Action Epic|Desert Adventure|Sci-Fi" desc="The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-oppenheimer.jpg" title="Oppenheimer" titleImg="images/oppenheimer.jpg" year="2023" rating="TV-14" time="3Hr" genre="Biography|History|Psychological Drama" desc="The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-the-covenant.jpeg" title="Guy Ritchie's The Covenant" titleImg="images/the-covenant.jpg" year="2023" rating="R-rated" time="2Hr 3Min" genre="Action|Drama|War" desc="During the war in Afghanistan, a local interpreter risks his own life to carry an injured sergeant across miles of grueling terrain." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-the-black-demon.jpeg" title="The Black Demon" titleImg="images/the-black-demon.jpg" year="2023" rating="R-rated" time="1Hr 40Min" genre="Horror|Sci-Fi|Thriller" desc="Stranded on a crumbling rig in Baja, a family faces off against a vengeful megalodon shark." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-little-mermaid.jpg" title="The Little Mermaid" titleImg="images/the-little-mermaid.jpeg" year="2023" rating="PG-13" time="2Hr 15Min" genre="Fairy Tale|Adventure|Fantasy" desc="A young mermaid makes a deal with a sea witch to trade her beautiful voice for human legs so she can discover the world above water and impress a prince." />
            </div>
            <div>
                <MainPage bgImg="images/background/bg-the-tank.jpeg" title="The Tank" titleImg="images/the-tank.jpeg" year="2023" rating="R-rated" time="1Hr 40Min" genre="Horror|Mystery|Thriller" desc="After mysteriously inheriting an abandoned coastal property, Ben and his family accidentally unleash an ancient, long-dormant creature that terrorized the entire region-including his own ancestors-for generations." />
            </div>
        </Slider>
    );
}
