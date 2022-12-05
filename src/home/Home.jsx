import React from 'react';
import { auth, methods } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await methods.signOut(auth);
    navigate('/');
  };

  return <button onClick={logout}>Log out</button>;
};

export default Home;
