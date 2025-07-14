import React, { useEffect } from 'react';
import { useGlobalContext } from './Context';
import { NavLink } from 'react-router-dom';
import RenderList from './RenderList';

export default function SearchMovies() {
    const { query, fetchInformation, movie } = useGlobalContext();

    useEffect(() => {
        if (!query) return;
        const timer = setTimeout(() => {
            fetchInformation("movie", query)
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, fetchInformation]);

    return (
        <div className='search-result-background'>
            <ul className="nav">
                <li><NavLink to="/search-movies" className="listItem listitem">Movies</NavLink></li>
                <li><NavLink to="/search-tv" className="listItem listitem">TV Shows</NavLink></li>
                <li><NavLink to="/search-anime" className="listItem listitem">Anime</NavLink></li>
            </ul>
            <hr />
            <RenderList list={movie} noResult={true} type="movies" compact={false} showMore={false}/>
        </div>
    );
}
