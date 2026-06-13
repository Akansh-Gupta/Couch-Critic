import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom'
import { FaStar } from "react-icons/fa"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function Carousel(props) {
    const { list } = props
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        pauseOnHover: false,

    };
    return (
        <Slider {...settings}>
            {list?.slice(0, 10).map((item) => {
                const rating = item.ratings.imdb?.rating || item.ratings.mal?.rating || item.ratings.simkl?.rating.toFixed(1) || "N/A";
                return <Link
                    key={item.ids.simkl_id}
                    draggable={false} to={item.url.replace("movie", "movies")}>
                    <div className="banner" style={{ backgroundImage: `url(https://simkl.in/posters/${item.poster}_c.webp)` }} >
                        <div className="content active">
                            <img src={`https://simkl.in/posters/${item.poster}_m.webp`} alt="" className="carousel-movie-img" />
                            {/* <h3 className='banner-title'>{item.title.length > 61 ? item.title.slice(0, 60) + "..." : item.title}</h3> */}
                            <div>
                                <h4>
                                    <span><i><FaStar className='mb-1' size={25} color='#ffc107' /> {rating}</i></span>
                                    <span>{item.runtime?.replace('h', 'Hr').replace('m', 'Min')}</span>
                                    <span>{item.genres?.join(" | ")}</span>
                                    <span>{item.metadata?.replace(/(\d{4})\s*-\s*(?=\s*•)/, '$1 - NOW')?.replaceAll("•", " | ")}</span>
                                </h4>
                                <p>{item.overview?.replaceAll("<br><br>"," ") ||"No description available."}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            })}
        </Slider>
    );
}
