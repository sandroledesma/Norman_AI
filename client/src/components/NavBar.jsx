import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import '../index.css';

import normanLogo from '../assets/NORMAN_AIGENT_logo.png';

function NavBar() {
    // const location = useLocation();
    // const isLoggedIn = userId && location.pathname !== '/' && location.pathname !== '/login';

    return (
        <nav className="bg-light-green p-4 fixed top-0 left-0 right-0 flex justify-center bg">
            <ul className="flex items-center space-x-6">
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/chat">CHAT</NavLink></button>
                </li>
            </ul>
            <div className="flex justify-center">
                <NavLink reloadDocument to="/">
                    <img className="w-64" src={normanLogo} alt='Norman Logo' />
                </NavLink>
            </div>
            <ul className="flex items-center space-x-6">
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/profile">PROFILE</NavLink></button>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
