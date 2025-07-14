import { useState, useEffect } from 'react';
import CardItem from './CardItem';

export default function RenderList({
    // id = "",
    list = [],
    type = "",
    noResult = false,
    compact = true,
    // filterPremiere = false,
    showMore = true,
    watchLater = true
}) {
    const [visibleCount, setVisibleCount] = useState(showMore ? 18 : list.length);

    useEffect(() => {
        setVisibleCount(showMore ? 18 : list.length);
    }, [list, showMore]);

    // let filteredList = filterPremiere
    //     ? list.filter(item => item.status === "premiere")
    //     : list;

    const posterList = list.filter(item => item.poster);

    const visibleList = showMore
        ? posterList.slice(0, visibleCount)
        : posterList;
    const resultClass = noResult ? "no-results" : "no-results hidden";

    return (
        <>
            <section className='result-container'>
                {posterList.length === 0 && (
                    <div className={resultClass}>
                        Search to find {type?.toUpperCase()} Information
                    </div>
                )}

                {visibleList.map((curItem, index) => (
                    <CardItem
                        item={curItem}
                        index={index}
                        key={curItem.ids?.simkl || index}
                        url={curItem.url}
                        compact={compact}
                        watchLater={watchLater}
                    />
                ))}
            </section>

            {visibleCount < posterList.length && (
                <div className="load-more-wrapper">
                    <button onClick={() => setVisibleCount(prev => prev + 18)} className="load-more-btn">
                        Show More
                    </button>
                </div>
            )}
        </>
    );
}