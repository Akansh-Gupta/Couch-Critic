import React from 'react'
import { useGlobalContext } from './Context'

export default function Movies() {
    const { fetchMovie } = useGlobalContext()

    return (
        <div className='result-background'>
            {fetchMovie("movie")}
        </div>
    )
}
