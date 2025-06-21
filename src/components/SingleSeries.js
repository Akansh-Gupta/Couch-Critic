import {useCallback, useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { url, useGlobalContext } from './Context'
import axios from 'axios'
import Comments from './Comments'
import Loading from './Loading'

export default function SingleMovie() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { setLoadingProgress } = useGlobalContext()

    const getMovies = useCallback(async (url) => {
        setIsLoading(true)
        try {
            setLoadingProgress(10)
            const res = await axios.get(url)
            setLoadingProgress(30)
            const data = await res.data
            setLoadingProgress(60)
            if (data.Response === "True") {
                setIsLoading(false)
                setMovie(data)
                setLoadingProgress(100)
            }
        } catch (error) {
            console.log(error)
        }
    }, [setLoadingProgress])

    useEffect(() => {
        let timerOut = setTimeout(() => {
            getMovies(`${url}&i=${id}&plot=full`);
        }, 1000);
        return () => clearTimeout(timerOut)
    }, [getMovies, id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="result-container">
                <div className="movie-poster">
                    <img className='poster-img' src={movie.Poster} alt="movie poster" style={{background:`url(${process.env.PUBLIC_URL}/images/image-not-found.png)`, width:"100px"}}/>
                    <ul className="rating-info">
                        <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' alt="imdb" /><b> IMDB Rating:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/star.png`} alt="star" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} /> {movie.imdbRating} </li>
                        <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' alt="imdb" /> <b>IMDB Votes:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/like.png`} alt="like" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} />  {movie.imdbVotes} </li>
                    </ul>
                </div>
                <div className="movie-info">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h3 className="movie-title">{movie.Title}</h3>
                        <NavLink to="/series" draggable={false}>
                            <img src={`${process.env.PUBLIC_URL}/images/close.png`} alt="close button" className="closeBtn" />
                        </NavLink>
                    </div>
                    <ul className="movie-misc-info">
                        <li className="year">{movie.Year}</li>
                        <li className="rated">{movie.Rated}</li>
                        <li className="released">{movie.Released}</li>
                    </ul>
                    <p className="language"> <b>Country:</b> {movie.Country} <br /><b>Language:</b> {movie.Language} </p>
                    <p className="genre"><b>Genre:</b> {movie.Genre} <br /> <b>Total Seasons:</b> {movie.totalSeasons} </p>
                    <p className="actors"><b>Actors: </b>{movie.Actors}</p>
                    <p className="plot"><b>Synopsis:</b> {movie.Plot}</p>
                    <p className="awards"><b>Nominations and Awards: <img src={`${process.env.PUBLIC_URL}/images/logo/trophy.png`} alt="" className="icon" style={{ width: "30px" }} /></b> {movie.Awards} </p>
                    <div><Comments/></div>
                </div>
            </div>
        </>
    )
}
