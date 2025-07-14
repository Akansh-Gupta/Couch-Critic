import React from 'react';
import { useGlobalContext } from './Context';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Search() {
  const { query, setQuery, isError } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (["/movie", "/tv", "/anime"].includes(location.pathname)) return null

  const handleFocus = () => {
    const path = location.pathname;

    //   if (path === '/movie') {
    //   navigate('/search-movies');
    // }

    if (/^\/movies\/[^/]+\/[^/]+$/.test(path)) {
      navigate('/search-movies');
    } else if (/^\/tv\/[^/]+\/[^/]+$/.test(path)) {
      navigate('/search-tv');
    } else if (/^\/anime\/[^/]+\/[^/]+$/.test(path)) {
      navigate('/search-anime');
    }
  };


  return (
    <>
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onDragStart={e => e.stopPropagation()}
          onFocus={handleFocus}
        />
        <div>
          <p className='error'>{isError.show && isError.msg}</p>
        </div>
      </div>
    </>
  );
}
