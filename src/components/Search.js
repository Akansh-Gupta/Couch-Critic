import React from 'react'
import { useGlobalContext } from './Context'

export default function Search() {
  const { query, setQuery, isError } = useGlobalContext()
  return (
    <>
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          onSubmit={(e) => e.preventDefault()}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onDragStart={e => e.stopPropagation()}
        />
      </div>
      <div>
        <p className='error'>{isError.show && isError.msg}</p>
      </div>
    </>
  )
}
