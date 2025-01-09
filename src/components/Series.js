import React from 'react'
import { useGlobalContext } from './Context'

export default function Series() {
    const { fetchMovie } = useGlobalContext()
    return (
        <div className='result-background'>
            {fetchMovie("series")}
        </div>
    )
}
