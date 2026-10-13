import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { API } from '../api';

export default function Login() {
    const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${API}/protected`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Protected Route Response:", response.data);
        } catch (error) {
            console.error("Error getting access token:", error);
        }
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (isAuthenticated) getToken();
    }, [isAuthenticated, user, getToken]);

    const fallbackImg = (e) => {
        e.target.onerror = null;
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff`;
    };

    const displayName = user?.sub?.startsWith("google-oauth2|")
        ? user.name
        : (user?.["https://couch-critic/username"] || user?.email?.split("@")[0]);

    return (
        <>
            {isAuthenticated ? (
                <div className="nav-item dropdown">
                    <div className="nav-link dropdown-toggle d-flex" style={{ gap: '5px' }} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img className="userimg" src={user?.picture} alt="" referrerPolicy="no-referrer" onError={fallbackImg} />
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end user-menu" aria-labelledby="navbarDropdown">
                        <li className="user-menu-header">
                            <img className="dropDownUserImg" src={user?.picture} alt="" referrerPolicy="no-referrer" onError={fallbackImg} />
                            <div className="user-menu-name">{displayName}</div>
                            {user?.email && <div className="user-menu-email">{user.email}</div>}
                        </li>
                        <li><hr className="user-menu-divider" /></li>
                        <li>
                            <Link to="/profile" className="user-menu-item">
                                <FaUser size={16} /> View Profile
                            </Link>
                        </li>
                        <li>
                            <button className="user-menu-item user-menu-logout" onClick={() => logout({ logoutParams: { returnTo: window.location.origin + '/Couch-Critic/' } })}>
                                <IoIosLogOut size={20} /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            ) : (
                <button className="loginbtn" onClick={() => {
                    const returnTo = window.location.pathname.replace(/^\/Couch-Critic/, "") || "/movie";
                    localStorage.setItem("auth_return_to", returnTo);
                    loginWithRedirect();
                }}>Login <IoIosLogIn size={20} /></button>
            )}
        </>
    );
}