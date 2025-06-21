import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';
import { useCallback, useEffect } from 'react';


export default function Login() {
    const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const getToken = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            console.log("Access Token:", token);
            const response = await axios.get('http://localhost:4000/protected', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Protected Route Response:", response.data);
        }
        catch (error) {
            console.error("Error getting access token:", error);
        }
    },[getAccessTokenSilently])

    useEffect(() => {
        if (isAuthenticated) {
            getToken();
            console.log(user);
        } else {
            console.log("not authenticated");
        }
    }, [isAuthenticated, user, getToken]);
    return (
        <>
            {isAuthenticated ?
                <div className="nav-item dropdown">
                    <div className="nav-link dropdown-toggle d-flex" style={{ gap: '5px' }} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img className='userimg' src={user?.picture} alt="" referrerPolicy="no-referrer" onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff`;;
                        }} />
                        <div className='username'>Hello, {user?.sub?.startsWith("google-oauth2|")
                            ? (
                                user.name?.length > 15
                                    ? user.name.substring(0, 16) + '...'
                                    : user.name
                            )
                            : (
                                user?.["https://couch-critic/username"]
                                    ? user["https://couch-critic/username"]
                                    : user?.email?.split("@")[0]
                            )}
                        </div>
                    </div>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><button className='loginbtn' onClick={() => logout({ returnTo: window.location.origin })}>Logout</button> </li>
                    </ul>
                </div>
                :
                <button className='loginbtn' onClick={() => loginWithRedirect({appState: { returnTo: window.location.pathname }})}>Login</button>}
        </>
    )
}