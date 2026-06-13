import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Search from './Search'
import Login from './Login'
import { FaSearch } from 'react-icons/fa'

export default function NavBar() {
    const location = useLocation();
    const [color, setColor] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const showRoute = ["/movie", "/tv", "/anime"].includes(location.pathname);
    const match = location.pathname.match(/^\/(movies|tv|anime)\/\d+/);
    const matchedType = match?.[1];

    useEffect(() => {
        const changeColor = () => setColor(window.scrollY >= 50);
        window.addEventListener('scroll', changeColor);
        return () => window.removeEventListener('scroll', changeColor);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <div>
            <div className={color ? "header header-bg" : "header"}>
                <Link to="/movie" className="logo">Couch Critic</Link>
                <Search />

                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`nav ${menuOpen ? 'open' : ''}`}>
                    {!showRoute && <li><NavLink to="/" className="listItem">Home</NavLink></li>}
                    {showRoute && <li><NavLink to="/movie" className="listItem">Movies</NavLink></li>}
                    {showRoute && <li><NavLink to="/tv" className="listItem">TV Shows</NavLink></li>}
                    {showRoute && <li><NavLink to="/anime" className="listItem">Anime</NavLink></li>}
                    {location.pathname === "/movie" && <li><NavLink to="/movies/genres/action" className="listItem">Genres</NavLink></li>}
                    {location.pathname === "/tv" && <li><NavLink to="/tv/genres/action" className="listItem">Genres</NavLink></li>}
                    {location.pathname === "/anime" && <li><NavLink to="/anime/genres/action" className="listItem">Genres</NavLink></li>}
                    {matchedType && <li><NavLink to={`/${matchedType}/genres/action`} className="listItem">Genres</NavLink></li>}
                    <li><NavLink to="/watchlater" className="listItem">Watch Later</NavLink></li>
                    {showRoute && <li><NavLink to="/search-movies" className="listItem">Search <FaSearch color='#ff3700' /></NavLink></li>}
                    <li className="mobile-login">
                        <Login />
                    </li>
                </ul>

                <div className="desktop-login">
                    <Login />
                </div>
            </div>
        </div>
    );
}