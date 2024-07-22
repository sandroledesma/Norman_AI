import React from 'react';
import { Outlet } from 'react-router-dom';

import NavBar from './components/NavBar.jsx';
// import Footer from './components/Footer.jsx';

import 'tailwindcss/tailwind.css';
import './index.css';

function App() {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50"><NavBar /></header>
        <main className="mt-64 flex-grow flex items-center justify-center">
          <div className="max-w-screen-lg w-full px-4">
            <Outlet />
          </div>
        </main>
        {/* <footer className="sticky btm-0 z-50"><Footer /></footer> */}
      </div>
    );
}

export default App;