import React from 'react'

export default function MainPage(props) {
    let { bgImg, title, titleImg, year, rating, time, genre, desc } = props;
    return (
        <div>
            <div className="banner" style={{ backgroundImage: `url(${bgImg})` }} >
                <div className="content active">
                    <img src={titleImg} alt="" className="carousel-movie-img" />
                    <h3 className='banner-title'>{title}</h3>
                    <h4>
                        <span>{year}</span><span><i>{rating}</i></span><span>{time}</span><span>{genre}</span>
                    </h4>
                    <p>{desc}</p>
                </div>
            </div>
        </div>
    )
}