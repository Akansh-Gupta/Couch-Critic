import React, { useCallback, useContext, useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const AppContext = React.createContext();
const simklUrl = `https://api.simkl.com/search/`;
const simklKeys = [
    import.meta.env.VITE_SIMKL_CLIENT_ID_1
];
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [watchLater, setWatchLater] = useState([]);

    const searchCache = useRef({});     // cache for fetchInformation
    const trendingCache = useRef({});   // cache for fetchTrendingInformation   
    const airingCache = useRef({});   // cache for fetchAiringInformation   
    const upcomingCache = useRef({});   // cache for fetchUpcomingInformation   

    useEffect(() => {
        if (!isAuthenticated) { setWatchLater([]); return; }
        (async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await axios.get(`${API}/watchlater`, { headers: { Authorization: `Bearer ${token}` } });
                setWatchLater(res.data);
            } catch (e) { console.error(e); }
        })();
    }, [isAuthenticated, getAccessTokenSilently]);

    const setLoadingProgress = useCallback((progress) => {
        setProgress(progress);
    }, []);

    const toggleWatchLater = useCallback(async (item) => {
        const id = Number(item.ids?.simkl_id ?? item.ids?.simkl);
        if (!id) return;
        const exists = watchLater.some(w => w.simklId === id);
        try {
            const token = await getAccessTokenSilently();
            const headers = { Authorization: `Bearer ${token}` };
            if (exists) {
                await axios.delete(`${API}/watchlater/${id}`, { headers });
                setWatchLater(prev => prev.filter(w => w.simklId !== id));
            } else {
                const doc = { simklId: id, item };
                await axios.post(`${API}/watchlater`, doc, { headers });
                setWatchLater(prev => [...prev, doc]);
            }
        } catch (e) { console.error(e); }
    }, [watchLater, getAccessTokenSilently]);

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

    //This is the return of the AppProvider component
    return (
        <AppContext.Provider value={{
            watchLater,
            toggleWatchLater,

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
