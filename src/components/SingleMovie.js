import { useCallback, useState, useEffect } from 'react'
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
        console.log(data)
        setIsLoading(false)
        setMovie(data)
        setLoadingProgress(100)
      }
    } catch (error) {
      console.log(error)
    }
  },[setLoadingProgress])

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
          <img className='poster-img' src={movie.Poster} alt="" style={{ background: `url(${process.env.PUBLIC_URL}/images/image-not-found.png)`, backgroundSize: "cover" }} />
          <ul className="rating-info">
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' alt='IMDB'/><b> IMDB Rating:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/star.png`} alt="" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} /> {movie.imdbRating} </li>
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/imdb.png`} className='icon' alt="IMDB" /> <b>IMDB Votes:</b> <img src={`${process.env.PUBLIC_URL}/images/logo/like.png`} alt="" style={{ width: "20px", aspectRatio: "1", marginBottom: "4px" }} />  {movie.imdbVotes} </li>
            <li><img src={`${process.env.PUBLIC_URL}/images/logo/metacritic.png`} className='icon' alt="MetaCritic" /><b> Metacritic Score:</b> {movie.Metascore} </li>
          </ul>
        </div>
        <div className="movie-info">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 className="movie-title">{movie.Title}</h3>
            <NavLink to="/movie">
              <img src={`${process.env.PUBLIC_URL}/images/close.png`} alt="close button" className="closeBtn" />
            </NavLink>
          </div>
          <p><b>Rated:</b> {movie.Rated} <br /> <b>Released :</b> {movie.Released}</p>
          <p><b>Country:</b> {movie.Country} <br /><b>Language:</b> {movie.Language} </p>
          <p><b>Runtime:</b> {movie.Runtime} <br /> <b>Genre:</b> {movie.Genre} <br /> <b>Box Office Collection:</b> {movie.BoxOffice} </p>
          <p><b>Writer:</b> {movie.Writer}</p>
          <p><b>Lead Actors: </b> {movie.Actors}</p>
          <p><b>Synopsis:</b> {movie.Plot}</p>
          <p><b>Nominations and Awards: <img src={`${process.env.PUBLIC_URL}/images/logo/trophy.png`} alt="" className="icon" style={{ width: "30px" }} /></b> {movie.Awards} </p>
          <div><Comments/></div>
        </div>
      </div>
    </>
  )
}
