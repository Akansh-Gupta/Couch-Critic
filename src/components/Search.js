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
            setQuery(e.target.value)
          }} 
          />
      </div>
      <div>
          <p className='error'>{isError.show && isError.msg}</p>
      </div>
    </>
  )
}
