import React from 'react';
import normanLogo from '../assets/Norman_logo_2.png';


function ErrorPage(){
    return(
        <div>
            <div className="flex justify-center mt-48">
                <img className="w-96" src={normanLogo} alt='Norman Logo' />
            </div>
            <br />
            <div className="flex justify-center">
                <h1 className="flex items-center"> ** THIS PAGE DOES NOT EXIST ** </h1>
            </div>
        </div>
    )
}

export default ErrorPage;