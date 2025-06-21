import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
const AppContext = React.createContext();
let apiKey = process.env.REACT_APP_API_KEY;

export const url = `https://www.omdbapi.com/?apikey=${apiKey}`

const AppProvider = ({ children }) => {
    const [movie, setMovie] = useState([])
    const [isError, setIsError] = useState({ show: false, msg: "" })
    const [query, setQuery] = useState("avengers")
    const [progress, setProgress] = useState(0)

    const fetchMovie = (movieType) => {
        return (
            <>
                <div className="heading">Recently Searched {movieType.charAt(0).toUpperCase() + movieType.slice(1)}</div> <hr />
                <section className='cardContainer' style={{ flexWrap: "wrap", justifyContent: "start", margin: "0 110px" }}>
                    {movie.map((curMovie) => {
                        const { imdbID, Title, Poster, Type, Year } = curMovie
                        const movieName = Title.substring(0, 24)
                        if (Type === movieType && Poster !== "N/A") {
                            return (
                                <div className="cardItem" key={imdbID}>
                                    <Link to={`/${Type}/${imdbID}`} draggable={false}>
                                        <img src={Poster} className="cardImg" alt='' style={{ background: `url(${process.env.PUBLIC_URL}/images/image-not-found.png)`, backgroundSize: "cover" }} />
                                    </Link>
                                    <div className="cardBody">
                                        <h6>{movieName.length > 23 ? `${movieName}...` : movieName}</h6>
                                        <div className='released'> <b>Released:</b> {Year}</div>
                                        <hr />
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })}
                </section>
            </>
        )
    }


    const setLoadingProgress = useCallback((progress) => {
        setProgress(progress);
    }, []);

    const getMovies = useCallback(async (url) => {
        try {
            const res = await axios.get(url)
            const data = await res.data
            if (data.Response === "True") {
                // console.log(data)
                setLoadingProgress(10)
                setTimeout(() => {
                    setLoadingProgress(30)
                }, 300);
                setTimeout(() => {
                    setLoadingProgress(80)
                }, 500);
                setMovie(data.Search)
                setTimeout(() => {
                    setLoadingProgress(100)
                }, 800);
                setIsError({
                    show: false,
                    msg: ""
                })
            } else {
                if (data.Error === "Incorrect IMDb ID.") {
                    setIsError({
                        show: true,
                        msg: " "
                    })
                } else {
                    setIsError({
                        show: true,
                        msg: data.Error
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }, [setLoadingProgress]);

    useEffect(() => {
        let timerOut = setTimeout(() => {
            getMovies(`${url}&s=${query}`);
        }, 500);
        return () => clearTimeout(timerOut)
    }, [query, getMovies]);

    return (
        <AppContext.Provider value={{ isError, movie, setQuery, progress, setProgress, setLoadingProgress, fetchMovie }}>
            {children}
        </AppContext.Provider>
    )
};
const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider, useGlobalContext };