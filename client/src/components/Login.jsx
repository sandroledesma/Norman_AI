import React from 'react';

function Login(){
    return(
        <div className="flex justify-center bg-light-green rounded">
            <form>
                <br />
                <h1 className="flex justify-center">Login to your account</h1>
                <p className="flex justify-center">Not an account holder yet? Sign up today!</p>
                <br/>
                <div className="flex items-center p-8 px-12 pt-18">
                    <label>EMAIL: </label>
                    <input type='email' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your email" />
                </div>
                <div className="flex items-center p-8 px-12 pt-18">
                    <label>PASSWORD:</label>
                    <input type='password' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your password" />
                </div>
                <br />
                <div className="flex justify-center">
                    <button type='submit'> LOGIN </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default Login;