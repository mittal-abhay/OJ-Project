import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './components/pages/home';
import ProblemPage from './components/pages/problem.jsx';
import UserProfile from './components/pages/userProfile';
import Login from './components/pages/login';
import Register from './components/pages/register';
import LandingPage from './components/pages/landingPage';
import Problems from './components/pages/problems.jsx';
import Problem from './components/pages/problem.jsx';

function App() {
    const { isAuth, isLoading, role } = useAuth();
    
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <Routes>
            <Route exact path="/" element={isAuth? <Home/> : <LandingPage/>} />
            <Route exact path="/userProfile" element={isAuth ? <UserProfile />: <Navigate to = "/"/> } />
            <Route exact path="/home" element={isAuth? <Home />: <Navigate to = "/"/> } />
            <Route exact path="/problems" element={isAuth ? <Problems /> : <Navigate to="/" />} />
            <Route exact path="/problem/:id" element={isAuth ? <Problem/> : <Navigate to="/" />} />


        </Routes>
    );
}

export default App;
