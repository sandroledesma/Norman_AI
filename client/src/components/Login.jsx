import React from 'react';

function Login(){
    return(
        <div>
            <h1 className="flex justify-center">Login to your account</h1>
            <p className="flex justify-center">Not an account holder yet? Sign up today!</p>
            <br/>
            <div className="flex justify-center">
                <label>Email: </label>
                <input type='email' className="form-input rounded" placeholder="enter your email" />
            </div>
            <br />
            <div className="flex justify-center">
                <label>Password:</label>
                <input type='password' className="form-input rounded" placeholder="enter your password" />
            </div>

        </div>
    )
}

export default Login;