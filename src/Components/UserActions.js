
import React, { useEffect, useRef, useState } from 'react';
import UserTopNav from './UserTopNav';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CryptoJS from 'crypto-js';
import TeamLeadTopNav from './TeamLeadTopNav';



function UserActions() {
   let updatedResumeRef = useRef();
   let ornnovaProfileRef = useRef();
   let candidateimageRef = useRef();
    const [show, setShow] = useState(false);
    const [showAss, setShowAss] = useState(false);
  const [isModified, setIsModified] = useState(false); // Track if any changes were made
  const [allFieldsFilled, setAllFieldsFilled] = useState(false); // Check if all fields are filled

    const [loginUserData, setLoginUserData] = useState([]);
    const { id } = useParams();
    const [firstName,setFirstName]=useState();
    const [lastName,setLastName]=useState();
    const [email,setEmail]=useState();
    const [mobileNumber,setMobileNumber]=useState();
    const [dob,setDob]=useState();
    const [ctc,setCtc]=useState();
    const [ectc,setEctc]=useState();  
    const [totalYoe,setTotalYoe]=useState();
    const [relevantYoe,setRelevantYoe]=useState();
    const [lwd,setLwd]=useState();
    const [currentLocation,setCurrentLocation]=useState();
    const [prefLocation,setPrefLocation]=useState();
    const [resignationServed,setResignationServed]=useState();
    const [currentOrg,setCurrentOrg]=useState();
    const [candidateSkills,setCandidateSkills]=useState();
    const [role,setRole]=useState();
    const [internalScreening,setInternalScreening]=useState();
    const [sharedWithClient,setSharedWithClient]=useState();
    const [feedback,setFeedback]=useState();
    const [details,setDetails]=useState();
    const [interviewDate,setInterviewDate]=useState();
    const [educationalQualification,setEducationalQualification]=useState();
    const [offerInHand,setOfferInHand]=useState();
    const [remark,setRemark]=useState();
    const [savedStatus, setSavedStatus] = useState();
    const [hover, setHover] = useState(false);
    const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false); // Tracks submission status
    const [candidateData,setCandidateData]= useState([]);
    
    // const [updatedResume,setUpdatedResume]=useState();
    // const [ornnovaProfile,setOrnnovaProfile]=useState();
    // const [candidateImage,setCandidateImage]=useState();


    let JWT_SECRET="ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar"

    const date = new Date('');
if (!isNaN(date)) {
  console.log(date.toISOString());
} else {
  // console.error("Invalid date");
}




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
 
    const userId = getDecryptedData('Id'); // Retrieve the user ID from local storage
    const userEmail = getDecryptedData('Email');
    const userType = getDecryptedData("User Type");

    const navigate = useNavigate();
    const [requirValues, setRequirValues] = useState({
        id: id,
        regId: "",
        client: "",
        typeOfContract: "",
        startDate: "",
        duration: "",
        location: "",
        sourceCtc: "",
        qualification: "",
        yearsExperience: "",
        relevantExperience: "",
        skill: "",
        assessments: [],
        update: "",
        claimedBy: [],
    });
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const employeeId = loginUserData.map(item => item._id);
   
     
    const todayDate = getTodayDate();

    const viewCandidates = async()=>{
      try {
        const response = await axios.get(`https://ornnovabackend.onrender.com/viewactions/${id}/${userId}`)
        setCandidateData(response.data.candidates);
        // handleShow()
        // console.log(response.data);
      } catch (error) {
        // alert("No Candidates")
      }
    }

    useEffect(()=>{
      viewCandidates();
    })

    useEffect(() => {
        const fetchRequirement = async () => {
            try {
              console.log(id)
                const response = await axios.get(`https://ornnovabackend.onrender.com/actions/${id}/${userId}`);
                // console.log('Fetched requirement:', response.data); // Check the data structure
                setRequirValues(prevValues => ({
                    ...prevValues,
                    regId: response.data.regId,
                    client: response.data.client,
                    typeOfContract: response.data.typeOfContract,
                    startDate: response.data.startDate,
                    duration: response.data.duration,
                    location: response.data.location,
                    sourceCtc: response.data.sourceCtc,
                    qualification: response.data.qualification,
                    yearsExperience: response.data.yearsExperience,
                    relevantExperience: response.data.relevantExperience,
                    skill: response.data.skill,
                    assessments: response.data.assessments,
                    update: response.data.update,
                    claimedBy: response.data.claimedBy
                }));
            } catch (err) {
                console.error('Error fetching requirement:', err);
            }
        };     
        const fetchUserData = async (email) => {
            try {
                const response = await fetch(`https://ornnovabackend.onrender.com/loggedinuserdata/${email}`);
                const data = await response.json();
                setLoginUserData(data);
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
      
        fetchRequirement();
        fetchUserData(userEmail);
    }, [id, userId, userEmail]);

    const [scores, setScores] = useState(requirValues.assessments.map(() => '')|| []);

    // Check if all fields are filled (called whenever scores change)
useEffect(() => {
  if (scores.length > 0) {
    const allFilled = scores.every(score => score.trim() !== ''); // Check if all scores are non-empty
    setAllFieldsFilled(allFilled);
  }
}, [scores]);

    // Handle score change
  const handleScoreChange = (index, value) => {
    const updatedScores = [...scores];
    updatedScores[index] = value;
    setScores(updatedScores);
  };
    
    const assessmentsWithScores = requirValues.assessments.map((assessment, index) => ({
      assessment: assessment.assessment,
      yoe: assessment.yoe,
      score: scores[index] // Ensure scores[index] exists
  }));
// const sendCandidateDataToDatabase = async () => {
//   // Create a FormData object
//   const formData = new FormData();

//   // Append basic fields
//   formData.append('reqId', id);
//   formData.append('recruiterId', userId);

//   // Create and append candidate data as a single JSON string
//   const candidateData = {
//       date: todayDate,
//       firstName,
//       lastName,
//       dob: new Date(dob).toISOString(),
//       mobileNumber,
//       email,
//       ctc,
//       ectc,
//       totalYoe,
//       relevantYoe,
//       lwd: new Date(lwd).toISOString(),
//       currentLocation,
//       prefLocation,
//       resignationServed,
//       currentOrg,
//       candidateSkills,
//       role,
//       savedStatus,
//       feedback,
//       details,
//       interviewDate: new Date(interviewDate).toISOString(),
//       educationalQualification,
//       offerInHand,
//       remark,
//       assessments: assessmentsWithScores,
//       recruiterId:userId
//   };

//   formData.append('candidate', JSON.stringify(candidateData));

//   // Append files if they exist
//   if (updatedResumeRef.current?.files[0]) formData.append('updatedResume', updatedResumeRef.current.files[0]);
//   if (ornnovaProfileRef.current?.files[0]) formData.append('ornnovaProfile', ornnovaProfileRef.current.files[0]);
//   if (candidateimageRef.current?.files[0]) formData.append('candidateImage', candidateimageRef.current.files[0]);

//   try {
//       const response = await fetch('https://ornnovabackend.onrender.com/Candidates', {
//           method: 'POST',
//           body: formData // Send FormData object
//       });

//       if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.message}`);
//       }

//       const result = await response.json();
//       console.log(result);
//       window.location.reload();
//       alert("Data saved successfully ✅");

//   } catch (error) {
//       console.error('Error:', error);
//       alert("Failed to save data ❌");
//   }
// };

const sendCandidateDataToDatabase = async (status) => {
  // Create a FormData object
  const formData = new FormData();

  // Append basic fields
  formData.append('reqId', id);
  formData.append('recruiterId', userId);

  // Create and append candidate data as a single JSON string
  const candidateData = {
      date: todayDate,
      firstName,
      lastName,
      dob: new Date(dob).toISOString(),
      mobileNumber,
      email,
      ctc,
      ectc,
      totalYoe,
      relevantYoe,
      lwd: new Date(lwd).toISOString(),
      currentLocation,
      prefLocation,
      resignationServed,
      currentOrg,
      candidateSkills,
      role,
      savedStatus: status, // Use the status passed as a parameter
      feedback,
      details,
      interviewDate: new Date(interviewDate).toISOString(),
      educationalQualification,
      offerInHand,
      remark,
      assessments: assessmentsWithScores,
      recruiterId: userId
  };

  formData.append('candidate', JSON.stringify(candidateData));

  // Append files if they exist
  if (updatedResumeRef.current?.files[0]) formData.append('updatedResume', updatedResumeRef.current.files[0]);
  if (ornnovaProfileRef.current?.files[0]) formData.append('ornnovaProfile', ornnovaProfileRef.current.files[0]);
  if (candidateimageRef.current?.files[0]) formData.append('candidateImage', candidateimageRef.current.files[0]);

  try {
      const response = await fetch('https://ornnovabackend.onrender.com/Candidates', {
          method: 'POST',
          body: formData // Send FormData object
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.message}`);
      }

      const result = await response.json();
      console.log(result);
      window.location.reload();
      alert("Data saved successfully ✅");

  } catch (error) {
      console.error('Error:', error);
      alert("Failed to save data ❌");
  }
};

const submitAssessment=()=>{
  if (allFieldsFilled) {
    alert(" Assessment Submitted ✅");
    setShowAss(false);
    setIsAssessmentSubmitted(true); // Set to true after submission
 
  }
 
}

    return (
        <div>
            {/* <UserTopNav /> */}
            {userType === "TeamLead" ? <TeamLeadTopNav/> : <UserTopNav/>}
            <center> <hr></hr>
           <center>
           <h3 style={{ textAlign: "center", }}>
                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                <b style={{ fontFamily: "monospace" }}>Requirement Details</b>
            </h3>
           </center>

            {/* Requirement and Assessment Table */}
            <Table style={{textAlign:"center"}} bordered hover responsive>
                <thead>
                    <tr>
                        <th>Reg Id</th>
                        <th>Client</th>
                        <th>Type Of Contract</th>
                        <th>Start Date</th>
                        <th>Duration</th>
                        <th>Source Ctc</th>
                        <th>Location</th>
                        <th>Qualification</th>
                        <th>Years of Experience</th>
                        <th>Relevant Experience</th>
                        <th>Skills</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{requirValues.regId}</td>
                        <td>{requirValues.client}</td>
                        <td>{requirValues.typeOfContract}</td>
                        <td>{new Date(requirValues.startDate).toLocaleDateString()}</td>
                        <td>{requirValues.duration}</td>
                        <td>{requirValues.sourceCtc}</td>
                        <td>{requirValues.location}</td>
                        <td>{requirValues.qualification}</td>
                        <td>{requirValues.yearsExperience}</td>
                        <td>{requirValues.relevantExperience}</td>
                        <td>{requirValues.skill}</td>
                    </tr>
                </tbody>
            </Table> <hr></hr>

            {/* Assessment Details */}
            <h3 style={{ textAlign: "center", }}>
                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                <b style={{ fontFamily: "monospace" }}>Assessment </b>
            </h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Assessment</th>
                        <th>Years of Experience</th>
                    </tr>
                </thead>
                <tbody>
                    {requirValues.assessments.map((assessment, index) => (
                        <tr key={index}>
                            <td>{assessment.assessment}</td>
                            <td>{assessment.yoe}</td>
                        </tr>
                    ))}
                </tbody>
            </Table> <hr></hr>

            {/* Candidates Uploaded Table */}
            <h3 style={{ textAlign: "center", }}>
                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                <b style={{ fontFamily: "monospace" }}>Candidates Uploaded </b>
            </h3>
            <Table style={{textAlign:"center"}} bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ECTC</th>
                        <th>Status</th>
                        <th>Uploaded On</th>
                    </tr>
                </thead>
                <tbody>
                    {candidateData && candidateData.length > 0 ? (
                        candidateData.map((item, index) => {
                            const recentStatus = item.Status && item.Status.length > 0
                                ? item.Status[item.Status.length - 1].Status
                                : "No Action Taken";

                            let textColor;
                            if (recentStatus === "No Action Taken") textColor = "blue";
                            else if (["Client Rejected", "L1 Rejected", "L2 Rejected", "Rejected", "Declined"].includes(recentStatus)) textColor = "red";
                            else if (["Shared with Client", "L1 Pending", "L2 Pending"].includes(recentStatus)) textColor = "orange";
                            else textColor = "green";

                            return (
                                <tr key={index}>
                                    <td>{item.firstName} {item.lastName}</td>
                                    <td>{item.ectc}</td>
                                    <td style={{ color: textColor }}>
                                        <b>{recentStatus}</b>
                                    </td>
                                    <td>{item.uploadedOn ? new Date(item.uploadedOn).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table> <hr></hr>
                    <Row>
                        <center>
                        <Button onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="lightsteelblue";e.target.style.color="black"}}} style={{borderRadius:"20px",fontWeight:"bold",border:"0px",backgroundColor:"lightsteelblue",color:"black"}} onClick={() => setShow(true)}>
                       Upload Candidate
                       </Button>

      <Modal
      show={show}
      onHide={() => setShow(false)}
      fullscreen={true}
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          <h3 style={{ textAlign: "center", fontFamily: "initial" }}>
            <b><img style={{ width: "35px", borderRadius: "50px" }} src='/Images/icon.png' alt="logo"/> Upload Candidate</b>
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ backgroundColor: "aliceblue", padding: "30px", borderRadius: "20px" }}>
          <Row className="g-3">
            <Col md={6} lg={4}>
              <FormLabel><b>Date</b></FormLabel>
              <Form.Control type="date" style={{ borderRadius: "15px", border: "1px solid black", fontWeight: "bold" }} defaultValue={todayDate} readOnly />
              </Col> 
            <Col md={6} lg={4}>
              <FormLabel><b>Recruiter</b></FormLabel>
              {loginUserData.map((item, index) => (
                <Form.Control key={index} readOnly  value={item.EmployeeName} style={{ borderRadius: "15px", border: "1px solid black", fontWeight: "bold" }} placeholder="Recruiter Name" />
              ))}
            </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Client</b></FormLabel>
              <Form.Control readOnly value={requirValues.client} style={{ borderRadius: "15px", border: "1px solid black", fontWeight: "bold" }} placeholder="Client" />
            </Col> <hr></hr>
            <Col md={6} lg={4}>
              <FormLabel><b>First Name</b></FormLabel>
              <Form.Control value={firstName} onChange={(e)=> setFirstName(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="First Name" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Last Name</b></FormLabel>
              <Form.Control value={lastName} onChange={(e)=> setLastName(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Last Name" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>DOB</b></FormLabel>
              <Form.Control value={dob} onChange={(e)=> setDob(e.target.value)} type='date' style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Candidate Name" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Mobile Number</b></FormLabel>
              <Form.Control value={mobileNumber} onChange={(e)=> setMobileNumber(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Mobile Number" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Email</b></FormLabel>
              <Form.Control value={email} onChange={(e)=> setEmail(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Email" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>CTC in LPA</b></FormLabel>
              <Form.Control value={ctc} onChange={(e)=> setCtc(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="CTC in LPA" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>ECTC in LPA</b></FormLabel>
              <Form.Control value={ectc} onChange={(e)=> setEctc(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="ECTC in LPA" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Total YOE</b></FormLabel>
              <Form.Control value={totalYoe} onChange={(e)=> setTotalYoe(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Total Years of Experience" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Relevant YOE</b></FormLabel>
              <Form.Control value={relevantYoe} onChange={(e)=> setRelevantYoe(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Relevant Years of Experience" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>LWD</b></FormLabel>
              <Form.Control value={lwd} onChange={(e)=> setLwd(e.target.value)} type='date' style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Last Working Day" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Current Location</b></FormLabel>
              <Form.Control value={currentLocation} onChange={(e)=> setCurrentLocation(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Current Location" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Pref Location</b></FormLabel>
              <Form.Control value={prefLocation} onChange={(e)=> setPrefLocation(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Pref Location" />
            <hr></hr> </Col>
            
            <Col md={6} lg={4}>
              <FormLabel><b>Resignation Served</b></FormLabel>
              <Form.Select value={resignationServed} onChange={(e)=> setResignationServed(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }}>
                <option>Choose...</option>
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Current Org</b></FormLabel>
              <Form.Control value={currentOrg} onChange={(e)=> setCurrentOrg(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Current Org" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Candidate Skills</b></FormLabel>
              <Form.Control value={candidateSkills} onChange={(e)=> setCandidateSkills(e.target.value)} as="textarea" rows={5} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Candidate Skills" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Role</b></FormLabel>
              <Form.Control value={role} onChange={(e)=> setRole(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Role" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>About Candidate</b></FormLabel>
              <Form.Control value={feedback} onChange={(e)=> setFeedback(e.target.value)} as="textarea" rows={5} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Feedback" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Recruiter Feedback</b></FormLabel>
              <Form.Control value={details} onChange={(e)=> setDetails(e.target.value)} as="textarea" rows={5} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Details" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Interview Date</b></FormLabel>
              <Form.Control value={interviewDate} onChange={(e)=> setInterviewDate(e.target.value)} type='date' style={{ borderRadius: "15px", border: "1px solid black" }}  />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Educational Qualification</b></FormLabel>
              <Form.Control value={educationalQualification} onChange={(e)=> setEducationalQualification(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Educational Qualification" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Offer in Hand</b></FormLabel>
              <Form.Control value={offerInHand} onChange={(e)=> setOfferInHand(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Offer in Hand" />
            <hr></hr> </Col>           
            <Col md={6} lg={4}>
              <FormLabel><b>Remark</b></FormLabel>
              <Form.Control value={remark} onChange={(e)=> setRemark(e.target.value)} style={{ borderRadius: "15px", border: "1px solid black" }} placeholder="Remark" />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Updated Resume</b></FormLabel>
              <Form.Control  ref={updatedResumeRef} type='file' accept='application/pdf' style={{ borderRadius: "15px", border: "1px solid black" }} />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Ornnova Profile</b></FormLabel>
              <Form.Control ref={ornnovaProfileRef} type='file' accept='application/pdf' style={{ borderRadius: "15px", border: "1px solid black" }} />
            <hr></hr> </Col>
            <Col md={6} lg={4}>
              <FormLabel><b>Image</b></FormLabel>
              <Form.Control  ref={candidateimageRef} type='file' style={{ borderRadius: "15px", border: "1px solid black" }} />
            <hr></hr> </Col>
          </Row>   
        
          <Button     onMouseEnter={(e) => {e.target.style.padding="10px";e.target.style.color="white"}}
    onMouseLeave={(e) => {e.target.style.padding="7px";e.target.style.color="black"}} 

  variant="primary"
  style={{
    borderRadius: "10px",
    backgroundColor: isAssessmentSubmitted ? "mediumseagreen" : "tomato", // Conditionally set background color
    color:"black",
    border: "0px",
    fontWeight:"bold"
  }}
  onClick={() => setShowAss(true)}
>
 {isAssessmentSubmitted ? "Update Assessment" : "Take Assessment"}
</Button>

    <hr/>
          <Modal
            show={showAss}
            onHide={() => setShowAss(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    <h3 style={{ fontFamily: "monospace" }}><b>Assessment</b></h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
      {requirValues.assessments.map((assessment, index) => (
        <Row key={index} className="mb-3">
          <Col md={6} lg={8}>
            <Form.Control
              as="textarea"
              rows={5}
              style={{ borderRadius: "15px", border: "1px solid black", fontWeight: "bold" }}
              value={assessment.assessment}
              readOnly
            />
          </Col>
          <Col md={3} lg={2}>
            <Form.Control
              style={{ textAlign: "center", borderRadius: "15px", border: "1px solid black", fontWeight: "bold" }}
              value={assessment.yoe}
              readOnly
            />
          </Col>
          <Col md={3} lg={2}>
            <Form.Control
              value={scores[index] || ''} // Ensure we do not access an undefined score
              onChange={(e) => handleScoreChange(index, e.target.value)}
              style={{ textAlign: "center", borderRadius: "15px", border: "1px solid black" }}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <center>
          <Button
            onClick={() => submitAssessment()}
            disabled={!allFieldsFilled} // Disable the button if not all fields are filled
            style={{
              width: "200px",
              borderRadius: "20px",
              backgroundColor: hover ? "green" : "gray",
              color: "white",
              border: "1.5px solid lightgray"
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <b>Submit Assessment</b>
          </Button>
        </center>
      </Row>
    </Modal.Body>
        </Modal>

<center>
<Button 
    onClick={() => { 
        setSavedStatus("Saved"); // Set savedStatus to "Saved"
        sendCandidateDataToDatabase("Saved"); // Send data to the database with status "Saved"
    }} 
    onMouseEnter={(e) => {e.target.style.backgroundColor = "lightgray";e.target.style.color="black";e.target.style.padding="10px"}}
    onMouseLeave={(e) => {e.target.style.backgroundColor = "slateblue";e.target.style.color="white";e.target.style.padding="7px"}} 
    style={{ 
        borderRadius: "10px", 
        margin: "20px", 
        width: "100px", 
        backgroundColor: "slateblue", 
        border: "0px", 
        fontWeight: "bolder" 
    }}
    title='This Will Only Save the Details, will Not be Uploaded'>
    Save
</Button>

<Button 
    onClick={() => { 
        setSavedStatus("Uploaded"); // Set savedStatus to "Uploaded"
        sendCandidateDataToDatabase("Uploaded"); // Send data to the database with status "Uploaded"
    }} 
    onMouseEnter={(e) => {e.target.style.backgroundColor = "lightgray";e.target.style.color="black";e.target.style.padding="10px"}}
    onMouseLeave={(e) => {e.target.style.backgroundColor = "green";e.target.style.color="white";e.target.style.padding="7px"}} 
    style={{ 
        borderRadius: "10px", 
        margin: "20px", 
        width: "100px", 
        backgroundColor: "green", 
        border: "0px ", 
        fontWeight: "bolder" 
    }}>
    Upload
</Button>

    </center>        </Form>
      </Modal.Body>
    </Modal>
                        </center>
                    </Row>
                  
              
            </center>
            {/* Additional form code for uploading candidate details (commented out) */}
        </div>
    );
}

export default UserActions;



