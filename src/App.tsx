


import { Routes, Route} from 'react-router-dom'
import Home from './pages/LandingPage'
import SignUp from './pages/SignUp'
import BackendTester from './pages/BackendTest'
import Login from './pages/Login';
import NavBar from './components/NavBar';
import MainFeed from './pages/MainFeed';
import Profile from './pages/Profile';
import Program from './pages/codepractice'
import Problem from './pages/ProblemPage.tsx'

function App() {
  

  return (
    <>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />}> </Route>
          <Route path="/Login" element={<Login />}> </Route>
          <Route path="/backendtest" element={<BackendTester />} />
          <Route path="/MainFeed" element={<MainFeed />}> </Route> 
          <Route path="/Program" element={<Program />}></Route>
          <Route path="/Problem" element={<Problem />}></Route>
          <Route path="/Profile/:id" element={<Profile />}></Route>
        </Routes>
      </>
  );
}

export default App;

