import React from 'react';

function Signup(){
    return(
        <div className="flex justify-center bg-light-green rounded">
            <form>
                <br />
                <h1 className="flex justify-center">Sign up now!</h1>
                <br />
                <div className="flex items-center p-4 px-8 pt-8">
                    <label className="p-4 px-8">ORGANIZATION:</label>
                    <input type='name' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your organization" />
                </div>
                <br />
                    <p className="flex justify-center">Please reach out to our enterprise team if your Organization is not in this list</p>
                <br/>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label className="p-4 px-8">FIRST NAME:</label>
                    <input type='name' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your first name" />
                    <label className="p-4 px-8">LAST NAME:</label>
                    <input type='name' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your last name" />
                </div>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label className="p-4 px-8">E-MAIL:</label>
                    <input type='email' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your email" />
                </div>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label className="p-4 px-8">USERNAME:</label>
                    <input type='name' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter a username" />
                </div>
                <div className="flex items-center p-4 px-8 pt-8">
                    <label className="p-4 px-8">PASSWORD:</label>
                    <input type='name' className="form-input rounded flex-1 p-6 px-3 py-2" placeholder="enter your first name" />
                </div>
                <br />
                <div className="flex justify-center">
                    <button type='submit'> SIGNUP </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default Signup;