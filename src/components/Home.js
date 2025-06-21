import { useCallback, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { url, useGlobalContext } from './Context';
import Carousel from './Carousel';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [movieData, setMovieData] = useState({});
    const { setLoadingProgress } = useGlobalContext();

    const queries = useMemo(() => [
        { key: 'starWars', label: 'STAR WARS', term: 'star wars' },
        { key: 'missionImpossible', label: 'MISSION IMPOSSIBLE', term: 'mission impossible' },
        { key: 'harryPotter', label: 'HARRY POTTER', term: 'harry potter' },
        { key: 'fastFurious', label: 'FAST & FURIOUS', term: 'fast' },
        { key: 'batman', label: 'BATMAN', term: 'batman' },
        { key: 'jurassic', label: 'JURASSIC PARK', term: 'jurassic' }
    ], []);

    const getMovies = useCallback(async (searchTerm, key) => {
        try {
            setLoadingProgress(10);
            const res = await axios.get(`${url}&s=${searchTerm}`);
            setLoadingProgress(30);
            const data = await res.data;
            setLoadingProgress(60);

            if (data.Response === "True") {
                setMovieData(prev => ({ ...prev, [key]: data.Search }));
                setLoadingProgress(100);
            }
        } catch (error) {
            console.error(`Error fetching ${searchTerm}`, error);
        }
    }, [setLoadingProgress]);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            await Promise.all(queries.map(({ term, key }) => getMovies(term, key)));
            setIsLoading(false);
        };

        const timeout = setTimeout(fetchAll, 500);
        return () => clearTimeout(timeout);
    }, [getMovies, queries]);

    if (isLoading) {
        return (
            <div className='movie-section'>
                <div className='loading'>
                    <img src={`${process.env.PUBLIC_URL}/images/logo/loading.gif`} alt="Loading..." /> <br />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            <Carousel />

            {queries.map(({ key, label }) => (
                <div key={key}>
                    <div className='movie-name'>{label} :</div>
                    <hr />
                    <section className='cardContainer'>
                        {movieData[key]?.slice().sort((a, b) => b.Year - a.Year).map(({ imdbID, Title, Poster, Type, Year }) => {
                            const movieName = Title.substring(0, 40);
                            if (Type === "movie" && Poster !== "N/A") {
                                return (
                                    <div className="cardItem" key={imdbID}>
                                        <Link to={`/movie/${imdbID}`} draggable={false}>
                                            <img src={Poster} className="cardImg" alt={Title} draggable={false} referrerPolicy='no-referrer' />
                                        </Link>
                                        <div className="cardBody">
                                            <h6>{movieName.length > 39 ? `${movieName}...` : movieName}</h6>
                                            <div className='released'>Released : {Year}</div>
                                            <hr />
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </section>
                </div>
            ))}
        </div>
    );
}
