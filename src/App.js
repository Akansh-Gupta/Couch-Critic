import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import SingleMovie from './components/SingleMovie'
import SingleSeries from './components/SingleSeries';
import LoadingBar from 'react-top-loading-bar';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Movies from './components/Movies';
import Series from './components/Series';
import PageNotFound from './components/PageNotFound';
import Footer from './components/Footer';

import { useGlobalContext } from './components/Context';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function App() {
  const {progress} = useGlobalContext()

  const { handleRedirectCallback } = useAuth0();

  useEffect(() => {
    const processRedirect = async () => {
      if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    processRedirect();
  }, [handleRedirectCallback]);
  
  return ( 
    <>
      <Router basename='/Couch-Critic'>
        <LoadingBar
          color='#ff3700'
          progress={progress}
          height={4}
        />
        <NavBar/>
        <Routes>
          <Route path='*' element={<PageNotFound/>}></Route>
          <Route path="/Couch-Critic" element={<Navigate to="/" />} />
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/movie" element={<Movies/>} />
          <Route exact path="/series" element={<Series />} />
          <Route exact path='/movie/:id' element={<SingleMovie />} />
          <Route exact path='/series/:id' element={<SingleSeries />} />
        </Routes>
        {/* <Footer/> */}
      </Router>
    </>
  );
}

export default App;
