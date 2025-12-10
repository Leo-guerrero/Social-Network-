


import { Routes, Route} from 'react-router-dom'
import Home from './pages/LandingPage'
import SignUp from './pages/SignUp'
import BackendTester from './pages/BackendTest'
import Login from './pages/Login';
// import NavBar from './components/NavBar';
import MainFeed from './pages/MainFeed';
import Profile from './pages/Profile';
import Program from './pages/codepractice'
import Problem from './pages/ProblemPage.tsx'
import PostPage from './pages/postPage.tsx'
import Sidebar from './components/Sidebar.tsx';
import Explore from './pages/Explore.tsx';
import ProbHistUser from './pages/ProbHistUser.tsx';
import Notifications from './pages/Notifications.tsx';
import Messages from './pages/Messages.tsx';

function App() {
  

  return (
    <>
        {/*<NavBar />*/}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />}> </Route>
          <Route path="/Login" element={<Login />}> </Route>
          <Route path="/backendtest" element={<BackendTester />} />
          <Route path="/MainFeed" element={<MainFeed />}> </Route> 
          <Route path="/Program" element={<Program />}></Route>
          <Route path="/Problem/:id" element={<Problem />}></Route>
          <Route path="/Profile/:id" element={<Profile />}></Route>
          <Route path="/postPage/:id" element={<PostPage />}></Route>
          <Route path="/Notifications" element={<Notifications />}></Route>
          <Route path="/Messages" element={<Messages />}></Route>
          <Route path="/problemHistory/:id" element={<ProbHistUser/>} ></Route>

          <Route path="/SideBar" element={<Sidebar/>}/>
          <Route path="/Explore" element={<Explore/>}></Route>
        </Routes>
      </>
  );
}

export default App;

