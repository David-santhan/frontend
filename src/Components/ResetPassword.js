import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate,Link, useParams } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';

function ResetPassword() {
    const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

    const {id,token} = useParams();
    const navigate = useNavigate();

    const userValid = async()=>{
        const res = await fetch(`https://ornnovabackend.onrender.com/ResetPasswordpage/${id}/${token}`,{
            method:"GET",
            headers :{ "Content-Type":"application/json"}
        });
        const data = await res.json()

        if (data.status == 201) {
            console.log("User Valid")
        }else{
           navigate("*");
        }
    }
 useEffect(()=>{
    userValid();
 })

 const setVal=(e)=>{
 setPassword(e.target.value)
 }

 const sendPassword= async(e)=>{
    e.preventDefault();
    const res = await fetch(`https://ornnovabackend.onrender.com/${id}/${token}`,{
        method:"POST",
        headers :{ "Content-Type":"application/json"},
        body:JSON.stringify({password})
    });
    const data = await res.json()

    if (data.status == 201) {
       setPassword("");
       setShow(true);
    }else{
       toast.error("! Token Expired generate new Link")
    }
 }
  const validate = () => {
    let errors = {};

    if (password.length<0) {
      errors.password = 'Please enter Password ';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  return (
    <div>    
    <center>
     
   <Form  style={{backgroundColor:"lightgray",padding:"50px",borderRadius:"20px",width:"370px",marginTop:"15px"}}>
    <center>   <h4 style={{fontFamily:"inherit",textDecoration:"underline"}}><b><img src='/Images/icon.png' style={{width:"30px",margin:"10px"}}></img>Reset Password</b></h4> <br></br>
    </center>
         <Form.Group className="mb-3" controlId="formBasicEmail">
           <Form.Label><b>Enter your New Password</b></Form.Label>   
           <Form.Control name="password" value={password} onChange={setVal} style={{borderRadius:"15px",textAlign:"start",borderColor: errors.email ? 'red' : 'black'}} type="email" placeholder=" New Password" /> 
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} 
         </Form.Group>
   
         <Alert show={show} variant="success">
           <p>
             Updated Succesfuly
           </p>
           <div className="d-flex justify-content-end">
             <Button onClick={() => setShow(false)} variant="outline-success">
               Close me
             </Button> </div> </Alert>
         <Button onClick={sendPassword}   style={{margin:"10px",border:"1.5px solid black"}} variant="primary" type="submit">
           <b>Send</b>
         </Button>
       </Form>
       </center>
       <ToastContainer />
       </div>
  )
}

export default ResetPassword
