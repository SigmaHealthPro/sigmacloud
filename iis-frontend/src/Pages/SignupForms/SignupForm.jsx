import React from 'react'
import './SignupForm.css'
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
    const navigate = useNavigate();
    const handleClick=()=>{
        navigate('/signupPatient');
    };
  return (
    <div>
        <div className="rectangle-container" >
        <div className="rectangle-div" />
        <div className="signup-as-patient" onClick={handleClick}>Signup as Patient</div>
      </div>
      <div className="group-div">
        <div className="rectangle-div" />
        <div className="signup-as-patient">Signup as Provider</div>
      </div>
      <div className="rectangle-parent1">
        <div className="group-child2" />
        <div className="facebook-1" />
        <div className="signup-as-admin">Signup as Admin</div>
      </div>
    </div>
  )
}

export default SignupForm;