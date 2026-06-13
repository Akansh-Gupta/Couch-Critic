import { useState } from 'react';
import { FaPlusCircle, FaCheckCircle } from 'react-icons/fa';

export default function WatchLaterButton() {
    const [added, setAdded] = useState(false);

    const handleClick = () => {
        setAdded(prev => !prev)

    };

    return (<>
        <button
            className={`watch-later-btn ${added ? 'added' : ''}`}
            onClick={handleClick}
        >
            <span className="icon">{added ? <FaCheckCircle color='#00c853' /> : <FaPlusCircle color='#ff5323' />}</span>
            <span className="icon-text">{added ? "Added" : "Watch Later"}</span>
        </button>
    </>

    );
}
