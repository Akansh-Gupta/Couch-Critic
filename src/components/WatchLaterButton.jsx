import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalContext } from './Context';

export default function WatchLaterButton({ item }) {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const { watchLater, toggleWatchLater } = useGlobalContext();
    const added = watchLater.some(w => w.simklId === item?.ids?.simkl);

    const handleClick = () => {
        if (!isAuthenticated) {
            localStorage.setItem("auth_return_to", window.location.pathname.replace(/^\/Couch-Critic/, "") || "/movie");
            loginWithRedirect();
            return;
        }
        toggleWatchLater(item);
    };

    return (
        <button className={`bookmark-btn ${added ? 'added' : ''}`} onClick={handleClick} aria-label="Watch later">
            <svg className="bookmark-icon" viewBox="0 0 24 24">
                <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z" />
            </svg>
        </button>
    );
}