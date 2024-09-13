import React,{useEffect, useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CloseButton from 'react-bootstrap/CloseButton';
import TeamLeadTopNav from './TeamLeadTopNav'
import CryptoJS from 'crypto-js';
import axios from 'axios';
import UserTopNav from './UserTopNav';




function TLNewRequirement() {
    const [regId,setRegId]=useState("");
  const [client,setClient]=useState([]);
  const [typeOfContract,setTypeOfContract]=useState("");
  const [startDate,setStartDate]=useState("");
  const [duration,setDuration]=useState("");
  const [location,setLocation]=useState("");
  const [sourceCtc,setSourceCtc]=useState("");
  const [qualification,setQualification]=useState("");
  const [yearsExperience,setYearsExperience]=useState("");
  const [relevantExperience,setRelevantExperience]=useState("");
  const [skill,setSkill]=useState("");
  const [requirmentType,setRequirmentType]=useState("");
  const [val,setVal]=useState([{
    Assessment:"",
    Yoe:""
  }]);
  const [selectedClient, setSelectedClient] = useState({
    ClientId: "",
    ClientName: "",
  });
  
  // Function to handle the client selection from dropdown
  const handleClientSelect = (e) => {
    const selectedValue = JSON.parse(e.target.value); // Parse the JSON string
    setSelectedClient({
      ClientId: selectedValue.ClientId, // Extract ClientId
      ClientName: selectedValue.ClientName, // Extract ClientName
    });
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
  const userId = getDecryptedData("Id");

  const clientRef=useRef();
  useEffect(()=>{
    getClientDetails(userId);
    generateRegID();
  },[userId])
  const generateRegID = () => {
    const randomClientCode = Math.floor(Math.random() *  10000); 
    setRegId(randomClientCode.toString());
  };

    const getClientDetails = async(userId)=>{
        try {
            let response = await axios.get(`https://hrbackend-e58m.onrender.com/TlClients/${userId}`);
            let data = response.data;  
            setClient(data.Client);
            console.log(data)
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
    };
    const handleAdd = () => {
      const abc = [...val, { Assessment: "", Yoe: "" }];
      setVal(abc);
    };

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const inputdata = [...val];
    inputdata[index] = { ...inputdata[index], [name]: value };
    setVal(inputdata);
};

const handleDelete = (index) => {
  const inputdata = [...val];
  inputdata.splice(index, 1);
  setVal(inputdata);
};

let sendUserDataToDataBase = async () => {
  const dataToSend = {
    regId,
    client: selectedClient.ClientName,
    typeOfContract,
    startDate,
    duration,
    location,
    sourceCtc,
    qualification,
    yearsExperience,
    relevantExperience,
    skill,
    requirmentType,
    uploadedBy:userId,
    clientId:selectedClient.ClientId,
    assessments: val.map(item => ({
      assessment: item.Assessment || "",
      yoe: item.Yoe || ""
    })),
    update:"New"
  };

  let reqOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  };

  let JSONData = await fetch("https://hrbackend-e58m.onrender.com/newRequirment", reqOption);
  let JSOData = await JSONData.json();
  if (JSOData.status === "Success") {
    alert(JSOData.msg);
    window.location.reload();
  } else {
    alert(JSOData.msg);
  }
  console.log(JSOData);
};


const handleSubmit=(event)=>{
  event.preventDefault();
  sendUserDataToDataBase()
}
  
  return (
    <div>
            {UserType === 'TeamLead' ? <TeamLeadTopNav /> : <UserTopNav />}

      <center>
        <Form onSubmit={handleSubmit} style={{backgroundColor:"blanchedalmond",margin:"15px",borderRadius:"20px",padding:"15px"}}>
        <h2 style={{textAlign:"center",fontFamily:"initial"}}><b><img style={{width:"35px",borderRadius:"50px"}} src='/Images/icon.png'></img> Add New Requirement</b></h2> <hr></hr>

      <Row className="mb-3">
        <Form.Group as={Col} >
          <Form.Label><b>Reg Id</b></Form.Label>
          <Form.Control value={regId} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}}   placeholder="Enter Reg Id" />
        </Form.Group>

        <Form.Group as={Col}>
  <Form.Label><b>Client</b></Form.Label>
  <Form.Select
    style={{
      width: "300px",
      textAlign: "center",
      margin: "10px",
      border: "1px solid gray",
      borderRadius: "15px",
    }}
    onChange={(e) => handleClientSelect(e)}
    placeholder="Enter Client"
  >
    <option value="">Choose...</option>
    {Array.isArray(client) &&
      client.map((item, index) => (
        <option
          key={index}
          value={JSON.stringify({ ClientId: item._id, ClientName: item.ClientName })} // Store both ClientId and ClientName
        >
          {item.ClientName} {/* Render ClientName */}
        </option>
      ))}
  </Form.Select>
</Form.Group>

        <Form.Group as={Col} >
          <Form.Label><b>Type Of Contract</b></Form.Label>
          <Form.Select value={typeOfContract} onChange={(e)=> setTypeOfContract(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} >
            <option value="">Choose...</option>
            <option value="FTE">FTE</option>
            <option value="C2H">C2H</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Start Date</b></Form.Label>
          <Form.Control value={startDate} onChange={(e)=> setStartDate(e.target.value)} type='date' style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Start Time" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Duration</b></Form.Label>
          <Form.Control value={duration} onChange={(e)=> setDuration(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Duration" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Location</b></Form.Label>
          <Form.Control value={location} onChange={(e)=> setLocation(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Location" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Source CTC</b></Form.Label>
          <Form.Control value={sourceCtc} onChange={(e)=> setSourceCtc(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Source CTC " />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Qualification</b></Form.Label>
          <Form.Control value={qualification} onChange={(e)=> setQualification(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Qualification" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Years of Experience</b></Form.Label>
          <Form.Control value={yearsExperience} onChange={(e)=> setYearsExperience(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Years of Experience" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Relevant Experience</b></Form.Label>
          <Form.Control value={relevantExperience} onChange={(e)=> setRelevantExperience(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Relevant Experience" />
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label><b>Skill</b></Form.Label>
          <Form.Control value={skill} onChange={(e)=> setSkill(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Skills" />
        </Form.Group> 
        <Form.Group as={Col} >
          <Form.Label><b>Requirement Type</b></Form.Label>
          <Form.Select value={requirmentType} onChange={(e)=> setRequirmentType(e.target.value)} style={{width:"300px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} >
            <option value="">Choose...</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
            <option value="Hold">Hold</option>
            <option value="Closed">Closed</option>
          </Form.Select>        </Form.Group> 
          {/* <Form.Group as={Col} >
          <Form.Label><b>Client ID</b></Form.Label>
        
            {
                client.map((item)=>{
                    return(
                        <Form.Control value={item._id}></Form.Control>
                    )
                })
            }
         
        </Form.Group> */}
          <hr></hr>
        <Form.Group as={Col} >
          <Button onClick={()=> handleAdd()}>ADD Assessment</Button> <hr></hr>
          {
            val.map((data,index)=>{
              return(
          
                <Row key={index}>
                <Form.Control name='Assessment' value={data.Assessment} onChange={(event)=> handleChange(event,index)} style={{width:"50%",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="Enter Assessment" />
                <Form.Control name='Yoe' value={data.Yoe}  onChange={(event)=> handleChange(event,index)} style={{width:"100px",textAlign:"center",margin:"10px",border:"1px solid gray",borderRadius:"15px"}} placeholder="YOE"/>  
                 {/* <Button style={{borderRadius:"10px",width:"60px",height:"40px",backgroundColor:"indianred",padding:"2px"}} onClick={()=> handleDelete(i)}><Image src="./trash.svg"></Image></Button> */}
                 <CloseButton onClick={()=>{handleDelete(index)}}/>
                </Row>
                
              )
            })
          }
        </Form.Group>
</Row>

      

      <Button style={{borderRadius:"15px"}} variant="primary" type="submit">
        <b>Submit</b>
      </Button>
    </Form>
    </center>
    </div>
  )
}

export default TLNewRequirement