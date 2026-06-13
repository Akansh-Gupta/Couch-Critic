import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Search from './Search'
import Login from './Login'
import { FaSearch } from 'react-icons/fa'
import { BsFillCameraReelsFill, BsFillTvFill } from "react-icons/bs";
import { GiMagicGate } from "react-icons/gi";
import { FaMasksTheater } from "react-icons/fa6";
import { MdWatchLater } from "react-icons/md";
import { FaCouch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

export default function NavBar() {
    const location = useLocation();
    const [color, setColor] = useState(false)

    const showRoute = ["/movie", "/tv", "/anime"].includes(location.pathname)

    const match = location.pathname.match(/^\/(movies|tv|anime)\/\d+/);
    const matchedType = match?.[1];

    useEffect(() => {
        const changeColor = () => {
            if (window.scrollY >= 50) {
                setColor(true)
            } else {
                setColor(false)
            }
        }
        window.addEventListener('scroll', changeColor)
        return () => window.removeEventListener('scroll', changeColor)
    }, [])

    return (
        <div>
            <div className={color ? "header header-bg" : "header"}>
                <Link to="/movie" className="logo"><FaCouch className='mb-1' color='#ff5323' size={55}/> Couch Critic</Link>
                <Search />
                <ul className="nav">
                    {!showRoute && <li><NavLink to="/" className="listItem"><FaHome size={25}/> Home</NavLink></li>}
                    {showRoute && <li><NavLink to="/movie" className="listItem"><BsFillCameraReelsFill className='mb-1' size={25}/> Movies</NavLink></li>}
                    {showRoute && <li><NavLink to="/tv" className="listItem"><BsFillTvFill className='mb-1' size={25}/> TV Shows</NavLink></li>}
                    {showRoute && <li><NavLink to="/anime" className="listItem"><GiMagicGate className='mb-1' size={25}/> Anime</NavLink></li>}
                    {location.pathname === "/movie" && <li><NavLink to="/movies/genres/action" className="listItem"><FaMasksTheater className='mb-1' size={25}/> Genres</NavLink></li>}
                    {location.pathname === "/tv" && <li><NavLink to="/tv/genres/action" className="listItem"><FaMasksTheater className='mb-1' size={25}/> Genres</NavLink></li>}
                    {location.pathname === "/anime" && <li><NavLink to="/anime/genres/action" className="listItem"><FaMasksTheater className='mb-1' size={25}/> Genres</NavLink></li>}
                    {matchedType && <li><NavLink to={`/${matchedType}/genres/action`} className="listItem"><FaMasksTheater className='mb-1' size={25}/> Genres</NavLink></li>}
                    <li><NavLink to="/watch-later" className="listItem"><MdWatchLater className='mb-1' size={25}/> Watch Later</NavLink></li>
                    {showRoute && <li><NavLink to="/search-movies" className="listItem"><FaSearch className='mb-1' size={25}/> Search</NavLink></li>}
                </ul>
                <Login />
            </div>
        </div >
    )
}