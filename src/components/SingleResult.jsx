import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from './Context';
import { FaFacebook, FaInstagram, FaWikipediaW, FaStar, FaThumbsUp } from "react-icons/fa";
import { FaXTwitter, FaLink } from "react-icons/fa6"
import { SiCrunchyroll, SiMyanimelist, SiImdb } from "react-icons/si";
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios';
import Comments from './Comments';
import Loading from './Loading';
import CardItem from './CardItem';

export default function SingleResult() {
  const { setLoadingProgress } = useGlobalContext();
  const { id, type, name } = useParams();
  const [information, setInformation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12)

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const getInformation = useCallback(async () => {
    setIsLoading(true);
    try {
      setLoadingProgress(10);
      const res = await axios.get(`https://api.simkl.com/${type}/${id}/${name}?extended=full`, {
        headers: {
          'Content-Type': 'application/json',
          'simkl-api-key': import.meta.env.VITE_SIMKL_CLIENT_ID_1,
        },
      });
      const data = res.data
      setLoadingProgress(50);
      setInformation(res.data);
      console.log("Fetched Movie Details:", data);
      setIsLoading(false);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Failed to fetch full movie details:', error);
    }
  }, [id, type, name, setLoadingProgress]);

  useEffect(() => {
    getInformation();
  }, [getInformation]);

  if (isLoading || !information) {
    return <Loading />;
  }

  const {
    ids,
    title,
    en_title,
    released,
    certification,
    overview,
    poster,
    runtime,
    genres,
    ratings,
    trailers,
    director,
    country,
    language,
    budget,
    revenue,
    airs,
    first_aired,
    last_aired,
    network,
    relations,
    season,
    total_episodes,
    season_name_year,
    status,
    studios,
    users_recommendations,
  } = information;

  const posterUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${poster}_m.jpg`
  const runtimeInHrAndMins = runtime > 60 ? `${Math.floor(runtime / 60)} Hr ${runtime % 60} Mins` : `${runtime} Mins`;
  const rating = ratings?.mal?.rating || ratings?.imdb?.rating || ratings?.simkl?.rating || "N/A";
  const votes = ratings?.mal?.votes || ratings?.imdb?.votes || ratings?.simkl?.votes || "N/A";
  const rank = ratings?.mal?.rank;
  const mediaType = information.anime_type || information.type
  // information.type = information.anime_type || information.type

  const formatMoney = (amount) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Billion`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} Million`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)} K`;
    }
  };

  return (
    < >
      {/* <div className="bg-wrapper" style={{ backgroundImage: `url(https://wsrv.nl/?url=https://simkl.in/posters/${poster}_w.jpg)` }}> */}
      <div className="single-result-container">

        {/* TITLE */}
        <div className='item-1' style={{ display: 'flex', justifyContent: 'space-between', gap: "3rem" }}>
          <div className="movie-title">{title || en_title} </div>

          {/* CLOSE BTN */}
          <IoIosCloseCircle color='#ff3700' size={50} className='closeBtn' onClick={handleGoBack} />
        </div>

        {/* ENGLISH TITLE */}
        {en_title && <div className='eng-title item-1'>{en_title}</div>}

        <hr className='item-1' />

        <div className="movie-info item-2">

          {/* TRAILER */}
          {trailers && Array.isArray(trailers) && (() => {
            const officialTrailer = trailers.find(t => t.name?.toLowerCase() === "official trailer");
            const fallbackTrailer = trailers[0];
            const selectedTrailer = officialTrailer || fallbackTrailer;

            if (selectedTrailer) {
              return (
                <iframe
                  // maxWidth="1080px"
                  // height="608px"
                  src={`https://www.youtube.com/embed/${selectedTrailer.youtube}`}
                  title={selectedTrailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "1rem", border: "3px solid white", maxWidth: "1080px", aspectRatio: "16/9" }}
                />
              );
            }
            return <h4><b>Trailer :</b> Not available.</h4>;
          })()}

          {/* GENRES */}
          {genres && (
            <><b>Genres :</b>
              <span>
                {genres.map((genre, index) => {
                  const genreSlug = encodeURIComponent(genre.toLowerCase().replace(/\s+/g, '-'));
                  return (
                    <button
                      key={index}
                      className="genre-btn"
                      onClick={() => {
                        navigate(`/${type}/genres/${genreSlug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {genre}
                    </button>
                  );
                })}
              </span>
            </>
          )}

          {/* ITEM INFO */}
          {overview && (
            <p>
              <b>Overview :</b>{" "}
              {overview.split("<br><br>").map((part, index) => (
                <span key={index}>
                  {part}
                  {index < overview.split("<br><br>").length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          {season_name_year && <p><b>Season Name Year :</b> {season_name_year}</p>}
          {released && <p><b>Released :</b> {new Date(released).toLocaleDateString('en-GB').replaceAll("/", "-")}</p>}
          {airs && <p><b>Aired :</b> {new Date(first_aired).toLocaleDateString('en-GB').replaceAll("/", "-")} - {last_aired ? new Date(last_aired).toLocaleDateString('en-GB') : "Ongoing"} every {airs?.day} @ {airs?.time}</p>}
          {certification && <p><b>Rated :</b> {certification}</p>}
          {season && <p><b>Season :</b> {season}</p>}
          {runtime && <p><b>Runtime :</b>{mediaType !== 'movie' ? ` ~${runtimeInHrAndMins} per episode` : ` ${runtimeInHrAndMins}`}</p>}
          {total_episodes && <p><b>Total Episodes :</b> {total_episodes}</p>}
          {status && <p><b>Status :</b> {status.charAt(0).toUpperCase() + status.slice(1)}</p>}
          {rank && <p><b>Rank :</b> {rank}</p>}
          {country && <p><b>Country :</b> {new Intl.DisplayNames(["en"], { type: "region" }).of(country.toUpperCase())}{" "}
            <img
              type="image/webp"
              src={`https://flagcdn.com/40x30/${country.toLowerCase()}.png`}
              alt={country}
              width="24"
              height="18"
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            /></p>}
          {language && <p><b>Language :</b> {new Intl.DisplayNames(["en"], { type: "language" }).of(language.toUpperCase())}</p>}
          {studios && <p><b>Studio :</b> {studios[0]?.name}</p>}
          {network && <p><b>Available On :</b> {network}</p>}
          {revenue && <p><b>Revenue :</b> ${formatMoney(revenue)}</p>}
          {budget && <p><b>Budget :</b> ${formatMoney(budget)}</p>}
          {director && <p><b>Directed By :</b> {director}</p>}
        </div>

        {/* POSTER */}
        <div className="movie-poster item-3">
          <img
            className="poster-img"
            src={posterUrl}
            alt={title}
          />
          <img src="https://eu.simkl.in/img_tv/tv_avatar_sun_blur.png" alt="" className='overlay' />

          {/* RATINGS */}
          {ratings?.mal ? <ul className='rating-info'>
            <li>
              <SiMyanimelist className='mal' size={40} />
              <b> Rating :</b> <FaStar className='mb-2' size={20} color='#ffc107' /> {rating}
            </li>
            <li>
              <SiMyanimelist className='mal' size={40} />
              <b> Upvotes :</b> <FaThumbsUp className='mb-2' size={20} color="#0d6efd" /> {votes}
            </li>
          </ul> : <ul className='rating-info'>
            <li>
              <SiImdb className='imdb' size={40} />
              <b> Rating :</b> <FaStar className='mb-2' size={20} color='#ffc107' />  {rating}
            </li>
            <li>
              <SiImdb className='imdb' size={40} />
              <b> Upvotes :</b> <FaThumbsUp className='mb-2' size={20} color="#0d6efd" /> {votes}
            </li>
          </ul>}

          {/* SOCIALS */}
          {(ids?.fb || ids?.instagram || ids?.crunchyroll || ids?.tw || ids?.mal || ids?.wikien) && <div className='social-info'>
            <div className="social-heading">Social Links <FaLink size={25} color='#ff3700' /></div>
            <hr />
            <div className="social-icons">
              {ids?.fb && <a href={`https://www.facebook.com/${ids?.fb}`} target='_blank' rel="noopener noreferrer"><FaFacebook className='fb' size={40} color='#1877F2' /></a>}
              {ids?.instagram && <a href={`https://www.instagram.com/${ids?.instagram}`} target='_blank' rel="noopener noreferrer"><FaInstagram className='insta' size={40} /></a>}
              {ids?.tw && <a href={`https://www.twitter.com/${ids?.tw}`} target='_blank' rel="noopener noreferrer"><FaXTwitter size={40} /></a>}
              {ids?.crunchyroll && <a href={`https://www.crunchyroll.com/${ids?.crunchyroll}`} target='_blank' rel="noopener noreferrer"><SiCrunchyroll size={40} color='#F47521' /></a>}
              {ids?.mal && <a href={`https://myanimelist.net/anime/${ids?.mal}`} target='_blank' rel="noopener noreferrer"><SiMyanimelist className='mal' size={40} /></a>}
              {ids?.wikien && <a href={`https://en.wikipedia.org/wiki/${ids.wikien}`} target='_blank' rel="noopener noreferrer"><FaWikipediaW size={40} /></a>}
            </div>
          </div>}
        </div>

        {/* COMMENTS */}
        <div className='comment-section item-1'>
          <div><Comments /></div>
        </div>


        {/* Related trailers */}
        {trailers?.length > 1 && <>
          <div className="related-vid item-1">
            <div className="heading">Related Videos :</div>
            {trailers
              .filter(trailer => trailer.name?.toLowerCase() !== "official trailer")
              .slice(0, visibleCount)
              .map((curTrailer, index) => (
                <iframe
                  key={index}
                  src={`https://www.youtube.com/embed/${curTrailer.youtube}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "1rem", border: "2px solid white", maxWidth: "345px", aspectRatio: "16/9", marginLeft: "0.5rem" }}
                />
              ))}
          </div>
          {trailers.length > 12 && (
            <div className="load-more-wrapper item-1">
              <button onClick={() => setVisibleCount(prev => prev + 12)} className="load-more-btn">
                Show More
              </button>
            </div>
          )}
        </>}

        {/* RELATED ITEMS */}
        <div className='related-info item-1'>
          {relations && (<><div className='heading'>Related to {en_title || title}  :</div>
            {/* <hr /> */}
            <div className='related-list'>
              {relations.map((item, index) => (
                <CardItem key={index} item={item} compact={true} itemType={"anime"} itemId={item.ids.simkl} itemName={item.ids.slug} watchLater={false} />
              ))}
            </div>
          </>)}
          {users_recommendations && (<><div className='heading'>More Like This: </div>
            {/* <hr /> */}
            <div className='related-list'>
              {users_recommendations.map((item, index) => (
                <CardItem key={index} item={item} compact={true} itemType={item.type} itemId={item.ids.simkl} itemName={item.ids.slug} watchLater={false} />
              ))}
            </div>
          </>)}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
