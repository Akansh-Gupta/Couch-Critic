import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { url, useGlobalContext } from './Context'
import Carousel from './Carousel'

export default function Home() {

    const [isLoading, setIsLoading] = useState(true)
    const [movie1, setMovie1] = useState([])
    const [movie2, setMovie2] = useState([])
    const [movie3, setMovie3] = useState([])
    const [movie4, setMovie4] = useState([])
    const [movie5, setMovie5] = useState([])
    const [movie6, setMovie6] = useState([])
    const { setLoadingProgress } = useGlobalContext()

    const getMovies1 = async (url) => {
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setMovie1(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getMovies2 = async (url) => {
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setMovie2(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getMovies3 = async (url) => {
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setMovie3(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getMovies4 = async (url) => {
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setMovie4(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getMovies5 = async (url) => {
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setMovie5(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getMovies6 = async (url) => {
        setIsLoading(true)
        try {
            setLoadingProgress(10)
            const res = await fetch(url)
            setLoadingProgress(30)
            const data = await res.json()
            console.log(data)
            setLoadingProgress(60)
            if (data.Response === "True") {
                setIsLoading(false)
                setMovie6(data.Search)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let timerOut = setTimeout(() => {
            getMovies1(`${url}&s=mission impossible`);
            getMovies2(`${url}&s=star wars`);
            getMovies3(`${url}&s=harry potter`);
            getMovies4(`${url}&s=fast`);
            getMovies5(`${url}&s=batman`);
            getMovies6(`${url}&s=despicable me`);
        }, 500);
        return () => clearTimeout(timerOut)
    }, [])

    if (isLoading) {
        return (
            <div className='movie-section'>
                <div className='loading'>
                    <img src={`${process.env.PUBLIC_URL}/images/logo/loading.gif"`} alt="" /> <br />
                    Loading...
                </div>
            </div>
        )
    }
    return (
        <div className='home-bg'>
            <Carousel />
            <h2>Mission Impossible Series:</h2> <hr />
            <section className='cardContainer'>
                {movie1.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
            <h2>Star Wars Series:</h2> <hr />
            <section className='cardContainer'>
                {movie2.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
            <h2>Harry Potter Series:</h2> <hr />
            <section className='cardContainer'>
                {movie3.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
            <h2>Fast & Furious Series:</h2> <hr />
            <section className='cardContainer'>
                {movie4.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
            <h2>Batman Series:</h2> <hr />
            <section className='cardContainer'>
                {movie5.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
            <h2>Despicable Me Series:</h2> <hr />
            <section className='cardContainer'>
                {movie6.map((curMovie1) => {
                    const { imdbID, Title, Poster, Type, Year } = curMovie1
                    const movieName = Title.substring(0, 25)
                    if (Type === "movie" && Poster !== "N/A") {
                        return (
                            <div className="cardItem" key={imdbID}>
                                <Link to={`/movie/${imdbID}`} >
                                    <img src={Poster} className="cardImg" alt='' />
                                </Link>
                                <div className="cardBody">
                                    <h6>{movieName.length > 24 ? `${movieName}...` : movieName}</h6>
                                    <div className='released'>Released : {Year}</div> <hr />
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
        </div>
    )
}