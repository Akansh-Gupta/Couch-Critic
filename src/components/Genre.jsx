import React, { useEffect } from 'react'
import { useParams, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useGlobalContext } from './Context';
import RenderList from './RenderList';

export default function Genre() {
    const navigate = useNavigate()
    const location = useLocation()
    const { type, genre } = useParams()
    const { fetchInformation, searchGenre } = useGlobalContext();

    const movieGenre = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "Thriller", "TV Movie", "War", "Western"]
    const tvGenre = ["Action", "Adventure", "Animation", "Awards Show", "Children", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Food", "Game Show", "History", "Home and Garden", "Horror", "Indie", "Korean Drama", "Martial Arts", "Mini-Series", "Musical", "Mystery", "News", "Podcast", "Reality", "Romance", "Science-Fiction", "Soap", "Special Interest", "Sport", "Suspense", "Talk Show", "Thriller", "Travel", "War", "Western"]
    const animeGenre = ["Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi", "Fantasy", "Game", "Harem", "Historical", "Horror", "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Slice Of Life", "Space", "Sports", "Super Power", "Supernatural", "Thriller", "Vampire", "Yaoi", "Yuri"]

    let list = []
    if (location.pathname.includes("/movie")) list = movieGenre
    else if (location.pathname.includes("/tv")) list = tvGenre
    else if (location.pathname.includes("/anime")) list = animeGenre

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInformation(type, "", genre);
        }, 1000);
        return () => clearTimeout(timer);
    }, [type, genre, fetchInformation]);

    return (
        <>
            <div className="search-result-background">
                <ul className="nav">
                    <li><NavLink to="/movies/genres/action" className="listItem listitem">Movies</NavLink></li>
                    <li><NavLink to="/tv/genres/action" className="listItem listitem">TV Shows</NavLink></li>
                    <li><NavLink to="/anime/genres/action" className="listItem listitem">Anime</NavLink></li>
                </ul>
                <hr />
                <div style={{ margin: "0 3rem" }}>
                    {list.map((genre, index) => {
                        const genreSlug = encodeURIComponent(genre.toLowerCase().replace(/\s+/g, '-'));
                        return (
                            <button
                                key={index}
                                className="genre-btn"
                                onClick={() => {
                                    navigate(`/${type}/genres/${genreSlug}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                {genre}
                            </button>
                        );
                    })}
                </div>
                <div className="heading">{(type.charAt(0).toUpperCase() + type.replace("tv", "tV Shows").slice(1))} based on <span>{genre.replace("-", " ")}</span> genre :</div>
                <RenderList list={searchGenre} compact={true} showMore={false} />
            </div>
        </>
    )
}
