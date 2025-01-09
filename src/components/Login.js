import React from 'react'
import { useGlobalContext } from './Context';

export default function Login() {
    const { login, setLogin, pass, setPass } = useGlobalContext()
    const handleLogin = () => {
        if(login === "akansh" && pass === "couch critic"){
            alert("Login Successful")
        }
        else{
            alert("Wrong Credentials")
        }
    }
    return (
        <div className='form-page'>
            <div className="f-container" id="container">
                <div className="form-container sign-in">
                    <h1>Sign In</h1>
                    <span>Use your email password</span>
                        <input type="text" placeholder="Username" onChane={(e) => setLogin(e.target.value)} />
                        <input type="password" placeholder="Password" onChnge={(e) => setPass(e.target.value)} />
                        <button >Sign In</button>
                </div>
                <div className="toggle-container">
                    <div className="toggle">

                        <div className="toggle-panel toggle-right">
                            <h1>Olá amigo!</h1>
                            <p>Sign In with your personal details to use all of site features</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
