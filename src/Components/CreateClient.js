import React, { useState,useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AdminTopNav from './AdminTopNav';
import Table from 'react-bootstrap/Table';
import UserTopNav from './UserTopNav';
import CryptoJS from 'crypto-js';



function CreateClient() {
  const [clientCode,setClientCode]=useState('');
  const [clientName,setClientName]=useState('');
  const [services,setServices]=useState('');
  const [location,setLocation]=useState('');
  const [name,setName]=useState('');
  const [Spoc,setSpoc]=useState('');
  const [mobileNumber,setMobileNumber]=useState('');
  const [email,setEmail]=useState('');
  const [name1,setName1]=useState('');
  const [Spoc1,setSpoc1]=useState('');
  const [mobileNumber1,setMobileNumber1]=useState('');
  const [email1,setEmail1]=useState('');
  const [name2,setName2]=useState('');
  const [Spoc2,setSpoc2]=useState('');
  const [mobileNumber2,setMobileNumber2]=useState('');
  const [email2,setEmail2]=useState('');
  const [errors, setErrors] = useState({});


  let clientCodeRef=useRef();
  let clientNameRef=useRef();
  let servicesRef=useRef();
  let locationRef=useRef();
  let spocRef=useRef();
  let mobileNumberRef=useRef();
  let emailRef=useRef();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    generateClientCode();
  }, []);

  const generateClientCode = () => {
    const randomClientCode = Math.floor(Math.random() *  100000); 
    setClientCode(randomClientCode.toString());
  };


  const validate = () => {
    let errors = {};

    if (!clientName) {
      errors.clientName = 'Client Name is required.';
    }
    if (!location) {
      errors.location = 'Location is required.';
    }
    if (!services) {
      errors.services = 'Services is required.';
    }
    

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
//   let sendDataThroughJson=async()=>{
//     let datatoSend={
//         clientName:clientNameRef.current.value,
//         email:emailRef.current.value,
//         location:locationRef.current.value,
//         services:servicesRef.current.value,
//         spoc:spocRef.current.value,
//         mobileNumber:mobileNumberRef.current.value,
//         clientCode:clientCodeRef.current.value,
        
//     };
//     let datatoSendinJSON=JSON.stringify(datatoSend);
//     let myheader=new Headers();
//     myheader.append("content-type","application/json");

//     let reqOption={
//         method:"POST",
//         body:datatoSendinJSON,
//         headers:myheader,
//     };

//     let JSONData=await fetch("https://hrbackend-2.onrender.com/addClient",reqOption);
//     let JSOData= await JSONData.json();
//     if (JSOData.status==="Success") {
//       alert(JSOData.msg);
      
//     } else {
//       alert(JSOData.msg);
//     }
//     console.log(JSOData);
// }

  let sendClientDataToDataBase= async()=>{
    let dataToSend = new FormData();
    dataToSend.append("ClientCode",clientCode)
    dataToSend.append("ClientName",clientName);
    dataToSend.append("Email",email);
    dataToSend.append("Location",location);
    dataToSend.append("Services",services);
    dataToSend.append("Name",name);
    dataToSend.append("Spoc",Spoc);
    dataToSend.append("MobileNumber",mobileNumber);
    dataToSend.append("Name1",name1);
    dataToSend.append("Spoc1",Spoc1);
    dataToSend.append("MobileNumber1",mobileNumber1);
    dataToSend.append("Email1",email1);
    dataToSend.append("Name2",name2);
    dataToSend.append("Spoc2",Spoc2);
    dataToSend.append("MobileNumber2",mobileNumber2);
    dataToSend.append("Email2",email2);
    
    
    let reqOption={
      method:"Post",
      body:dataToSend,
    };
    let JSONData= await fetch("https://hrbackend-2.onrender.com/addClient",reqOption);
    let JSOData = await JSONData.json();
    if (JSOData.status == "Success") {
      alert(JSOData.msg);
      window.location.reload();
    } else {
      alert(JSOData.msg);
    }
    console.log(JSOData);
    
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
     sendClientDataToDataBase();
   
    }
  };

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
const UserType = getDecryptedData("User Type")

  return (
    <div>
        {/* <AdminTopNav/> */}
        {UserType === "Admin" ? <AdminTopNav/> : <UserTopNav/>}
        <center>
        <Form onSubmit={handleSubmit}  style={{backgroundColor:"antiquewhite",margin:"15px",borderRadius:"20px",padding:"20px"}}>
         <h2 style={{textAlign:"center",fontFamily:"initial"}}><b><img style={{width:"35px",borderRadius:"50px"}} src='/Images/icon.png'></img> Create Client</b></h2> <hr></hr>
        <Row className="mb-3">
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Client Code</b></Form.Label>
          <Form.Control ref={clientCodeRef}  value={clientCode} onChange={(e) => setClientCode(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} />
          {errors.clientCode && (
                <p style={{ color: 'red' }}>{errors.clientCode}</p>
              )}        </Form.Group>

        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Client Name</b></Form.Label>
          <Form.Control ref={clientNameRef}  value={clientName} onChange={(e) => setClientName(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Client Name" />
          {errors.clientName && (
                <p style={{ color: 'red' }}>{errors.clientName}</p>
              )}           </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}} title='Types Of Services'><b>Type Of Services</b></Form.Label>
          <Form.Select ref={servicesRef} value={services} onChange={(e)=> setServices(e.target.value)} style={{width:"300px",textAlign:"center",border:"1px solid black",borderRadius:"15px"}} >
            <option value="">Choose...</option>
            <option value="FTE">FTE</option>
            <option value="TP">TP</option>
            <option value="FTE & TP">Both</option>

          </Form.Select>
          {errors.services && (
                <p style={{ color: 'red' }}>{errors.services}</p>
              )} 
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Location</b></Form.Label>
          <Form.Control ref={locationRef}  value={location} onChange={(e) => setLocation(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Location" />
          {errors.location && (
                <p style={{ color: 'red' }}>{errors.location}</p>
              )}           </Form.Group> <hr style={{marginTop:"20px"}}></hr>
<center>              <h5 style={{fontFamily:"fantasy",textDecoration:"underline"}}><b>Contact Details</b></h5>
</center>      
  <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>1<sup>st</sup> <sub>Contact Person Name</sub></b></Form.Label>
          <Form.Control   value={name} onChange={(e) => setName(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                    </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Spoc</b></Form.Label>
          <Form.Control  value={Spoc} onChange={(e) => setSpoc(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Spoc" />
            
                  </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control ref={mobileNumberRef}  value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                  </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control ref={emailRef}  value={email} onChange={(e) => setEmail(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
          
              </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>2<sup>nd</sup> <sub>Contact Person Name</sub> </b></Form.Label>
          <Form.Control   value={name1} onChange={(e) => setName1(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                 </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Spoc</b></Form.Label>
          <Form.Control  value={Spoc1} onChange={(e) => setSpoc1(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Spoc" />
            
               </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control ref={mobileNumberRef}  value={mobileNumber1} onChange={(e) => setMobileNumber1(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                  </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control ref={emailRef}  value={email1} onChange={(e) => setEmail1(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
         
              </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>3<sup>rd</sup> <sub>Contact Person Name</sub></b></Form.Label>
          <Form.Control   value={name2} onChange={(e) => setName2(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Name" />
                </Form.Group>
              <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Spoc</b></Form.Label>
          <Form.Control  value={Spoc2} onChange={(e) => setSpoc2(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Spoc" />
            
                   </Form.Group>
        <Form.Group as={Col} >
          
          <Form.Label style={{margin:"10px"}}><b>Mobile Number</b></Form.Label>
          <Form.Control ref={mobileNumberRef}  value={mobileNumber2} onChange={(e) => setMobileNumber2(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Mobile Number" />
                   </Form.Group>
        <Form.Group as={Col} >
          <Form.Label style={{margin:"10px"}}><b>Email ID</b></Form.Label>
          <Form.Control ref={emailRef}  value={email2} onChange={(e) => setEmail2(e.target.value)} style={{width:"300px",borderRadius:"15px",border:"1px solid black"}} placeholder="Email" />
        
              </Form.Group>
       
</Row>
<center>
<Button style={{borderRadius:"15px"}} variant="primary" type="submit">
        <b>Create</b>
      </Button>

</center>
</Form>
        </center>
      
      {/* <center>
      <Table responsive="sm">
      <thead style={{textAlign:"center"}}>
        <tr>
          <th>Client Code</th>
          <th>Client Name</th>
          <th>Type Of Service</th>
          <th>Location</th>
          <th>Contact Person 1</th>
          <th>Spoc</th>
          <th>Number</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody style={{textAlign:"center"}}>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        </tbody>
        </Table>
      </center> */}
    </div>
  )
}

export default CreateClient
