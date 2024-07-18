import React from 'react';
import normanReps from '../assets/Norman_reps.png';

function About(){
    return(
        <div className="container md pt-18 p-8 justify-center bg-light-green rounded"> 
            <h1 className="flex justify-left">ABOUT NORMAN</h1>
            <br />
                <p className="text-lg">Our Customer Service AI ChatBot leverages the power of OpenAI's advanced language models to provide quick, 
                    accurate, and personalized responses to customer inquiries. By integrating this AI-driven solution into a 
                    seamless web and mobile interface, we empower customer service representatives with tools to enhance their 
                    efficiency and effectiveness while providing customers with a superior support experience.</p>
            <br />
            <div className="flex justify-center">
                <img className="w-96" src={normanReps} alt='Norman Reps' />
            </div>
            <br />
            <h1 className="flex justify-left">MISSION STATEMENT</h1>
            <br />
                <p className="text-lg">To revolutionize and empower customer service by harnessing artificial intelligence, creating a seamless 
                    and efficient experience for both customers and customer service representatives, while setting a new 
                    standard for responsiveness and satisfaction.</p>
        </div>
    )
}

export default About;