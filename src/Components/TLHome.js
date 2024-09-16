import React, { useEffect, useState } from 'react';
import TeamLeadTopNav from './TeamLeadTopNav';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Image from 'react-bootstrap/Image';


function TLHome() {
  let [showUserData,setShowUserData]= useState([]);
  const [show, setShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [showfl, setShowfl] = useState(false);
  const [showprofiles, setShowprofiles] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showTodayData,setShowTodayData]= useState(false);
  const [requirements,setRequirements] = useState([]);
  const [usersData,setUsersData]=useState([]);
  const [assignedUsersData,setAssignedUsersData] = useState([]);
  const [selectedReqId,setSelectedReqId]= useState('');
  const [searchTerm, setSearchTerm] = useState("");       // Store the search input
  const [searchRecruiter, setSearchRecruiter] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]); // Store filtered requirements
  const [totalCount,setTotalCount] = useState(0);
  const [todayCount,setTodayCount] = useState(0);
  const [showtodayCandidates,setshowtodayCandidates]= useState(false);
  const [showtotalCandidates,setshowtotalCandidates] = useState(false);
  const [currentRecruiter,setCurrentRecruiter] = useState([]);
  const [recruiterStats, setRecruiterStats] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";

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

  // State to store user and team data
  const [userData, setUserData] = useState(null);
  const [teamData, setTeamData] = useState([]);

  // Fetch user and team data
  const fetchUserData = async (userId) => {
    try {
      let response = await axios.get(`https://hrbackend-1.onrender.com/TlHome/${userId}`);
      let data = response.data;
      setUserData(data.user);
      setTeamData(data.Team);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  let readUserDatafun = async (id) => {
    let reqOption = {
        method: "GET",
    };

    try {
        // Fetch user data and team details from the server
        let JSONData = await fetch(`https://hrbackend-1.onrender.com/getUserData/${id}`, reqOption);
        let JSOData = await JSONData.json();

        // Extract user details and team details from the response
        const { userDetails, teamDetails } = JSOData;

        // You can now use userDetails and teamDetails as needed
        setShowUserData({ userDetails, teamDetails });

        // Show the data, possibly in a modal or some other component
        handleShow();
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

 // Fetch requirements from the API
 let assignRequirements = async () => {
  let reqOption = {
    method: "GET"
  };

  try {
    let JSONData = await fetch(`https://hrbackend-1.onrender.com/getTeamrequirements/${userId}`, reqOption);
    let JSOData = await JSONData.json();
    console.log(JSOData);

    setRequirements(JSOData);  // Set the fetched requirements
    setFilteredRequirements(JSOData);  // Initially, all requirements are shown
    setShowfl(true);  // Show the table or section

  } catch (error) {
    console.log(error);
  }
};

// Handle search input change
const handleSearchChange = (e) => {
  const term = e.target.value;
  setSearchTerm(term);

  // Filter requirements based on client name
  const filteredData = requirements.filter((item) =>
    item.client.toLowerCase().includes(term.toLowerCase())
  );

  setFilteredRequirements(filteredData);  // Update filtered requirements
};
const handleSearchRecruiter = (event) => {
  setSearchRecruiter(event.target.value);
};

const filteredRecruiters = Array.isArray(recruiterStats) 
  ? recruiterStats.filter(recruiter => 
      recruiter.recruiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.recruiterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.recruiterCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

const [viewReq, setViewReq] = useState([]);
  const [showReq, setShowReq] = useState(false);

const viewRequirement = async (id) => {
    let reqOption = {
      method: 'GET',
    };
    try {
      let JSONData = await fetch(`https://hrbackend-1.onrender.com/getrequirements/${id}`, reqOption);
      let JSOData = await JSONData.json();
      console.log(JSOData);
      setViewReq([JSOData]); // Wrap in an array to iterate properly in the table
      setShowReq(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const userDetailsofAssignedClient = async (id) => {
    let reqOption = {
        method: "GET"
    };
    const response = await fetch(`https://hrbackend-1.onrender.com/userDetailsofAssignedRequirement/${id}`, reqOption);
    let data = await response.json();
    setAssignedUsersData(data);
    
};
  const userDetailstoAssignClient = async (id) => {
    let reqOption = {
        method: "GET"
    };
    const response = await fetch(`https://hrbackend-1.onrender.com/userDetailstoAssignRequirement/${id}/${userId}`, reqOption);
    let data = await response.json();
    setUserData(data);
    setSelectedReqId(id);
    userDetailsofAssignedClient(id);
    setShowAssign(true)
    
};

const assignReqToUser = async (userId) => {
  const ReqId = selectedReqId; // Ensure you have a way to store the selected client ID

  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm(`Are you sure you want to assign this client ?`);

  // If the user confirms, proceed with the assignment
  if (isConfirmed) {
      try {
          const response = await axios.post(`https://hrbackend-1.onrender.com/assignReq/${userId}/${ReqId}`, 
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const result = response.data;

          if (result.status === 'success') {
              alert('Client assigned successfully ✅');
              setShowAssign(false)
              // Optionally refresh the user list or perform any other updates
          } else {
              alert(result.msg);
          }
      } catch (error) {
          console.error('Error assigning client:', error.response ? error.response.data : error.message);
          alert('An error occurred while assigning the client. Please try again later.');
      }
  } else {
      // User canceled the assignment, so no action is taken
      alert('Client assignment was canceled ❌');
  }
};

const Reqcounts = async () => {
  let reqOption = {
    method: "GET"
  };

  try {
    const response = await fetch(`https://hrbackend-1.onrender.com/getTeamRequirementsCount/${userId}`, reqOption);
    let data = await response.json();

    // Log the complete data for debugging
  

    setTotalCount(data.totalCandidates);
    setTodayCount(data.todaysCandidates);
    setRecruiterStats(data.recruiterStats);

    // Log the today's candidates data for each recruiter

    // Show the profiles after data is loaded
    setShowprofiles(true);

  } catch (error) {
    console.log('Error fetching team requirements:', error);
  }
};

  return (
 <div>
  <TeamLeadTopNav/>
<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
<CardGroup>
  <Link  style={{ textDecoration: "none", color: "black" }} to="/TLNewReq">
    <Card style={{ margin: "20px", width: "270px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Create Requirement</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="success">
          <img src="./Images/createReq.svg" alt="Create Requirement" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link onClick={() => assignRequirements()}  style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "270px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Assign Requirement</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="secondary">
          <img src="./Images/assign.svg" alt="Assign Requirement" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link onClick={() => Reqcounts() } style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "270px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">
          <img src="./Images/profile.svg" alt="Profiles" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>
</CardGroup>
</div>

<Modal
style={{backgroundColor:"lightgray"}}
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Team Profiles</b>
        </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
      <center>
       

      {/* Displaying Team Information */}
      {teamData.length > 0 && (
        <div>
          <Table responsive style={{textAlign:"center"}} >
            <thead>
              <tr>
              <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Email</th>
                
              </tr>
            </thead>
            <tbody>
              {teamData.map((team, index) => (
                <tr key={index}>
                  <td><Link style={{textDecoration:"none"}} onClick={()=> readUserDatafun(team._id)}><b>{team.EmpCode}</b></Link></td>
                  <td>{team.EmployeeName}</td>
                  <td>{team.Email}</td> {/* Replace with actual fields */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      </center>
      <center>
      <Row>
    <Col>
  {showUserData && showUserData.userDetails && (
    <Modal  style={{backgroundColor:"lightgray",opacity:"95%"}}
    show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <strong className="me-auto">
          <b style={{ fontFamily: "monospace", margin: "5px" }}>
            Employee Name:
          </b>
          {showUserData.userDetails.EmployeeName || "N/A"}
        </strong>
        <small>
          <b style={{ fontFamily: "monospace", margin: "5px" }}>Emp Code:</b>
          {showUserData.userDetails.EmpCode || "N/A"}
        </small>
      </Modal.Header>
      <Modal.Body>
        <center>
          {showUserData.userDetails.ProfilePic ? (
            <img
              style={{ width: "200px" }}
              src={`https://hrbackend-1.onrender.com/${showUserData.userDetails.ProfilePic}`}
              alt="Profile"
            />
          ) : (
            <p>No Profile Picture Available</p>
          )}
        </center>
        <hr />
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>Email:</b>
          {showUserData.userDetails.Email || "N/A"}
        </p>
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>
            User Type:
          </b>
          {showUserData.userDetails.UserType || "N/A"}
        </p>
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>Status:</b>
          {showUserData.userDetails.Status || "N/A"}
        </p>
        <hr />
        <center>
          <h5>
            <img
              style={{ width: "30px", margin: "10px" }}
              src="/Images/icon.png"
              alt="icon"
            ></img>
            <b style={{ fontFamily: "monospace" }}>Team Details</b>
          </h5>
        </center>
        <Table
          disabled={showUserData.userDetails.UserType !== "TeamLead"}
          responsive
        >
          <thead>
            <tr>
              <th>Emp Code</th>
              <th>Employee Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {showUserData.teamDetails && showUserData.teamDetails.length > 0 ? (
              showUserData.teamDetails.map((teamMember) => (
                <tr key={teamMember._id}>
                  <td>{teamMember.EmpCode || "N/A"}</td>
                  <td>{teamMember.EmployeeName || "N/A"}</td>
                  <td>{teamMember.Email || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center",color:"indianRed" }}>
                  No Team Member...!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )}
</Col>
</Row>
      </center>

    </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="fullscreen"
        show={showfl}
        onHide={() => setShowfl(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Assign Requirements</b>
        </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         {/* Search input */}
      <input
        type="search"
        placeholder="🔍 Search by Client Name"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px", width: "300px",padding:"10px",border:"2px solid gray",borderRadius:"20px" }}
      />

      {/* Render table only if showfl is true */}
      {showfl && (
        <Table responsive>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Reg Id</th>
              <th>Client</th>
              <th>Requirement Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequirements.length > 0 ? (
              filteredRequirements.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link onClick={() => { viewRequirement(item._id) }} style={{ textDecoration: "none" }}>
                      <b>{item.regId}</b>
                    </Link>
                  </td>
                  <td>{item.client}</td>
                  <td>{item.requirementtype}</td>
                  <td>
                    <Button
                      onClick={() => userDetailstoAssignClient(item._id)}
                      style={{
                        padding: "5px",
                        borderRadius: "8px",
                        backgroundColor: "lightseagreen",
                        color: "white",
                        border: "1.5px solid black"
                      }}
                    >
                      <b>Assign</b>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No requirements found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}


        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showprofiles}
        onHide={() => setShowprofiles(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Profiles</b>
        </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

        <CardGroup>
  <Link onClick={()=> setShowTodayData(true)}  style={{ textDecoration: "none", color: "black" }} >
    <Card style={{ margin: "20px", width: "200px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Today Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="success"  style={{borderRadius:"50px"}}>
          <h6><b>{todayCount}</b></h6>
        </Button>
      </Card.Footer>
    </Card>
  </Link>
  <Link onClick={()=> setShowTodayData(true)} style={{ textDecoration: "none", color: "black" }} >
    <Card style={{ margin: "20px", width: "200px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Active Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="warning" style={{borderRadius:"20px"}}>
         <h6><b>{totalCount}</b></h6>
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link onClick={() => setLgShow(true)}  style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "200px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Team Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="secondary" >
          <img src="./Images/team.svg" alt="Assign Requirement" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link to="/TeamClient" style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "200px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Client Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">
          <img src="./Images/client.svg" alt="Profiles" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>
</CardGroup>
</div>

        </Modal.Body>
      </Modal>

      <Modal
      style={{backgroundColor:"lightgray"}}
        size="lg"
        show={showReq}
        onHide={() => setShowReq(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Requirement Details</b>
        </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {showReq && viewReq.length > 0 ? (
  <Table striped bordered hover responsive>
    <tbody>
      {viewReq.map((item, index) => (
        <React.Fragment key={index}>
           <tr>
            <th>Reg ID</th>
            <td>{item.regId}</td>
          </tr>
          <tr>
            <th>Client</th>
            <td>{item.client}</td>
          </tr>
          {/* <tr>
            <th>Client ID</th>
            <td>{item.clientId}</td>
          </tr> */}
          <tr>
            <th>Duration</th>
            <td>{item.duration}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>{item.location}</td>
          </tr>
          <tr>
            <th>Qualification</th>
            <td>{item.qualification}</td>
          </tr>
         
          <tr>
            <th>Relevant Experience</th>
            <td>{item.relevantExperience}</td>
          </tr>
          <tr>
            <th>Requirement Type</th>
            <td>{item.requirementtype}</td>
          </tr>
          <tr>
            <th>Skill</th>
            <td>{item.skill}</td>
          </tr>
          <tr>
            <th>Source CTC</th>
            <td>{item.sourceCtc}</td>
          </tr>
          <tr>
            <th>Start Date</th>
            <td>{new Date(item.startDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Type of Contract</th>
            <td>{item.typeOfContract}</td>
          </tr>
          <tr>
            <th>Update</th>
            <td>{item.update}</td>
          </tr>
          {/* <tr>
            <th>Uploaded By</th>
            <td>{item.uploadedBy}</td>
          </tr> */}
          <tr>
            <th>Uploaded Date</th>
            <td>{new Date(item.uploadedDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Years of Experience</th>
            <td>{item.yearsExperience}</td>
          </tr>
          <tr style={{textAlign:"center"}}>
          <th colSpan={2}><h4>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Assessment</b>
        </h4></th>
          </tr>
          <tr>
            <td>
              {item.assessments.length > 0 ? (
                <Table bordered responsive>
                  <thead >
                    <tr>
                      <th>Assessment</th>
                      <th>Years of Experience (YOE)</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {item.assessments.map((assessment, assessIndex) => (
                      <tr key={assessIndex}>
                        <td>{assessment.assessment || 'N/A'}</td>
                        <td>{assessment.yoe || 'N/A'}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                'No assessments'
              )}
            </td>
          </tr>
          {/* <tr>
            <th>Claimed By</th>
            <td>{item.claimedBy.length > 0 ? JSON.stringify(item.claimedBy) : 'No claims'}</td>
          </tr> */}
          <tr>
            <td colSpan="2"><hr /></td> {/* Separator for clarity */}
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </Table>
) : (
  <p>No requirements to display.</p>
)}



        </Modal.Body>
      </Modal>

      <Modal
      style={{backgroundColor:"lightgray",opacity:"95%"}}
        size="lg"
        show={showAssign}
        onHide={() => setShowAssign(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Assign Requirement</b>
        </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
        <center>
  {/* Displaying Team Information */}
  {userData && userData.length > 0 ? ( // Ensure userData is not null or undefined
    <div>
      <Table responsive style={{textAlign: "center"}}>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((team, index) => (
            <tr key={index}>
              <td>
                <Link style={{textDecoration: "none"}} onClick={() => readUserDatafun(team._id)}>
                  <b>{team.EmpCode}</b>
                </Link>
              </td>
              <td>{team.EmployeeName}</td>
              <td>{team.Email}</td> {/* Replace with actual fields */}
              <td>
                <Button onClick={() => assignReqToUser(team._id)} style={{backgroundColor: "lightsteelblue", color: "black", border: "1.5px solid black"}}>
                  <b>Assign</b>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ) : (
    <div>No team data available.</div> // Display a message if there is no data
  )}
</center>
 <hr></hr>
 <center>
  {/* Displaying Assigned Team Information */}
  <h4>
    <img
      style={{ width: "30px", margin: "10px" }}
      src='/Images/icon.png'
      alt="icon"
    />
    <b style={{ fontFamily: "monospace" }}>Assigned Users</b>
  </h4>

  {assignedUsersData && assignedUsersData.length > 0 ? (
    <div>
      <Table responsive style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {assignedUsersData.map((team, index) => (
            <tr key={index}>
              <td>
                <Link style={{ textDecoration: "none" }} onClick={() => readUserDatafun(team._id)}>
                  <b>{team.EmpCode}</b>
                </Link>
              </td>
              <td>{team.EmployeeName}</td>
              <td>{team.Email}</td> {/* Replace with actual fields */}
              <td>
                <Button style={{ backgroundColor: "lightgreen", color: "black", border: "1.5px solid black" }}>
                  <b>Assigned</b>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ) : (
    <div>
      <h5 style={{ fontFamily: "monospace", color: "gray" }}>No Assigned Users...!</h5> {/* Display this when no users are assigned */}
    </div>
  )}
</center>

      <center>
      <Row>
    <Col>
  {showUserData && showUserData.userDetails && (
    <Modal  style={{backgroundColor:"lightgray",opacity:"95%"}}
    show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <strong className="me-auto">
          <b style={{ fontFamily: "monospace", margin: "5px" }}>
            Employee Name:
          </b>
          {showUserData.userDetails.EmployeeName || "N/A"}
        </strong>
        <small>
          <b style={{ fontFamily: "monospace", margin: "5px" }}>Emp Code:</b>
          {showUserData.userDetails.EmpCode || "N/A"}
        </small>
      </Modal.Header>
      <Modal.Body>
        <center>
          {showUserData.userDetails.ProfilePic ? (
            <img
              style={{ width: "200px" }}
              src={`https://hrbackend-1.onrender.com/${showUserData.userDetails.ProfilePic}`}
              alt="Profile"
            />
          ) : (
            <p>No Profile Picture Available</p>
          )}
        </center>
        <hr />
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>Email:</b>
          {showUserData.userDetails.Email || "N/A"}
        </p>
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>
            User Type:
          </b>
          {showUserData.userDetails.UserType || "N/A"}
        </p>
        <p>
          <b style={{ fontFamily: "monospace", margin: "20px" }}>Status:</b>
          {showUserData.userDetails.Status || "N/A"}
        </p>
        <hr />
        <center>
          <h5>
            <img
              style={{ width: "30px", margin: "10px" }}
              src="/Images/icon.png"
              alt="icon"
            ></img>
            <b style={{ fontFamily: "monospace" }}>Team Details</b>
          </h5>
        </center>
        <Table
          disabled={showUserData.userDetails.UserType !== "TeamLead"}
          responsive
        >
          <thead>
            <tr>
              <th>Emp Code</th>
              <th>Employee Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {showUserData.teamDetails && showUserData.teamDetails.length > 0 ? (
              showUserData.teamDetails.map((teamMember) => (
                <tr key={teamMember._id}>
                  <td>{teamMember.EmpCode || "N/A"}</td>
                  <td>{teamMember.EmployeeName || "N/A"}</td>
                  <td>{teamMember.Email || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center",color:"indianRed" }}>
                  No Team Member...!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )}
</Col>
</Row>
      </center>

    </div>
          
        </Modal.Body>
      </Modal>

      <Modal
                size="lg"
                show={showTodayData}
                onHide={() => setShowTodayData(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                style={{ backgroundColor: "lightgray", opacity: "98%" }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <h3>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Today Profiles</b>
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Recruiter Details</b>
                        </h5>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <input
                                type="search"
                                placeholder="Search by Name, Email or Code"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{ marginBottom: "20px", width: "100%", maxWidth: "300px", padding: "10px", border: "2px solid gray", borderRadius: "20px" }}
                            />
                        </div>

                        {filteredRecruiters.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <Table striped bordered hover responsive>
                                    <thead style={{ textAlign: 'center' }}>
                                        <tr>
                                            <th>Emp Code</th>
                                            <th>Recruiter Name</th>
                                            <th>Email</th>
                                            <th>Today's Candidates Attached</th>
                                            <th>Total Candidates Attached</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: 'center' }}>
                                        {filteredRecruiters.map(recruiter => (
                                            <tr key={recruiter.recruiterId}>
                                                <td>{recruiter.recruiterCode}</td>
                                                <td>{recruiter.recruiterName}</td>
                                                <td>{recruiter.recruiterEmail}</td>
                                                <td>
                                                    <Link 
                                                        onClick={() => {
                                                            setshowtodayCandidates(true);
                                                            // Store current recruiter data for use in the next modal
                                                            setCurrentRecruiter(recruiter);
                                                        }} 
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        <b>{recruiter.todaysCandidates}</b>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link 
                                                        onClick={() => {
                                                            setshowtotalCandidates(true);
                                                            // Store current recruiter data for use in the next modal
                                                            setCurrentRecruiter(recruiter);
                                                        }} 
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        <b>{recruiter.totalCandidates}</b>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>No recruiter data available.</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="fullscreen"
                show={showtodayCandidates}
                onHide={() => setshowtodayCandidates(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <h5 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Today's Candidates</b>
                        </h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Skills</th>
                                <th>Total YOE</th>
                                 <th>LWD</th>
                                <th>ECTC</th>
                                <th>Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentRecruiter && currentRecruiter.todaysCandidatesData && currentRecruiter.todaysCandidatesData.length > 0 ? (
    currentRecruiter.todaysCandidatesData.map((candidate, index) => (
        <tr key={index}>
            <td>{candidate.firstName}{candidate.lastName}</td>
            <td>{candidate.candidateSkills}</td>
                    <td>{candidate.totalYoe}</td>
                    <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                    <td>{candidate.ectc}</td>
            <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
            <td>
             <Link ><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link>
           </td>
           <td>
          <Link > <Image  style={{backgroundColor:"IndianRed",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/trash.svg'></Image></Link>
           </td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan="2">No candidates uploaded </td>
    </tr>
)}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <Modal
                size="fullscreen"
                show={showtotalCandidates}
                onHide={() => setshowtotalCandidates(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <h5 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Total Candidates</b>
                        </h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Skills</th>
                                <th>Total YOE</th>
                                <th>LWD</th>
                                <th>ECTC</th>
                                <th>Uploaded On</th>
                           
                            </tr>
                        </thead>
                        <tbody>
                        {currentRecruiter && currentRecruiter.totalCandidatesData && currentRecruiter.totalCandidatesData.length > 0 ? (
    currentRecruiter.totalCandidatesData.map((candidate, index) => (
      <tr key={index}>
      <td>{candidate.firstName}{candidate.lastName}</td>
      <td>{candidate.candidateSkills}</td>
              <td>{candidate.totalYoe}</td>
              <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
              <td>{candidate.ectc}</td>
      <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
      <td>
             <Link ><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link>
           </td>
           <td>
          <Link > <Image  style={{backgroundColor:"IndianRed",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/trash.svg'></Image></Link>
           </td>
  </tr>
    ))
) : (
    <tr>
        <td colSpan="2">No candidates uploaded today.</td>
    </tr>
)}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
 </div>
  );
}

export default TLHome;
