import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import { methods, auth } from './utils/firebase';
import Login from './authentication/Login';
import Register from './authentication/Register';
import Home from './home/Home';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    methods.onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoaded(true);
    });
  }, []);

  const MainPath = () => {
    if (!loggedIn) {
      return <Login />;
    }

    return <Home />;
  };

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/signup' element={<Register />} />
      <Route path='/' element={<MainPath />} />
    </Routes>
  );
};

export default App;

