import { useState, useEffect } from 'react';
import { useGlobalContext } from './Context';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from './Loading';
import Carousel from './Carousel';
import RenderList from './RenderList';
export default function Shows() {
    const [isLoading, setIsLoading] = useState(true);
    const {
        fetchTrendingInformation,
        fetchAiringInformation,
        fetchUpcomingInformation,
        trendingShows,
        airingShows,
        upcomingShows } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTrendingInformation("tv"),
                fetchAiringInformation("tv"),
                fetchUpcomingInformation("tv")
            ]);
            setIsLoading(false);
        };
        fetchData();
    }, [fetchTrendingInformation, fetchAiringInformation, fetchUpcomingInformation]);

    if (isLoading) {
        return <Loading />;
    }

    const premiereItems = trendingShows?.filter(item =>
        item.status === "premiere"
    );
    return (
        <div>
            <Carousel list={trendingShows} />
            {premiereItems?.length > 0 && <>
                <div className="heading">Premiering Now :</div>
                <RenderList list={premiereItems} />
                {/* <RenderList list={trendingShows} filterPremiere={true} /> */}
                <hr />
            </>}
            <div className="heading">Upcoming Shows :</div>
            <RenderList list={upcomingShows} />
            <hr />

            {airingShows && <>
                <div className="heading">Airing Today :</div>
                <RenderList list={airingShows} />
                <hr />
            </>}
            <div className="heading">Trending TV Shows :</div>
            <RenderList list={trendingShows} />
        </div>
    );
}
