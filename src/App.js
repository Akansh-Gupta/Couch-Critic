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
import { useGlobalContext } from './components/Context';

function App() {
  const {progress} = useGlobalContext()
  
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
          <Route path="/Couch-Critic" element={<Navigate to="/" />} />
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/movies" element={<Movies/>} />
          <Route exact path="/series" element={<Series />} />
          <Route exact path='/movie/:id' element={<SingleMovie />} />
          <Route exact path='/series/:id' element={<SingleSeries />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
