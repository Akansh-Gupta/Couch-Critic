import { useState, useEffect } from 'react';
import { useGlobalContext } from './Context';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from './Loading';
import Carousel from './Carousel';
import RenderList from './RenderList';
export default function Movie() {
    const [isLoading, setIsLoading] = useState(true);
    const { fetchTrendingInformation, trendingMovie } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchTrendingInformation("movies")
            setIsLoading(false);
        };
        fetchData();
    }, [fetchTrendingInformation]);

    if (isLoading) {
        return <Loading />;
    }

    const premiereItems = trendingMovie?.filter(item =>
        item.status === "premiere"
    );
    return (
        <div>
            <Carousel list={trendingMovie} />
            {premiereItems.length > 0 && <>
                <div className="heading">Premiering Now :</div>
                <RenderList list={premiereItems}/>
                {/* <RenderList list={trendingMovie} filterPremiere={true}/> */}
                <hr />
            </>}
            <div className="heading">Trending Movies :</div>
            <RenderList list={trendingMovie}/>
        </div>
    );
}
