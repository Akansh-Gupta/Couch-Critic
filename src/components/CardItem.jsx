import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaThumbsUp } from "react-icons/fa";
import WatchLaterButton from './WatchLaterButton';

export default function CardItem({ item, compact, itemType, itemId, itemName, url, watchLater }) {
    const {
        poster,
        title,
        title_en,
        en_title,
        ep_count,
        status,
        ratings,
        rank,
        anime_type,
        release_date,
        year,
        date,
        total_episodes,
        episode
    } = item;

    const posterURL = `https://simkl.in/posters/${poster}_m.jpg`;

    const rating = ratings?.mal?.rating || ratings?.imdb?.rating || ratings?.simkl?.rating;
    const votes = ratings?.mal?.votes || ratings?.imdb?.votes || ratings?.simkl?.votes;
    const itemRank = ratings?.mal?.rank || rank;
    const infoClass = compact ? 'cardInfo compact' : 'cardInfo';
    const watchLaterClass = watchLater ? '' : 'hidden';

    itemType = itemType === 'movie' ? 'movies' : itemType;

    if (url?.startsWith("/movie/")) {
        url = url.replace("/movie/", "/movies/");
    }

    return (
        <div className="card-wrapper">
            <div className="cardItem" style={{ backgroundImage: `url(${posterURL})` }}>
                <Link to={url || `/${itemType}/${itemId}/${itemName}`} onClick={() => window.scrollTo(0, 0)} draggable={false} style={{}}>
                    <img
                        loading='lazy'
                        src={posterURL}
                        className="cardImg"
                        alt="Poster"
                    />
                </Link>
                <div className="cardBody" >
                    <div className='cardTitle'>
                        <h5>{title || en_title || title_en}</h5>
                    </div>
                    <hr />
                    <ul className={infoClass}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '10px' }}>
                            {rating && <li>
                                <FaStar size={20} color='#ffc107' className='mb-1 me-1' />
                                {rating}
                            </li>}
                            {votes && <li>
                                <FaThumbsUp size={20} color='#0d6efd' className='mb-1 me-1' />
                                {votes}
                            </li>}
                        </div>
                        {episode && <li><b>Airing Episode :</b> {episode.episode}</li>}
                        {date ?
                            <li><b>Releasing :</b>{(new Date(date).toLocaleDateString("en-GB") === new Date().toLocaleDateString("en-GB")) ?
                                "Today"     // Releasing true
                                :
                                new Date(date).toLocaleDateString("en-GB").replaceAll("/", "-")}</li>       // Releasing false
                            : (release_date ?
                                <li><b>Released :</b>{new Date(release_date).toLocaleDateString("en-GB").replaceAll("/", "-")}</li>     // Released true
                                :
                                <li><b>Year :</b>{year}</li>)       // Released false
                        }
                        {date !== undefined && <li><b>Time :</b> {date === null ? "N/A" : new Date(date).toLocaleTimeString().replaceAll(":00", "")}</li>}
                        {ep_count && <li><b>Total Episodes :</b> {ep_count}</li>}
                        {total_episodes && <li><b>Total Episodes :</b> {total_episodes}</li>}
                        {anime_type && <li><b>Type :</b> {anime_type.charAt(0).toUpperCase() + anime_type.slice(1)}</li>}
                        {itemRank !== undefined && <li><b>Rank :</b> {itemRank === null ? "N/A" : itemRank}</li>}
                        {status && <li><b>Status :</b> {status.charAt(0).toUpperCase() + status.slice(1)}</li>}

                        <div className={watchLaterClass}>
                            <WatchLaterButton />
                        </div>
                    </ul>
                </div>
            </div>
            {/* </Link> */}
        </div>
    );
}
