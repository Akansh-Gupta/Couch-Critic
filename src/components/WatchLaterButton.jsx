import React from 'react';
import { useGlobalContext } from './Context';

export default function WatchLaterButton({ item }) {
    const { watchLaterList, toggleWatchLater } = useGlobalContext();
    const added = watchLaterList.some(i => i.ids?.simkl_id === item.ids?.simkl_id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchLater(item);
    };

    return (
        <button
            className={`bookmark-btn${added ? ' added' : ''}`}
            onClick={handleClick}
            aria-label={added ? "Remove from Watch Later" : "Add to Watch Later"}
        >
            <svg className="bookmark-icon" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2 L2 30 L12 22 L22 30 L22 2 Z" />
            </svg>
        </button>
    );
}