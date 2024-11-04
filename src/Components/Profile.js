import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import AdminTopNav from './AdminTopNav';
import Button from 'react-bootstrap/Button';
import UserTopNav from './UserTopNav';
import TeamLeadTopNav from './TeamLeadTopNav';
import CryptoJS from 'crypto-js';



function Profile() {

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
    const localStoreEmpName = getDecryptedData("Name");
  const localStoreProfile = getDecryptedData("ProfilePic");
  const localStoreEmpCode = getDecryptedData("Employee Code");
 const localStoreEmail = getDecryptedData("Email");
 const localStoreStatusType = getDecryptedData("User Type")

 const [loginUserData,setloginUserData]= useState([]);

let userData= async(email)=>{
 let reqOption={
    method:"GET",
  }
  let JSONData = await fetch(`https://ornnovabackend.onrender.com/loggedinuserdata/${email}`,reqOption);
  let JSOData = await JSONData.json();
  setloginUserData(JSOData);
 
     

}
useEffect(()=>{
  userData(localStoreEmail);
})

  return (
    <div>
        {/* <AdminTopNav/> */}
        {localStoreStatusType === "Admin" ? <AdminTopNav/> : localStoreStatusType === "TeamLead" ? <TeamLeadTopNav/>:<UserTopNav/>}
        {
          loginUserData.map((item)=>{
            return(
                      
              <center>
              <Card style={{width:"320px",margin:"20px"}}>
            <Card.Header><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"10px"}}><img style={{width:"30px",margin:"20px"}} variant="top" src='/Images/icon.png' />Employee Code:</b>{item.EmpCode}</Card.Header>
            <Card.Body>
                   <Card.Img style={{}} variant="top" src={`https://ornnovabackend.onrender.com/${item.ProfilePic}`} /> 
              <Card.Title><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Employee Name:</b> {item.EmployeeName}</Card.Title>
              <ListGroup className="list-group-flush">
              <ListGroup.Item></ListGroup.Item>
              <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Email:</b>{item.Email}</ListGroup.Item>
              <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>User Type:</b>{item.UserType}</ListGroup.Item>
            </ListGroup>
              {/* <Button variant="primary">Go somewhere</Button> */}
            </Card.Body>
          </Card>
             </center>

            )
          })
        }

       
    </div>
  )
}

export default Profile
