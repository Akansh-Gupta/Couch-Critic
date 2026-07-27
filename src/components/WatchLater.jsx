import React from 'react'
import { useGlobalContext } from './Context'
import RenderList from './RenderList'

export default function WatchLater() {
    const { watchLaterList } = useGlobalContext();

    return (
        <div className='search-result-background'>
            <div className="heading">Watch Later :</div>
            <RenderList list={watchLaterList} noResult={true} compact={false} showMore={false} watchLater={true} />
        </div>
    )
}