import React from 'react';
import { NavLink } from 'react-router-dom';

import '../index.css';

import normanLogo from '../assets/Norman_logo.png';

function NavBar() {
    return (
        <nav className="p-4 fixed top-0 left-0 right-0 flex justify-center">
            <ul className="flex items-center space-x-6">
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/about">About</NavLink></button>
                </li>
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/chat">Chat</NavLink></button>
                </li>
            </ul>
            <div className="flex justify-center">
                <NavLink reloadDocument to="/">
                    <img className="w-64 h-64" src={normanLogo} alt='Norman Logo' />
                </NavLink>
            </div>
            <ul className="flex items-center space-x-6">
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/login">Login</NavLink></button>
                </li>
                <li className='inline-block'>
                    <button className="text-white"><NavLink reloadDocument to="/status">Status</NavLink></button>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
