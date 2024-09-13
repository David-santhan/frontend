import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Img from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';

function Loginpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [errors, setErrors] = useState({});
  const JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";

  const userTypeRef = useRef();
  const storeObj = useSelector((store) => store);
  console.log(storeObj);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to encrypt data
  const encryptData = (data, secret) => {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, secret).toString();
  };

  // Validate the input fields
  const validate = () => {
    let errors = {};

    if (!emailPattern.test(email)) {
      errors.email = 'Email is Required';
    }

    if (password.length < 6) {
      errors.password = 'Password is Required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailIsValid(emailPattern.test(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordIsValid(event.target.value.length >= 6);
  };

  const loginDatatoSend = async () => {
    let dataToSend = new FormData();
    dataToSend.append('Email', email);
    dataToSend.append('Password', password);
    dataToSend.append('UserType', userTypeRef.current.value);

    let reqOption = {
      method: "POST",
      mode: 'no-cors',
      body: dataToSend,
       headers: {
    'Content-Type': 'application/json'
  },
    };

    let JSONData = await fetch("https://hrbackend-e58m.onrender.com/login", reqOption);
    let JSOData = await JSONData.json();
    
    if (JSOData.status === "Success") { 
      alert(JSOData.msg); 
      dispatch({ type: "login", data: JSOData.data });
      
      // Store encrypted data in localStorage
      localStorage.setItem("isLogedin", true);
      localStorage.setItem("Name", encryptData(JSOData.data.EmployeeName, JWT_SECRET));
      localStorage.setItem("Employee Code", encryptData(JSOData.data.EmpCode, JWT_SECRET));
      localStorage.setItem("Email", encryptData(JSOData.data.Email, JWT_SECRET));
      localStorage.setItem("User Type", encryptData(JSOData.data.UserType, JWT_SECRET));
      localStorage.setItem("ProfilePic", encryptData(JSOData.data.ProfilePic, JWT_SECRET));
      localStorage.setItem("Status", encryptData(JSOData.data.Status, JWT_SECRET));
      localStorage.setItem("Id", encryptData(JSOData.data.Id, JWT_SECRET));
      localStorage.setItem("claimedRequirements", encryptData(JSOData.data.ClaimedRequirements, JWT_SECRET));

      // Navigate based on user type
      navigate(
        userTypeRef.current.value === "Admin" 
          ? "/Adminhome" 
          : userTypeRef.current.value === "TeamLead" 
            ? "/TLHome" 
            : "/home"
      );

      window.location.reload();
    } else {
      alert(JSOData.msg);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      loginDatatoSend();
    } else {
      alert('Invalid Details ❌');
    }
  };

  return (
    <div>
      <center>
        <Form onSubmit={handleSubmit} style={{ backgroundColor: "lightgray", padding: "50px", borderRadius: "20px", width: "370px", marginTop: "15px" }}>
          <Img src='./Images/LOGO_ORNNOVA.avif' style={{ width: "200px", borderRadius: "50px" }}></Img><hr />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label><b>Email address</b></Form.Label>
            <Form.Control value={email} onChange={handleEmailChange} style={{ borderRadius: "15px", textAlign: "center", borderColor: errors.email ? 'red' : 'black' }} type="email" placeholder="Enter Your Email Address" />
            {!emailIsValid && <p style={{ color: 'red' }}>Please enter a valid email address.</p>}
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label><b>Password</b></Form.Label>
            <Form.Control value={password} onChange={handlePasswordChange} style={{ borderRadius: "15px", textAlign: "center", borderColor: errors.password ? 'red' : 'black' }} type="password" placeholder="Enter Your Password" />
            {!passwordIsValid && <p style={{ color: 'red' }}>Password must be at least 6 characters long.</p>}
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUserType">
            <Form.Label><b>User Type</b></Form.Label>
            <Form.Select ref={userTypeRef} style={{ borderRadius: "15px", textAlign: "center", borderColor: errors.password ? 'red' : 'black' }}>
              <option value="">Select User Type</option>
              <option value="User">User</option>
              <option value="TeamLead">Team Lead</option>
              <option value="Admin">Admin</option>
            </Form.Select>
            {errors.userType && <p style={{ color: 'red' }}>{errors.userType}</p>}
          </Form.Group>

          <a href='/forgotpassword'>Forgot Password?</a>

          <Button style={{ margin: "10px", border: "1.5px solid black" }} variant="primary" type="submit">
            <b>Submit</b>
          </Button>
        </Form>
      </center>
    </div>
  );
}

export default Loginpage;
