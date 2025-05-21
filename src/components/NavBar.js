import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Search from './Search'

export default function NavBar() {
    const [color, setColor] = useState()
    const changeColor = () => {
        if (window.scrollY >= 50) {
            setColor(true)
        } else {
            setColor(false)
        }
    }
    window.addEventListener('scroll', changeColor)
    return (
        <div>
            <div className={color ? "header header-bg" : "header"}>
                <Link to="/" className="logo">Couch Critic</Link>
                <ul className="nav">
                    <li><NavLink to="/" className="listItem">Home</NavLink></li>
                    <li><NavLink to="/movies" className="listItem">Movies</NavLink></li>
                    <li><NavLink to="/series" className="listItem">Series</NavLink></li>
                    {/* <li class="nav-item dropdown">
                        <NavLink class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Akansh
                        </NavLink>
                        <ul class="dropdown-menu">
                            <li><Link to="/" class="dropdown-item">Log Out</Link></li>
                        </ul>
                    </li> */}
                </ul>
                <NavLink to="/movies" draggable={false}><Search /></NavLink>
            </div>
        </div>
    )
}