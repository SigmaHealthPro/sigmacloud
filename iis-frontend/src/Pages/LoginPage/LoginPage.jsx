import React, { useState } from 'react'
import './LoginPage.css';
import SignupForm from '../../Pages/SignupForms/SignupForm';
import logoName from '../../assets/sigmahealthpro-converted-3@2x.png';
import logo from '../../assets/sigmahealthpro-converted-4@2x.png';
import backGroungImg from '../../assets/whitepapertexture-1@2x.png'
import vector from '../../assets/vector-12.svg';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
  const navigate = useNavigate();
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const handleEmailChange = (e) => {
        setEnteredEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setEnteredPassword(e.target.value);
      };
    const handleLogin = () => {
      navigate('/sideBar');
        // try {
        //   const response = await fetch('http://localhost:5000/users', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       email: enteredEmail,
        //       password: enteredPassword,
        //     }),
        //   });
        //   console.log(enteredEmail);
        //   console.log(enteredPassword);
        //   if (response.ok) {
        //     const data = await response.json();
        //     // Assuming the API response includes a token and user details
        //     const { token, user } = data;
        //     console.log(data);
    
        //     // Store the token and user details in your application state or local storage
        //  localStorage.setItem('token', token);
        //  localStorage.setItem('user', JSON.stringify(user));
    
        //     // Redirect or perform other actions after successful login
        //     console.log('Login successful');
        //   } else {
        //     // Handle login error
        //     console.error('Login failed');
        //   }
        // } catch (error) {
        //   console.error('Error during login:', error);
        // }
      };
      
  return (
    <div className="login-page">
      
        <div className='loginLogo'>
            <img className="logoName" alt="" src={logoName}/>
            <img className="logo" alt="" src={logo}/>
        </div>
        <img className="backGroungImg" alt="" src={backGroungImg}/>
        <div className="loginContainer">
            <div className="container" >
                <div className="containerHeader">{`Get Started `}</div>
                <img className="vectorLeft" alt="" src={vector} />
                <img className="vectorRight" alt="" src={vector} />
                <div className="or-continue-with">Or continue with</div>
                <SignupForm/>
                <div className="emailContainer">
                    <input
                    className="enter-email"
                    type="text"
                    value={enteredEmail}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    autoComplete="off"
                    />
                </div>
                <div className="rectangle-parent">
                    <div className="group-item">
                        <input
                        className="password"
                        type="password"
                        value={enteredPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter Password"
                        autoComplete="off"
                        />
                    </div> 
                </div>
            
            <div class="toggleClass">
                <label class="relative inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" />
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                <span class="ms-3 text-sm font-medium text-white dark:text-gray-300">Remember Me</span>
                </label>
            </div>
            <i className="recover-password">Recover Password</i>

            <div className="button" onClick={handleLogin}>
                <img className="button-child" alt="" src="/rectangle-17.svg" />
                <div className="login">Login</div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage