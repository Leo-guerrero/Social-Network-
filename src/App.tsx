


import { Routes, Route} from 'react-router-dom'
import Home from './pages/LandingPage'
import BackendTester from './pages/BackendTest'



function App() {
  
  return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/backendtest" element={<BackendTester />} />
        </Routes>
  );
}

export default App;

