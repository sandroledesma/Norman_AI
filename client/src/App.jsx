import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import NavBar from './components/NavBar.jsx';
import Home from './components/Home.jsx';
// import Footer from './components/Footer.jsx';

import 'tailwindcss/tailwind.css';
import './index.css';

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const checkAuth = () => {
    return sessionStorage.getItem('authToken') !== null;
  }

  useEffect(() => {
    setIsLoggedIn(checkAuth());
  }, []);

    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50"><NavBar /></header>
        <main className="mt-64 flex-grow flex items-center justify-center">
          <div className="max-w-screen-lg w-full px-4">
            {isLoggedIn ? (
              <Outlet />
            ) : ( 
              <Home />
            )
            }
          </div>
        </main>
        {/* <footer className="sticky btm-0 z-50"><Footer /></footer> */}
      </div>
    );
}

export default App;