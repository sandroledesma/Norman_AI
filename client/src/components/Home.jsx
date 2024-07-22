import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { NavLink } from 'react-router-dom';
import normanReps from '../assets/Norman_reps.png';

import Login from './Login.jsx';

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="flex flex-col items-center justify-center text-center shadow-md p-8 mb-12">
                <h1 className="text-4xl font-bold mb-4">
                <Typewriter
                        words={["Norman, at your service!"]}
                        loop={1}
                        cursor
                        cursorStyle='_'
                        typeSpeed={60}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    /></h1>
                <span className="text-2xl">
                    <Typewriter
                        words={[
                            "I am your AI Customer Service Assistant.",
                            "I help resolve customer issues quickly and efficiently.",
                            "I use advanced AI to provide accurate and helpful responses.",
                            "I make customer service a seamless experience.",
                            "Let's get started and make your customer service exceptional!"
                        ]}
                        loop={1}
                        cursor
                        cursorStyle='_'
                        typeSpeed={60}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </span>
            </div>

            <Login />

            <div className="bg-white p-8 rounded shadow-md mb-12">
                <h2 className="text-3xl font-bold mb-4">ABOUT NORMAN</h2>
                <p className="text-lg mb-6">
                    Our Customer Service AI ChatBot leverages the power of OpenAI's advanced language models to provide quick, 
                    accurate, and personalized responses to customer inquiries. By integrating this AI-driven solution into a 
                    seamless web and mobile interface, we empower customer service representatives with tools to enhance their 
                    efficiency and effectiveness while providing customers with a superior support experience.
                </p>
                <div className="flex justify-center mb-6">
                    <img className="w-96" src={normanReps} alt='Norman Reps' />
                </div>
                <h2 className="text-3xl font-bold mb-4">MISSION STATEMENT</h2>
                <p className="text-lg">
                    To revolutionize and empower customer service by harnessing artificial intelligence, creating a seamless 
                    and efficient experience for both customers and customer service representatives, while setting a new 
                    standard for responsiveness and satisfaction.
                </p>
            </div>
        </div>
    );
}

export default Home;