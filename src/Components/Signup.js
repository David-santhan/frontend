import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Img from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer,toast} from 'react-toastify';
import CryptoJS from 'crypto-js';

function Signup() {

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
    let JWT_SECRET="ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar"

  // Function to decrypt data
  const decryptData = (ciphertext, secret) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const getDecryptedData = (key) => {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      return decryptData(encryptedValue, JWT_SECRET);
    }
    return null;
  };

  const userId = getDecryptedData("Id");

 

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validate = () => {
    let errors = {};

    if (!emailPattern.test(email)) {
      errors.email = 'Please enter your email ';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const setVal = (e) => {
    setEmail(e.target.value)
}

const sendLink = async (e)=>{
  // e.preventDefault();

  const res = await fetch ("https://ornnovabackend.onrender.com/sendpasswordlink",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },body:JSON.stringify({email})
  });
  const data = await res.json();
   if (data.status === 201) {
    setEmail("");
    setShow(true)
   }else{
    // toast.error("Invalid User")
    alert("Invalid User")
   }
}

//   const sendLink = async (e) => {
//   // e.preventDefault(); // To prevent page refresh on form submit, uncomment if necessary

//   const email = "example@example.com"; // Ensure email is obtained from the state or form

//   // Check if email is defined
//   if (!email) {
//     alert("Please enter an email address");
//     return;
//   }

//   try {
//     const res = await fetch("https://ornnovabackend.onrender.com/sendpasswordlink", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email }) // Make sure the email is valid
//     });

//     // Check HTTP response status
//     if (res.status === 201) {
//       const data = await res.json();
//       setEmail(""); // Clear the input field after success
//       setShow(true); // Show success message or UI feedback
//     } else if (res.status === 401) {
//       alert("Unauthorized. Please check your email or credentials.");
//     } else {
//       alert("Invalid User. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error sending password link:", error);
//     alert("An error occurred while sending the password reset link. Please try again later.");
//   }
// };

  
  // let sendUserData= async()=>{
  //   const res = await fetch("https://ornnovabackend.onrender.com/forgot-password",{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application/json"
  //     },body:JSON.stringify({
  //       email
  //     })
  //   });
  //   const data = await res.json();

  //   if (data.status === 401 || !data){
  //     alert("Invalid Email");
  //   }else{
  //      setShow(true);
  //      setEmail("");
      
  //   }
  // }
  


  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
    sendLink();
    }
  };

    let navigate=useNavigate();

  
  return (  
    <div>    
 <center>
  
<Form  style={{backgroundColor:"lightgray",padding:"50px",borderRadius:"20px",width:"370px",marginTop:"15px"}}>
<Img src='./Images/LOGO_ORNNOVA.avif' style={{width:"200px",borderRadius:"50px"}}></Img><hr></hr>
<h4 style={{fontFamily:"inherit",textDecoration:"underline"}}><b><img style={{width:"30px",margin:"10px"}} src='/Images/icon.png'></img>Forgot Password</b></h4> <br></br>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label><b>Enter Your Email</b></Form.Label>   
        <Form.Control name="email"  value={email} onChange={setVal } style={{borderRadius:"15px",textAlign:"start",borderColor: errors.email ? 'red' : 'black'}} type="email" placeholder=" Email Address" /> 
         {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} 
      </Form.Group>

      <Alert show={show} variant="success">
        <p>
          Email Sent Successfully
        </p>
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button> </div> </Alert>
      <Button onClick={handleSubmit}  style={{margin:"10px",border:"1.5px solid black"}} variant="primary" type="submit">
        <b>Send</b>
      </Button>
      <Button style={{margin:"10px",backgroundColor:"lightseagreen",border:"1.5px solid black"}} variant="primary" onClick={()=>{ navigate("/")}}>
        <b>Login</b>
      </Button>
    </Form>
    </center>
    <ToastContainer />
    </div>
  
  )
}

export default Signup
