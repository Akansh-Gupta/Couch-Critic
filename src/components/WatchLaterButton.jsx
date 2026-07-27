import React, { useState } from 'react';

export default function WatchLaterButton() {
    const [added, setAdded] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdded(prev => !prev);
        // TODO: persist to backend/localStorage
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