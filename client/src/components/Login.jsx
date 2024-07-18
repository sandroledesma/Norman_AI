import React from 'react';
import { NavLink } from 'react-router-dom';

function Login(){
    return(
        <div className="flex justify-center bg-light-green rounded">
            <form>
                <br/>
                <h1 className="flex justify-center">Login to your account</h1>
                <br/>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label>EMAIL: </label>
                    <input type='email' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your email" />
                </div>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label>PASSWORD:</label>
                    <input type='password' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your password" />
                </div>
                <br />
                <div className="flex justify-center">
                    <button type='submit'> LOGIN </button>
                </div>
                <br />
                <p className="flex justify-center">Not an account holder yet? </p> 
                <p className="flex justify-center"><strong><NavLink reloadDocument to="/signup"> Sign up today!</NavLink></strong></p>
                <br />
            </form>
        </div>
    )
}

export default Login;