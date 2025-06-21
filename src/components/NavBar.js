import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Search from './Search'
// import { useAuth0 } from '@auth0/auth0-react'
import Login from './Login'

export default function NavBar() {
    // const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [color, setColor] = useState()
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
                <Link to="/" className="logo">Couch Critic</Link>
                <NavLink to="/movie" draggable={false}><Search /></NavLink>
                <ul className="nav">
                    <li><NavLink to="/" className="listItem">Home</NavLink></li>
                    <li><NavLink to="/movie" className="listItem">Movies</NavLink></li>
                    <li><NavLink to="/series" className="listItem">Series</NavLink></li>
                </ul>
                <Login />
            </div>
        </div>
    )
}