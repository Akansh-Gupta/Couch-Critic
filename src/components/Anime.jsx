import { useState, useEffect } from 'react';
import { useGlobalContext } from './Context';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from './Loading';
import Carousel from './Carousel';
import RenderList from './RenderList';
export default function Anime() {
    const [isLoading, setIsLoading] = useState(true);
    const {
        fetchTrendingInformation,
        fetchAiringInformation,
        fetchUpcomingInformation,
        trendingAnime,
        upcomingAnime,
        airingAnime } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTrendingInformation("anime"),
                fetchAiringInformation("anime"),
                fetchUpcomingInformation("anime")
            ]);
            setIsLoading(false);
        };
        fetchData();
    }, [fetchTrendingInformation, fetchAiringInformation, fetchUpcomingInformation]);

    if (isLoading) {
        return <Loading />;
    }

    const premiereItems = trendingAnime?.filter(item =>
        item.status === "premiere"
    );
    return (
        <div>
            <Carousel list={trendingAnime} />
            {airingAnime && <>
                <div className="heading" >Airing Today :</div>
                <RenderList list={airingAnime} showRating={false}/>
                <hr />
            </>}
            <div className="heading">Upcoming Anime :</div>
            <RenderList list={upcomingAnime} showRating={false}/>
            <hr />
            {premiereItems?.length > 0 && <>
                <div className="heading" >New Releases :</div>
                <RenderList list={premiereItems} />
                {/* <RenderList list={trendingAnime} filterPremiere={true} /> */}
                <hr />
            </>}
            <div className="heading" >Trending Now :</div>
            <RenderList list={trendingAnime} />
        </div>
    );
}
