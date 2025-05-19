import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
const AppContext = React.createContext();
let apiKey = process.env.REACT_APP_API_KEY;

export const url = `https:/www.omdbapi.com/?apikey=${apiKey}`

const AppProvider = ({ children }) => {
    const [movie, setMovie] = useState([])
    const [isError, setIsError] = useState({ show: "false", msg: "" })
    const [query, setQuery] = useState("avengers")
    const [progress, setProgress] = useState(0)
    const [login, setLogin] = useState("")
    const [pass, setPass] = useState("")

    const fetchMovie = (movieType) => {
        return (
            <>
                <h2>Recently Searched {movieType.charAt(0).toUpperCase() + movieType.slice(1)}:</h2> <hr />
                <section className='cardContainer'>
                    {movie.map((curMovie) => {
                        const { imdbID, Title, Poster, Type, Year } = curMovie
                        const movieName = Title.substring(0, 24)
                        if (Type === movieType && Poster !== "N/A") {
                            return (
                                <div className="cardItem" key={imdbID}>
                                    <Link to={`/${Type}/${imdbID}`} >
                                        <img src={Poster} className="cardImg" alt='' />
                                    </Link>
                                    <div className="cardBody">
                                        <h6>{movieName.length > 23 ? `${movieName}...` : movieName}</h6>
                                        <div className='released'> <b>Released:</b> {Year}</div>
                                        <hr />
                                    </div>
                                </div>
                            )
                        }
                    })}
                </section>
            </>
        )
    }


    const setLoadingProgress = (progress) => {
        setProgress(progress)
    }

    const getMovies = async (url) => {
        try {
            const res = await fetch(url)
            const data = await res.json()
            console.log(data)
            if (data.Response === "True") {
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
    }

    useEffect(() => {
        let timerOut = setTimeout(() => {
            getMovies(`${url}&s=${query}`);
        }, 500);
        return () => clearTimeout(timerOut)
    }, [query])

    return (<AppContext.Provider value={{ isError, movie, setQuery, progress, setProgress, setLoadingProgress, fetchMovie, login, setLogin, pass, setPass }}>
        {children}
    </AppContext.Provider>
    )
};

const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider, useGlobalContext };