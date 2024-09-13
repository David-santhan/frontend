import axios from 'axios';
import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AdminTopNav from './AdminTopNav';
import UserTopNav from './UserTopNav';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CryptoJS from 'crypto-js';



function AdminUpdateClient() {
    let navigate = useNavigate();
    const {id}=useParams();
    console.log(id)
    const [values,setValues]= useState({
  id:id,
  ClientName:'',
  ClientCode:'',
  Email:'',
  Email1:'',
  Email2:'', 
  Location:'',
  MobileNumber:'',
  MobileNumber1:'',
  MobileNumber2:'',
  Name:'',
  Name1:'',
  Name2:'',
  Services:'',
  Spoc:'',
  Spoc1:'',
  Spoc2:'',

})
useEffect(()=>{
    axios.get('https://hrbackend-e58m.onrender.com/getClientdatatoUpdate/'+id)
.then(res=>{
  setValues({...values,
    ClientName:res.data.ClientName,
    ClientCode:res.data.ClientCode,
    Email:res.data.Email,
    Email1:res.data.Email1,
    Email2:res.data.Email2,
    Location:res.data.Location,
    MobileNumber:res.data.MobileNumber,
    MobileNumber1:res.data.MobileNumber1,
    MobileNumber2:res.data.MobileNumber2,
    Name:res.data.Name,
    Name1:res.data.Name1,
    Name2:res.data.Name2,
    Services:res.data.Services,
    Spoc:res.data.Spoc,
    Spoc1:res.data.Spoc1,
    Spoc2:res.data.Spoc2})
}).catch(err=> console.log(err))
},[])

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
const userType = getDecryptedData("User Type")
const handleSubmit= async (e)=>{
    e.preventDefault();
    axios.put('https://hrbackend-e58m.onrender.com/UpdateClient/'+id,values)
    .then(res=>{
     console.log(res)
     alert(res.data.msg)
    navigate("/Clients")
    }).catch(err=> { console.log(err);alert("Error")})    
 } 
  return (
    <div>
        {userType === 'Admin' ? <AdminTopNav/> : <UserTopNav />} 
        <center>
        <Form onSubmit={handleSubmit}   style={{backgroundColor:"antiquewhite",margin:"15px",borderRadius:"20px",padding:"20px"}}>
         <h2 style={{textAlign:"center",fontFamily:"initial"}}><b><img style={{width:"35px",borderRadius:"50px"}} src="/Images/icon.png"></img> Update Client Details</b></h2> <hr></hr>
        <Row className="mb-3">
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Client Code</b></Form.Label>
          <Form.Control   value={values.ClientCode} onChange={(e) => setValues({...values,ClientCode:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} />
                </Form.Group>

        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Client Name</b></Form.Label>
          <Form.Control   value={values.ClientName} onChange={(e) => setValues({...values,ClientName:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Client Name" />
                   </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}} title='Types Of Services'><b>Type Of Services</b></Form.Label>
          <Form.Select  value={values.Services} onChange={(e)=> setValues({...values,Services:e.target.value})} style={{width:"300px",textAlign:"center",border:"1px solid black",borderRadius:"15px"}} >
            <option value="">Choose...</option>
            <option value="FTE">FTE</option>
            <option value="TP">TP</option>
            <option value="FTE & TP">Both</option>

          </Form.Select>
        
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Location</b></Form.Label>
          <Form.Control   value={values.Location} onChange={(e) => setValues({...values,Location:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Location" />
                    </Form.Group> <hr style={{marginTop:"20px"}}></hr>
<center>              <h5 style={{fontFamily:"fantasy",textDecoration:"underline"}}><b>Contact Details</b></h5>
</center>      
  <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>1<sup>st</sup> <sub>Contact Person Name</sub></b></Form.Label>
          <Form.Control   value={values.Name} onChange={(e) => setValues({...values,Name:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                    </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Type Of Contact</b></Form.Label>
          <Form.Control  value={values.Spoc} onChange={(e) => setValues({...values,Spoc:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Type Of Contact" />
            
                  </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control   value={values.MobileNumber} onChange={(e) => setValues({...values,MobileNumber:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                  </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control  value={values.Email} onChange={(e) => setValues({...values,Email:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
          
              </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>2<sup>nd</sup> <sub>Contact Person Name</sub> </b></Form.Label>
          <Form.Control  value={values.Name1}   onChange={(e) => setValues({...values,Name1:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                 </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Type Of Contact</b></Form.Label>
          <Form.Control  value={values.Spoc1} onChange={(e) => setValues({...values,Spoc1:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Type Of Contact" />
            
               </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control  value={values.MobileNumber1} onChange={(e) => setValues({...values,MobileNumber1:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                  </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control  value={values.Email1} onChange={(e) =>setValues({...values,Email1:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
         
              </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>3<sup>rd</sup> <sub>Contact Person Name</sub></b></Form.Label>
          <Form.Control   value={values.Name2} onChange={(e) => setValues({...values,Name2:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Type Of Contact</b></Form.Label>
          <Form.Control  value={values.Spoc2} onChange={(e) => setValues({...values,Spoc2:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Type Of Contact" />
            
                   </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control   value={values.MobileNumber2} onChange={(e) => setValues({...values,MobileNumber2:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                   </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control   value={values.Email2} onChange={(e) => setValues({...values,Email2:e.target.value})} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
        
              </Form.Group>
       
</Row>
<center>
<Button style={{borderRadius:"15px"}} variant="primary" type="submit">
        <b>Update</b>
      </Button>

</center>
</Form>
        </center>
        

    </div>
  )
}

export default AdminUpdateClient