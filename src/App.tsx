import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    fetch("http://localhost:3000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to fetch message"));
  }, []);

  return (
    <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">{message}</h1>
    </div>
  );
}

export default App;


