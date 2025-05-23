import React, { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { url, useGlobalContext } from './Context'

export default function SingleMovie() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { setLoadingProgress } = useGlobalContext()

  const getMovies = async (url) => {
    setIsLoading(true)
    try {
      setLoadingProgress(10)
      const res = await fetch(url)
      setLoadingProgress(30)
      const data = await res.json()
      setLoadingProgress(60)
      if (data.Response === "True") {
        setIsLoading(false)
        setMovie(data)
        setLoadingProgress(100)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let timerOut = setTimeout(() => {
      getMovies(`${url}&i=${id}&plot=full`);
    }, 1000);
    return () => clearTimeout(timerOut)
  }, [id])

  if (isLoading) {
    return (
      <div className='movie-section'>
        <div className='loading'>
          <img src={`${process.env.PUBLIC_URL}/images/logo/loading.gif`} alt="" /> <br />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="result-container">
        <div className="movie-poster">
          <img className='poster-img' src={movie.Poster} alt="movie poster" />
          <ul className="rating-info">
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' /><b> IMDB Rating:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/star.png`} alt="" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} /> {movie.imdbRating} </li>
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' alt="" /> <b>IMDB Votes:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/like.png`} alt="" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} />  {movie.imdbVotes} </li>
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/metacritic.png`} className='icon' alt="" /><b> Metacritic Score:</b> {movie.Metascore} </li>
          </ul>
        </div>
        <div className="movie-info">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 className="movie-title">{movie.Title}</h3>
            <NavLink to="/movies">
              <img src={`${process.env.PUBLIC_URL}/images/close.png`} alt="close button" className="closeBtn" />
            </NavLink>
          </div>
          <ul className="movie-misc-info">
            <li className="year">{movie.Year}</li>
            <li className="rated">{movie.Rated}</li>
            <li className="released">{movie.Released}</li>
          </ul>
          <p className="language"> <b>Country:</b> {movie.Country} <br /><b>Language:</b> {movie.Language} </p>
          <p className="genre"><b>Runtime:</b> {movie.Runtime} <br /> <b>Genre:</b> {movie.Genre} <br /> <b>Box Office Collection:</b> {movie.BoxOffice} </p>
          <p className="writer"><b>Writer:</b> {movie.Writer}</p>
          <p className="actors"><b>Actors: </b>{movie.Actors}</p>
          <p className="plot"><b>Synopsis:</b> {movie.Plot}</p>
          <p className="awards"><b>Nominations and Awards: <img src={`${process.env.PUBLIC_URL}/images/logo/trophy.png`} alt="" className="icon" style={{ width: "30px" }} /></b> {movie.Awards} </p>
        </div>
      </div>
    </>
  )
}
