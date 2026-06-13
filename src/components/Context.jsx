import React, { useCallback, useContext, useState, useRef } from "react";
import axios from "axios";
const AppContext = React.createContext();
const simklUrl = `https://api.simkl.com/search/`;
// const tmdb_key = import.meta.env.VITE_TMDB_API_KEY;
const simklKeys = [
    import.meta.env.VITE_SIMKL_CLIENT_ID_1
];

const fetchWithRotatingKeys = async (url) => {
    for (let i = 0; i < simklKeys.length; i++) {
        const key = simklKeys[i];
        try {
            const res = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "simkl-api-key": key
                }
            });
            return res; // Success
        } catch (error) {
            if (error.response?.status === 412) {
                console.warn(`API key ${i + 1} exhausted. Trying next...`);
                continue; // Try next key
            } else {
                // Other error (network, server, etc)
                console.error(`Request failed with key ${i + 1}:`, error.message);
                throw error;
            }
        }
    }

    // All keys failed with 412
    throw new Error("All API keys exhausted or failed.");
};


const AppProvider = ({ children }) => {
    const [movie, setMovie] = useState([]);
    const [shows, setShows] = useState([]);
    const [anime, setAnime] = useState([]);
    const [searchGenre, setSearchGenre] = useState([]);

    const [trendingMovie, setTrendingMovie] = useState([])
    const [trendingShows, setTrendingShows] = useState([])
    const [trendingAnime, setTrendingAnime] = useState([])

    const [airingShows, setAiringShows] = useState([])
    const [airingAnime, setAiringAnime] = useState([])

    const [upcomingShows, setUpcomingShows] = useState([])
    const [upcomingAnime, setUpcomingAnime] = useState([])

    const [isError, setIsError] = useState({ show: false, msg: "" });
    const [query, setQuery] = useState("");
    const [progress, setProgress] = useState(0);

    const searchCache = useRef({});     // cache for fetchInformation
    const trendingCache = useRef({});   // cache for fetchTrendingInformation   
    const airingCache = useRef({});   // cache for fetchAiringInformation   
    const upcomingCache = useRef({});   // cache for fetchUpcomingInformation   

    const setLoadingProgress = useCallback((progress) => {
        setProgress(progress);
    }, []);

    // const fetchMovieAndTv = useCallback(async (type, query) => {
    //     try {
    //         setLoadingProgress(10)
    //         const key = `${type}-query-${query.trim().toLowerCase()}`

    //         // Checking cached data
    //         if (searchCache.current[key]) {
    //             console.log(`Using cached data for ${key}`);
    //             const cachedData = searchCache.current[key];

    //             if (type === "movie") setMovie(cachedData);
    //             else if (type === "tv") setShows(cachedData);
    //             else if (type === "anime") setAnime(cachedData);

    //             setLoadingProgress(100);
    //             return;
    //         }

    //         // No cache data found
    //         let url = `https://api.themoviedb.org/3/search/${type}?query=${query}&page=1`
    //         const res = await axios.get(url, {
    //             headers: {
    //                 Accept: "application/json",
    //                 Authorization: `Bearer ${tmdb_key}`
    //             }
    //         })
    //         const data = res.data.results
    //         console.log("Searched Data:", data)
    //         console.log(data.length)

    //         setLoadingProgress(30)

    //         // Storing data in cache
    //         searchCache.current[key] = data;

    //         if (type === "movie") {
    //             setMovie(data);
    //         } else if (type === "tv") {
    //             setShows(data);
    //         } else if (type === "anime") {
    //             setAnime(data);
    //         }

    //         if (data.length === 0) {
    //             setIsError({ show: true, msg: `No ${type} found for your search.` });
    //             setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
    //         }
    //         setTimeout(() => setLoadingProgress(100), 800);

    //     } catch (error) {
    //         console.error(error);
    //         setIsError({
    //             show: true,
    //             msg: `Failed to fetch ${type} data.`,
    //         });
    //         setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
    //         setTimeout(() => setLoadingProgress(100), 800);
    //     }
    // }, [setLoadingProgress])

    // const fetchAnime = useCallback(async (query) => {
    //     try {
    //         setLoadingProgress(10)
    //         const res = await axios(`https://api.jikan.moe/v4/anime?q=${query}`)
    //         const data = res.data;
    //         setLoadingProgress(30)
    //         console.log("Searched anime data:", data)
    //         setAnime(data)
    //         setTimeout(() => setLoadingProgress(100), 800);
    //     } catch (error) {
    //         console.error(error);
    //         setIsError({
    //             show: true,
    //             msg: `Failed to fetch ${genre ? "genre" : type} data.`,
    //         });
    //         setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
    //         setTimeout(() => setLoadingProgress(100), 800);
    //     }
    // }, [setLoadingProgress])

    const fetchInformation = useCallback(async (type, query = "", genre = "") => {
        genre = genre === "documentary" ? "documentaries" : genre;
        // Here caching is done inside the try block because key is complex and generated dynamically
        // and to prevent bugs caused by undefinde values
        try {
            setLoadingProgress(10);
            const key = genre ? `${type}-genre-${genre}` : `${type}-query-${query.trim().toLowerCase()}`;

            // Checking cached data
            if (searchCache.current[key]) {
                console.log(`Using cached data for ${key}`);
                const cachedData = searchCache.current[key];

                if (genre) setSearchGenre(cachedData);
                else if (type === "movie") setMovie(cachedData);
                else if (type === "tv") setShows(cachedData);
                else if (type === "anime") setAnime(cachedData);

                setLoadingProgress(100);
                return;
            }

            // No cache data found
            let url = "";
            url = genre ? `https://api.simkl.com/${type}/genres/${genre}/type/country/this-year/sort` : `${simklUrl}${type}?q=${query.trim()}&page=1&limit=50&extended=full`
            const res = await fetchWithRotatingKeys(url);
            const data = res.data

            setLoadingProgress(30);
            console.log(`Fetched ${genre ? "Genre" : type} Data:`, data);

            // Storing data in cache
            searchCache.current[key] = data;

            if (genre) {
                setSearchGenre(data);
            } else if (type === "movie") {
                setMovie(data);
            } else if (type === "tv") {
                setShows(data);
            } else if (type === "anime") {
                setAnime(data);
            }

            if (!genre && data.length === 0) {
                setIsError({ show: true, msg: `No ${type} found for your search.` });
                setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
            }

            setTimeout(() => setLoadingProgress(100), 800);
        } catch (error) {
            console.error(error);
            setIsError({
                show: true,
                msg: `Failed to fetch ${genre ? "genre" : type} data.`,
            });
            setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
            setTimeout(() => setLoadingProgress(100), 800);
        }
    }, [setLoadingProgress]);

    const fetchTrendingInformation = useCallback(async (type) => {
        // Here caching is done outside the try block because the key is simple
        // Checking cached data
        if (trendingCache.current[type]) {
            console.log(`Using cached trending ${type}`);
            const cachedData = trendingCache.current[type];

            if (type === "movies") setTrendingMovie(cachedData);
            else if (type === "tv") setTrendingShows(cachedData);
            else setTrendingAnime(cachedData);

            return;
        }
        // No cache data found
        try {
            // const res = await axios.get(`https://api.simkl.com/${type}/trending/today?extended=overview,genres,metadata`)
            const res = await fetchWithRotatingKeys(`https://api.simkl.com/${type}/trending/today?extended=overview,genres,metadata`)
            const data = res.data
            console.log(`Fetched Trending ${type} Data:`, data);
            // Storing data in cache
            trendingCache.current[type] = data;
            if (type === "movies") {
                setTrendingMovie(data)
            } else if (type === "tv") {
                setTrendingShows(data)
            } else {
                setTrendingAnime(data)
            }
        } catch (error) {
            console.log(error)
            setIsError({ show: true, msg: `Failed to fetch trending ${type}.` });
            setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
        }
    }, [])

    const fetchAiringInformation = useCallback(async (type) => {
        // Here caching is done outside the try block because the key is simple
        // Checking cached data
        if (airingCache.current[type]) {
            console.log(`Using cached airing ${type}`);
            const cachedData = airingCache.current[type];

            if (type === "anime") setAiringAnime(cachedData);
            else setAiringShows(cachedData);
            return;
        }
        // No cache data found
        try {
            const res = await fetchWithRotatingKeys(`https://api.simkl.com/${type}/airing?date=today&sort=time`)
            const data = res.data
            console.log(`Fetched Airing ${type} Data:`, data);
            // Storing data in cache
            airingCache.current[type] = data;
            if (type === "anime") {
                setAiringAnime(data)
            } else {
                setAiringShows(data)
            }
        } catch (error) {
            console.log(error)
            setIsError({ show: true, msg: `Failed to fetch airing ${type}.` });
            setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
        }
    }, [])

    const fetchUpcomingInformation = useCallback(async (type) => {
        // Here caching is done outside the try block because the key is simple
        // Checking cached data
        if (upcomingCache.current[type]) {
            console.log(`Using cached upcoming ${type}`);
            const cachedData = upcomingCache.current[type];

            if (type === "anime") setUpcomingAnime(cachedData);
            else setUpcomingShows(cachedData);
            return;
        }
        // No cache data found
        try {
            const res = await fetchWithRotatingKeys(`https://api.simkl.com/${type}/premieres?param=soon&type=all`)
            const data = res.data
            console.log(`Fetched Upcoming ${type} Data:`, data);
            // Storing data in cache
            upcomingCache.current[type] = data;
            if (type === "anime") {
                setUpcomingAnime(data)
            } else {
                setUpcomingShows(data)
            }
        } catch (error) {
            console.log(error)
            setIsError({ show: true, msg: `Failed to fetch airing ${type}.` });
            setTimeout(() => setIsError({ show: false, msg: "" }), 3000);
        }
    }, [])

    // const renderList = ({ id = "", list = [], type = "", noResult = false, compact = true, filterPremiere = false, filterUpcoming = false }) => {
    //     const resultClass = noResult ? "no-results" : "no-results hidden";
    //     let filteredList = list
    //     if (filterPremiere) {
    //         filteredList = list.filter(item => item.status === "premiere")
    //     } else if (filterUpcoming) {
    //         filteredList = list.filter(item => item.status === "soon")
    //     }

    //     return (
    //         <>
    //             <section className='result-container' id={id}>
    //                 {filteredList.length === 0 && <div className={resultClass}>Search to find {type?.toUpperCase()} Information</div>}
    //                 {filteredList.filter(item => item.poster).map((curItem, index) => (
    //                     <CardItem item={curItem} index={index} key={curItem.ids.simkl || index} url={curItem.url} compact={compact} />
    //                 ))}
    //             </section>
    //         </>
    //     )
    // };

    // const showSearchedMovie = () => renderList({ list: movie, noResult: true, type: "movies", compact: false });
    // const showSearchedShows = () => renderList({ list: shows, noResult: true, type: "tv", compact: false });
    // const showSearchedAnime = () => renderList({ list: anime, noResult: true, type: "anime", compact: false });
    // const showSearchedGenre = () => renderList({ list: genre, noResult: true, compact: true });

    // const showTrendingMovie = () => renderList({ list: trendingMovie });
    // const showTrendingShows = () => renderList({ list: trendingShows });
    // const showTrendingAnime = () => renderList({ list: trendingAnime });

    // const moviePremiere = () => renderList({ list: trendingMovie, filterPremiere: true });
    // const showsPremiere = () => renderList({ list: trendingShows, filterPremiere: true });
    // const animePremiere = () => renderList({ list: trendingAnime, filterPremiere: true });

    // const showAiringAnime = () => renderList({ list: airingAnime })
    // const showAiringShows = () => renderList({ list: airingShows })

    // const showUpcomingShows = () => renderList({ list: upcomingShows });
    // const showUpcomingAnime = () => renderList({ list: upcomingAnime });

    //This is the return of the AppProvider component
    return (
        <AppContext.Provider value={{
            isError,
            query,
            progress,

            movie,
            // setMovie,
            shows,
            // setShows,
            anime,
            searchGenre,

            trendingMovie,
            trendingShows,
            trendingAnime,

            airingAnime,
            airingShows,

            upcomingShows,
            upcomingAnime,

            setQuery,
            setProgress,
            setLoadingProgress,

            fetchInformation,
            fetchTrendingInformation,
            fetchAiringInformation,
            fetchUpcomingInformation,

            // fetchAnime
            // fetchMovieAndTv
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => useContext(AppContext);

export { AppContext, AppProvider, useGlobalContext };
