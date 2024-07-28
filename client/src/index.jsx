import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'tailwindcss/tailwind.css';
import './index.css';

//routes
import App from './App.jsx';
import Chat from './components/Chat.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Signup from './components/Signup.jsx';
import TicketDetail from './components/TicketDetail.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/chat",
                element: <Chat />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/profile",
                element: <Login />
            },
            {
                path: "/profile/:id",
                element: <Profile />
            },
            {
                path: "/signup",
                element: <Signup />
            }, 
            {
                path: "/tickets/:id",
                element: <TicketDetail />
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);