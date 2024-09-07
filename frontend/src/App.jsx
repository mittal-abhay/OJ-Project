import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './components/pages/home';
import UserProfile from './components/pages/userProfile';
import LoginRegister from './components/pages/loginRegister.jsx';
import Problems from './components/pages/problems.jsx';
import Problem from './components/pages/problem.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import LeaderBoard from './components/pages/Leaderboard.jsx';
import Loader from './components/commons/Loader/Loader.jsx';

function App() {
    const { isLoading} = useAuth();

    if (isLoading) {
        return <Loader />;
    }

    return (
      <>
      <ToastContainer theme="colored" />
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<LoginRegister />} />
            <Route exact path="/userProfile" element={<UserProfile />}/>
            <Route exact path="/problems" element={<Problems />}/>
            <Route exact path="/problem/:id" element={<Problem />} />
            <Route exact path="/leaderboard" element={<LeaderBoard />} />
        </Routes>
        </>
    );
}

export default App;
