import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Search from './Search'
import Login from './Login'
import { FaSearch, FaFilm, FaTv, FaHome } from 'react-icons/fa'
import { SiCrunchyroll } from 'react-icons/si'
import { MdOutlineWatchLater } from 'react-icons/md'
import { BsCollectionFill } from 'react-icons/bs'

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
                    {!showRoute && (
                        <li>
                            <NavLink to="/" className="listItem">
                                <FaHome className="nav-icon" /> Home
                            </NavLink>
                        </li>
                    )}
                    {showRoute && (
                        <li>
                            <NavLink to="/movie" className="listItem">
                                <FaFilm className="nav-icon" /> Movies
                            </NavLink>
                        </li>
                    )}
                    {showRoute && (
                        <li>
                            <NavLink to="/tv" className="listItem">
                                <FaTv className="nav-icon" /> TV Shows
                            </NavLink>
                        </li>
                    )}
                    {showRoute && (
                        <li>
                            <NavLink to="/anime" className="listItem">
                                <SiCrunchyroll className="nav-icon" /> Anime
                            </NavLink>
                        </li>
                    )}
                    {location.pathname === "/movie" && (
                        <li>
                            <NavLink to="/movies/genres/action" className="listItem">
                                <BsCollectionFill className="nav-icon" /> Genres
                            </NavLink>
                        </li>
                    )}
                    {location.pathname === "/tv" && (
                        <li>
                            <NavLink to="/tv/genres/action" className="listItem">
                                <BsCollectionFill className="nav-icon" /> Genres
                            </NavLink>
                        </li>
                    )}
                    {location.pathname === "/anime" && (
                        <li>
                            <NavLink to="/anime/genres/action" className="listItem">
                                <BsCollectionFill className="nav-icon" /> Genres
                            </NavLink>
                        </li>
                    )}
                    {matchedType && (
                        <li>
                            <NavLink to={`/${matchedType}/genres/action`} className="listItem">
                                <BsCollectionFill className="nav-icon" /> Genres
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to="/watchlater" className="listItem">
                            <MdOutlineWatchLater className="nav-icon" /> Watch Later
                        </NavLink>
                    </li>
                    {showRoute && (
                        <li>
                            <NavLink to="/search-movies" className="listItem">
                                <FaSearch className="nav-icon" color='#ff3700' /> Search
                            </NavLink>
                        </li>
                    )}
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