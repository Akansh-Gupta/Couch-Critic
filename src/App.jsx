import './style/cards.css';
import './style/carousel.css';
import './style/comments.css';
import './style/common.css'
import './style/render_list.css';
import './style/loading.css';
import './style/login.css';
import './style/navbar.css';
import './style/search.css';
import './style/single_result.css';
import './style/watch_later.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import NavBar from './components/NavBar';
import Movie from './components/Movie';
import Show from './components/Show';
import Anime from './components/Anime';
import PageNotFound from './components/PageNotFound';

import { useGlobalContext } from './components/Context';
import { useAuth0 } from "@auth0/auth0-react";
import Genre from './components/Genre';
import SearchMovies from './components/SearchMovies';
import SearchShows from './components/SearchShows';
import SearchAnime from './components/SearchAnime';
import SingleResult from './components/SingleResult';
import AuthCallback from './components/AuthCallback';
import Loading from './components/Loading';
import CheckEmail from './components/CheckEmail';

function AppContent() {
  const { progress } = useGlobalContext();
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <LoadingBar
        color='#ff3700'
        progress={progress}
        height={4}
      />
      <NavBar />
      <Routes>
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/" element={<Navigate to="/movie" />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/loading" element={<Loading />} /> {/* for testing loading screen */}
        <Route path="/tv" element={<Show />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/search-movies" element={<SearchMovies />} />
        <Route path="/search-tv" element={<SearchShows />} />
        <Route path="/search-anime" element={<SearchAnime />} />
        <Route path='/:type/:id/:name' element={<SingleResult />} />
        <Route path='/:type/genres/:genre' element={<Genre />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router basename='/Couch-Critic'>
      <AppContent />
    </Router>
  );
}

export default App;
