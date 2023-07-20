import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Username from './component/Username';
import Password from './component/Password';
import Reset from './component/Reset';
import Register from './component/Register';
import Recovery from './component/Recovery';
import Profile from './component/Profile';
import PageNotFound from './component/PageNotFound';
import HelperState from './context/helperState';
import Authprotected from './middleware/Authprotected';
import Passwordprotected from './middleware/Passwordprotected';
import Loginprotected from './middleware/Loginprotected';
import { useEffect, useState } from 'react';


function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("https://loginapp-tsek.onrender.com")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <HelperState>
      <BrowserRouter>
        <Routes>
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/password" element={<Passwordprotected><Password /></Passwordprotected>} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/recovery" element={<Recovery />} />
          <Route exact path="/profile" element={<Authprotected><Profile /></Authprotected>} />
          <Route exact path=" /pagenotfound" element={<PageNotFound />} />
          <Route path="/" element={<Loginprotected><Username /></Loginprotected>} />

        </Routes>
      </BrowserRouter>
    </HelperState>
  );
}

export default App;
