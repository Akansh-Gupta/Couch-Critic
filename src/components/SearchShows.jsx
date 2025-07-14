import React, { useEffect } from 'react';
import { useGlobalContext } from './Context';
import { NavLink } from 'react-router-dom';
import RenderList from './RenderList';

export default function SearchShows() {
    const { query, fetchInformation, shows } = useGlobalContext();

    useEffect(() => {
        if (!query) return;
        const timer = setTimeout(() => {
            fetchInformation("tv", query)
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
            <RenderList list={shows} noResult={true} type="tv" compact={false} showMore={false}/>
        </div>
    );
}
