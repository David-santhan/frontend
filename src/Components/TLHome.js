import React, { useEffect, useState } from 'react';
import TeamLeadTopNav from './TeamLeadTopNav';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Button, Col, FormControl, Modal, Row, Table } from 'react-bootstrap';
import { Form, Link } from 'react-router-dom';
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
  const [assignedUsersCount,setAssignedUsersCount] = useState('');
  const [selectedReqId,setSelectedReqId]= useState('');
  const [selectedRecruiterId,setSelectedRecruiterId]= useState('');
  const [searchTerm, setSearchTerm] = useState("");       // Store the search input
  const [searchRecruiter, setSearchRecruiter] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]); // Store filtered requirements
  const [totalCount,setTotalCount] = useState(0);
  const [todayCount,setTodayCount] = useState(0);
  const [showtodayCandidates,setshowtodayCandidates]= useState(false);
  const [showtotalCandidates,setshowtotalCandidates] = useState(false);
  const [showCandidateDetailsHome,setShowCandidateDetailsHome]= useState([]);
  const [showRequirmentCount,setShowRequirmentCount]= useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [currentRecruiter,setCurrentRecruiter] = useState([]);
  const [recruiterStats, setRecruiterStats] = useState([]);
  const [assignReqdetails,setAssignReqdetails]=useState([]);
  const [candidates, setCandidates] = useState([]);
  const [requirementsData, setRequirementsData] = useState([]); // State for requirements
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error
  const [candidateDetails,setCandidateDetails] = useState([]);
  const [lagShow, setLagShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState('');
  const [candidateId,setCandidateId]=useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchName, setSearchName] = useState('');
const [searchRole, setSearchRole] = useState('');
const [searchClient, setSearchClient] = useState('');
const [searchStatus, setSearchStatus] = useState('');
const [totalfilteredCandidates, setTotalfilteredCandidates] = useState([]);
const [displayedCandidates, setDisplayedCandidates] = useState([]);


  // Status options array
  const statusSearchOptions = [
    'Ornnova Screen Selected', 'Shared with Client', 'Client Rejected', 'L1 Pending', 
    'L1 Selected', 'L1 Rejected', 'L2 Pending', 'L2 Selected', 'L2 Rejected', 
    'Onboard Confirmation', 'On Boarded', 'Rejected', 'Declined'
  ];
// Show all candidates initially
useEffect(() => {
  setFilteredCandidates(selectedCandidates); // Set default to all candidates
}, [selectedCandidates]);

useEffect(() => {
  setTotalfilteredCandidates(selectedCandidates); // Set default to all candidates
}, [selectedCandidates]);
  // Initially show all candidates
  useEffect(() => {
    if (selectedRequirement && selectedRequirement.totalCandidatesDetails) {
      setDisplayedCandidates(selectedRequirement.totalCandidatesDetails); // Show all candidates initially
    }
  }, [selectedRequirement]);

const handleSearch = () => {
  const filtered = selectedCandidates.filter(candidate => {
    // Create match variables for each criterion
    const matchesName = name
      ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(name.toLowerCase())
      : true; // If name is empty, consider it a match (doesn't filter out)

    const matchesRole = role
      ? candidate.role.toLowerCase().includes(role.toLowerCase())
      : true; // If role is empty, consider it a match

    const matchesClient = client
      ? candidate.client?.toLowerCase().includes(client.toLowerCase())
      : true; // If client is empty, consider it a match

    const matchesStatus = status
      ? candidate.Status && candidate.Status.length > 0 &&
        candidate.Status[candidate.Status.length - 1].Status === status
      : true; // If status is empty, consider it a match

    // Return true only if the corresponding input is filled and it matches the candidate
    return (name ? matchesName : true) &&
           (role ? matchesRole : true) &&
           (client ? matchesClient : true) &&
           (status ? matchesStatus : true);
  });

  // Update the filtered candidates state
  setFilteredCandidates(filtered); 
  console.log("Filtered Candidates:", filtered); // Log the filtered results
};
const handleTotalSearch = () => {
  const filtered = selectedRequirement.totalCandidatesDetails.filter(candidate => {
    const matchesName = searchName
      ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchName.toLowerCase())
      : true;
    const matchesRole = searchRole
      ? candidate.role.toLowerCase().includes(searchRole.toLowerCase())
      : true;
    const matchesClient = searchClient
      ? candidate.client?.toLowerCase().includes(searchClient.toLowerCase())
      : true;
    const matchesStatus = searchStatus
      ? candidate.Status && candidate.Status.length > 0 &&
        candidate.Status[candidate.Status.length - 1].Status === searchStatus
      : true;

    return matchesName && matchesRole && matchesClient && matchesStatus;
  });

  setDisplayedCandidates(filtered); // Update the displayed candidates with the filtered list
};
    // Filtered data based on search query
    const filteredData = showCandidateDetailsHome.filter(req => {
      const { regId, client, role } = req.requirementDetails;
      return (
          regId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.toLowerCase().includes(searchQuery.toLowerCase())
      );
  });

  const handleShowCandidates = (candidates) => {
    setSelectedCandidates(candidates);
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => setShowModal(false);

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
      let response = await axios.get(`http://localhost:7993/TlHome/${userId}`);
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
        let JSONData = await fetch(`http://localhost:7993/getUserData/${id}`, reqOption);
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
    let JSONData = await fetch(`http://localhost:7993/getTeamrequirements/${userId}`, reqOption);
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

  // Filter requirements based on client name, handle undefined or null client values
  const filteredData = requirements.filter((item) =>
    (item.client || '').toLowerCase().includes(term.toLowerCase()) // Convert undefined to empty string before filtering
  );

  setFilteredRequirements(filteredData);  // Update filtered requirements
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
      let JSONData = await fetch(`http://localhost:7993/getrequirements/${id}`, reqOption);
      let JSOData = await JSONData.json();
      
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
    const response = await fetch(`http://localhost:7993/userDetailsofAssignedRequirement/${id}/${userId}`, reqOption);
    let data = await response.json();
    setAssignedUsersData(data);
    console.log(data)    
};
  const userDetailstoAssignClient = async (id) => {
    let reqOption = {
        method: "GET"
    };
    const response = await fetch(`http://localhost:7993/userDetailstoAssignRequirement/${id}/${userId}`, reqOption);
    let data = await response.json();
    console.log(data)
    setUserData(data.teamMembers);
    if (Array.isArray(data.requirementDetails)) {
      setAssignReqdetails(data.requirementDetails); // Set if it's an array
    } else if (data.requirementDetails && typeof data.requirementDetails === "object") {
      setAssignReqdetails([data.requirementDetails]); // Convert object to array
    } else {
      setAssignReqdetails([]); // Handle cases where it's not valid data
    }  
     setSelectedReqId(id);
    userDetailsofAssignedClient(id);
    setShowAssign(true)

    
};

const assignReqToUser = async (userId) => {
  const ReqId = selectedReqId; // Ensure you have a way to store the selected client ID

  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm(`Are you sure you want to assign this Requirement ?`);

  // If the user confirms, proceed with the assignment
  if (isConfirmed) {
      try {
          const response = await axios.post(`http://localhost:7993/assignReq/${userId}/${ReqId}`, 
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const result = response.data;

          if (result.status === 'success') {
              alert('Requirement assigned successfully ✅');
              setShowAssign(false)
              window.location.reload();
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
      alert('Requirement assignment was canceled ❌');
  }
};

const Reqcounts = async () => {
  let reqOption = {
    method: "GET"
  };

  try {
    const response = await fetch(`http://localhost:7993/getTeamRequirementsCount/${userId}`, reqOption);
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

const RequirmentCandidates = async (id)=>{
  let reqOption = {
    method:"GET"
  }
  let response = await fetch(`http://localhost:7993/getRequirementsCandidatesCount/${id}`,reqOption)
  // let data = response.json();
  // console.log('Response data:', data);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  // Parsing the JSON response
  const data = await response.json();
  
  if (data.status === "Success" && data.requirements) {
    setRequirementsData(data.requirements); // Store requirements in state
    setShowRequirmentCount(true);
    setSelectedRecruiterId(id);
  } else {
    throw new Error(data.msg || "Unexpected data format");
  }
}
const fetchCandidates = async (id) => {
  setLoading(true); // Show loading indicator
  setError(""); // Reset error state

  try {
    const response = await fetch(`http://localhost:7993/viewactions/${id}/${selectedRecruiterId}`);
    const data = await response.json();
   

    if (response.ok) {
      if (data.candidates) {
        setCandidates(data.candidates);
        setshowtotalCandidates(true)
      } else {
        setError(data.message);
      }
    } else {
      setError(data.error || "Failed to fetch candidates");
    }
  } catch (error) {
    setError("An error occurred while fetching data");
  } finally {
    setLoading(false); // Hide loading indicator
  }
};

const CandidateData = async(id)=>{
  try {
      const response = await axios.get(`http://localhost:7993/candidate/${id}`);
     
      // console.log(response.data)
          setCandidateDetails(response.data); 
           setCandidateId(id);
      setLagShow(true)
  } catch (error) {
      console.error('Error fetching candidates:', error);
  } 
}

const requirementDetailsWithAssignedUsers = async () => {
  let reqOption = {
      method: "GET"
  };
  const response = await fetch(`http://localhost:7993/requirementDetailsWithAssignedUsers/${userId}`, reqOption);
  let data = await response.json();
  setShowCandidateDetailsHome(data);
  // console.log(data)    
};

useEffect(()=>{
  requirementDetailsWithAssignedUsers();
})
  // Open the modal and set the selected requirement
  const handleShowTotalCandidates = (requirement) => {  // renamed from handleShowModal
    setSelectedRequirement(requirement);
    setShowTotalModal(true); // renamed from setShowModal
  };

  // Close the modal
  const handleCloseTotalCandidates = () => { // renamed from handleCloseModal
    setShowTotalModal(false); // renamed from setShowModal
    setSelectedRequirement(null);
  };


// // Updated options based on your logic
// const options = [
//   { label: 'Select', value: '' },
//   { label: 'Ornnova Screen Selected', value: 'Ornnova Screen Selected' },
//   { label: 'Shared with Client', value: 'Shared with Client',parent: 'Ornnova Screen Selected' },
//   { label: 'Selected', value: 'Selected', parent: 'Ornnova Screen Selected' },
//   { label: 'Rejected', value: 'Rejected', parent: 'Ornnova Screen Selected' },
//   { label: 'Selected', value: 'Selected', parent: 'Shared with Client' },
//   { label: 'Rejected', value: 'Rejected', parent: 'Shared with Client' },
//   { label: 'L1 Pending', value: 'L1 Pending', parent: 'Selected' },
//   { label: 'L1 Selected', value: 'L1 Selected', parent: 'L1 Pending' },
//   { label: 'L1 Rejected', value: 'L1 Rejected', parent: 'L1 Pending' },
//   { label: 'L2 Pending', value: 'L2 Pending', parent: 'L1 Selected' },
//   { label: 'L2 Selected', value: 'L2 Selected', parent: 'L2 Pending' },
//   { label: 'L2 Rejected', value: 'L2 Rejected', parent: 'L2 Pending' },
//   { label: 'Onboard Confirmation', value: 'Onboard Confirmation', parent: 'L2 Selected' },
//   { label: 'Onboarded', value: 'Onboarded', parent: 'Onboard Confirmation' },
//   { label: 'Rejected/Declined', value: 'Rejected/Declined', parent: 'Onboard Confirmation' },
// ];

// // Function to filter options based on the selected value
// const getFilteredOptions = () => {
//   if (!selectedValue) {
//       // Show the top-level options (first level)
//       return options.filter(option => !option.parent);
//   }

//   // Find the parent option for the selected value
//   const parentOption = options.find(opt => opt.value === selectedValue);

//   // If a valid parent is found, show options dependent on the selected value
//   return options.filter(option => option.parent === selectedValue || option.value === selectedValue);
// };

const statusOptions = {
  "Ornnova Screen Selected": ["Shared with Client", "Client Rejected"],
  "Shared with Client": ["L1 Pending", "L1 Selected", "L1 Rejected"],
  "Client Rejected": [],
  "L1 Pending": ["L1 Selected", "L1 Rejected"],
  "L1 Selected": ["L2 Pending", "L2 Selected", "L2 Rejected"],
  "L1 Rejected": [],
  "L2 Pending": ["L2 Selected", "L2 Rejected"],
  "L2 Selected": ["Onboard Confirmation"],
  "L2 Rejected": [],
  "Onboard Confirmation": ["Onboarded", "Rejected","Declined"],
};

const handleStatusChange = (e) => {
  const selectedStatus = e.target.value;
  setSelectedStatus(selectedStatus); // Store the selected status
};

// Make sure candidateId is properly passed and used
const postStatus = async (id) => {
  if (!selectedStatus) {
      console.error("No status selected");
      return;
  }

  try {
      const response = await fetch(`http://localhost:7993/updatestatus/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: selectedStatus }), // Pass selected status in request body
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Status Updated Successfully ✅ ")
      setLagShow(false)
      handleCloseTotalCandidates();
      handleCloseModal();
      console.log('Updated Main Document:', data);
  } catch (error) {
      console.error('Error updating status:', error.message);
  }
};

  return (
 <div>
  <TeamLeadTopNav/>
<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
<CardGroup>
  <Link  style={{ textDecoration: "none", color: "black" }} to="/TLNewReq">
    <Card style={{ margin: "20px", width: "270px",borderRadius:"70px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Create Requirement</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer style={{borderBottomLeftRadius:"70px",borderBottomRightRadius:"70px"}}>
        <Button  variant="success">
          <img  src="./Images/createReq.svg" alt="Create Requirement" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link onClick={() => assignRequirements()}  style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "270px",borderRadius:"70px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Assign Requirement</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer style={{borderBottomLeftRadius:"70px",borderBottomRightRadius:"70px"}}>
        <Button variant="secondary">
          <img src="./Images/assign.svg" alt="Assign Requirement" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>

  <Link onClick={() => Reqcounts() } style={{ textDecoration: "none", color: "black" }}>
    <Card style={{ margin: "20px", width: "270px",borderRadius:"70px" }} className="text-center">
      <Card.Body>
        <Card.Title style={{ fontFamily: "initial" }}>
          <b>Profiles</b>
        </Card.Title>
      </Card.Body>
      <Card.Footer style={{borderBottomLeftRadius:"70px",borderBottomRightRadius:"70px"}} >
        <Button variant="primary">
          <img src="./Images/profile.svg" alt="Profiles" />
        </Button>
      </Card.Footer>
    </Card>
  </Link>
</CardGroup>
</div> <hr></hr>

<h3 style={{textAlign:"center"}}>
          <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png'alt="icon"/>
          <b style={{ fontFamily: "monospace" }}>Requirements</b>    
        </h3>
        <input type="search"placeholder="🔍 Search by ID, Client, or Role"value={searchQuery}onChange={(e) => setSearchQuery(e.target.value)} style={{ marginBottom: "20px", padding: "8px", width: "300px",borderRadius:"15px" }} // optional styling
        />
            {/* Your Table */}
            <Table style={{ textAlign: "center" }} striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Requirement ID</th>
                        <th>Client</th>
                        <th>Role</th>
                        <th>Type Of Contract</th>
                        <th>Requirement Type</th>
                        <th>Start Date</th>
                        <th>Uploaded On</th> 
                        <th>Assigned Team Members</th>
                        <th>Today Profiles</th>
                        <th>Total Profiles</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((req, index) => (
                        <tr key={index}>
                            <td>
                                <Link
                                    style={{ textDecoration: "none" }}
                                    onClick={() => {
                                        viewRequirement(req.requirementDetails._id);
                                    }}
                                >
                                    <b>{req.requirementDetails.regId}</b>
                                </Link>
                            </td>
                            <td>{req.requirementDetails.client}</td>
                            <td>{req.requirementDetails.role}</td>
                            <td>{req.requirementDetails.typeOfContract}</td>
                            <td>{req.requirementDetails.requirementtype}</td>
                            <td>{new Date(req.requirementDetails.startDate).toLocaleDateString()}</td>
                            <td>{new Date(req.requirementDetails.uploadedDate).toLocaleDateString()}</td>
                         
                            <td>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>
                                        {req.assignedUsernames.length > 0 ? (
                                            req.assignedUsernames.join(", ")
                                        ) : (
                                            <strong>No users assigned</strong>
                                        )}
                                    </span>
                                    <div style={{ width: "20%", height: "20%", color: "white" }}>
                                        <Button
                                            style={{
                                                backgroundColor: req.userCount === 0 ? "indianred" : "lightslategray",
                                                borderRadius: "20px",
                                                textAlign: "center",
                                                border: "1px solid black"
                                            }}
                                            onClick={() => userDetailstoAssignClient(req.requirementDetails._id)}
                                        >
                                            <b>{req.userCount}</b>
                                        </Button>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {req.todayCandidateCount > 0 ? (
                                    <div
                                        style={{ cursor: "pointer", color: "blue" }}
                                        onClick={() => handleShowCandidates(req.todayCandidates)} // Open modal on click
                                    >
                                        <b>{req.todayCandidateCount}</b>
                                    </div>
                                ) : (
                                    <strong>0</strong>
                                )}
                            </td>
                            <td>
                                {req.totalCandidateCount > 0 ? (
                                    <div
                                        style={{ cursor: "pointer", color: "blue" }}
                                        onClick={() => handleShowTotalCandidates(req)} // Open modal on click
                                    >
                                        <b>{req.totalCandidateCount}</b>
                                    </div>
                                ) : (
                                    <strong>0</strong>
                                )}
                            </td>
                            <td>
                                        <Link to={`/UserAction/${req.requirementDetails._id}/${userId}`}>
                                            <Button style={{ border: '1px solid gray',backgroundColor: "MediumSeaGreen",borderRadius: '20px',}}>
                                                <b>Upload</b>
                                            </Button>
                                        </Link>
                                    </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

      {/* Modal for showing today's candidate details */}
      <Modal size='fullscreen' show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title> <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Today Candidates</b>
        </h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
      {/* Name input */}
      <FormControl
        type="search"
        placeholder="Search by Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}
      />

      {/* Role input */}
      <FormControl
        type="search"
        placeholder= "Search by Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}
      />

    

      {/* Status dropdown */}
      <FormControl as="select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}>
        <option value="">All</option>
        {statusSearchOptions.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </FormControl>

      {/* Search Button */}
     <center>
     <Button variant="primary" onClick={handleSearch} style={{ marginBottom: '20px' }}>
        Search
      </Button>
     </center> <hr></hr>

      {/* Table displaying filtered candidates */}
      {filteredCandidates.length > 0 ? (
        <Table style={{ textAlign: "center" }} striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Total YOE</th>
            <th>LWD</th>
            <th>ECTC</th>
            <th>Status</th>
            <th>Uploaded Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((candidate, idx) => {
            const recentStatus = candidate.Status && candidate.Status.length > 0
              ? candidate.Status[candidate.Status.length - 1].Status
              : "No Status";
  
            let textColor;
            if (recentStatus === "No Status") {
              textColor = "blue";
            } else if (["Client Rejected", "L1 Rejected", "L2 Rejected", "Rejected","Declined"].includes(recentStatus)) {
              textColor = "red";
            } else if (["Shared with Client", "L1 Pending", "L2 Pending"].includes(recentStatus)) {
              textColor = "orange";
            } else {
              textColor = "green";
            }
  
            return (
              <tr key={idx}>
                <td>{candidate.firstName} {candidate.lastName}</td>
                <td>{candidate.role}</td>
                <td>{candidate.totalYoe}</td>
                <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                <td>{candidate.ectc}</td>
                <td style={{ color: textColor }}>
                  <b>{recentStatus}</b>
                </td>
                <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
                <td>
                  <Link onClick={() => CandidateData(candidate._id)}>
                    <Image
                      style={{
                        backgroundColor: "lightblue",
                        margin: "5px",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                      src='./Images/view.svg'
                      alt="View"
                    />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      ) : (
        <p>No candidates found matching the search criteria.</p>
      )}
    </Modal.Body>

        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
{/* Modal for displaying total candidate details */}
<Modal size='fullscreen' show={showTotalModal} onHide={handleCloseTotalCandidates}>
        <Modal.Header closeButton>
          <Modal.Title><h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Total Candidates</b>
        </h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
      {selectedRequirement ? (
        <div>
          <h5>Client: <strong>{selectedRequirement.requirementDetails?.client || 'N/A'}</strong></h5>
          <p>Total Candidates: <strong>{selectedRequirement.totalCandidateCount || 0}</strong></p>

          {/* Search Inputs */}
          <FormControl
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}
          />
          <FormControl
            type="text"
            placeholder="Search by Role"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}
          />
          {/* <FormControl
            type="text"
            placeholder="Search by Client"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            style={{ marginBottom: '10px' }}
          /> */}
          <FormControl
            as="select"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            style={{ marginBottom: '10px',width:"300px",border:"1px solid black",borderRadius:"15px" }}
          >
            <option value="">All</option>
        {statusSearchOptions.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
          </FormControl>

          {/* Search Button */}
<center>          <Button onClick={handleTotalSearch}>Search</Button>
</center> <hr></hr>
          {/* Display Candidate Details in Table */}
          {displayedCandidates && displayedCandidates.length > 0 ? (
            <Table style={{ textAlign: "center", marginTop: "20px" }} striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Total YOE</th>
                  <th>LWD</th>
                  <th>ECTC</th>
                  <th>Status</th>
                  <th>Uploaded Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedCandidates.map((candidate, idx) => {
                  const recentStatus = candidate.Status && candidate.Status.length
                    ? candidate.Status[candidate.Status.length - 1].Status
                    : "No status available";

                  let textColor;
                  if (recentStatus === "No status available") {
                    textColor = "blue";
                  } else if (["Client Rejected", "L1 Rejected", "L2 Rejected", "Rejected", "Declined"].includes(recentStatus)) {
                    textColor = "red";
                  } else if (["Shared with Client", "L1 Pending", "L2 Pending"].includes(recentStatus)) {
                    textColor = "orange";
                  } else {
                    textColor = "green";
                  }

                  return (
                    <tr key={idx}>
                      <td>{candidate.firstName} {candidate.lastName}</td>
                      <td>{candidate.role}</td>
                      <td>{candidate.totalYoe}</td>
                      <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                      <td>{candidate.ectc}</td>
                      <td style={{ color: textColor }}><b>{recentStatus}</b></td>
                      <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
                      <td>
                  <Link onClick={() => CandidateData(candidate._id)}>
                    <Image
                      style={{
                        backgroundColor: "lightblue",
                        margin: "5px",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                      src='./Images/view.svg'
                      alt="View"
                    />
                  </Link>
                </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>No candidates available.</p>
          )}
        </div>
      ) : (
        <p>Loading candidate details...</p>
      )}
    </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleCloseTotalCandidates}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>

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
          <Table style={{textAlign:"center"}} responsive >
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
                  <td>{team.Email}</td> 
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
    <Modal  style={{backgroundColor:"lightgray",opacity:"98%"}}
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
              src={`http://localhost:7993/${showUserData.userDetails.ProfilePic}`}
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
        {/* <center>
          <h5>
            <img
              style={{ width: "30px", margin: "10px" }}
              src="/Images/icon.png"
              alt="icon"
            ></img>
            <b style={{ fontFamily: "monospace" }}>Team Details</b>
          </h5>
        </center> */}
        {/* <Table
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
        </Table> */}
      </Modal.Body>
    </Modal>
  )}
</Col>
</Row>
      </center>

    </div>
        </Modal.Body>
      </Modal>

      <Modal size="fullscreen"show={showfl}onHide={() => setShowfl(false)}aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h3> <img style={{ width: "30px", margin: "10px" }}src='/Images/icon.png'alt="icon"/> <b style={{ fontFamily: "monospace" }}>Assign Requirements</b></h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         {/* Search input */}
      {/* <input type="search"placeholder="🔍 Search by Client Name"value={searchTerm}onChange={handleSearchChange}style={{ marginBottom: "20px", width: "300px",padding:"10px",border:"2px solid gray",borderRadius:"20px" }}/> */}
      {/* Render table only if showfl is true */}
      {showfl && (
        <Table style={{textAlign:"center"}} responsive>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Reg Id</th>
              <th>Client</th>
              <th>Requirement Type</th>
              <th>Start Date</th>
              <th>Type Of Contract</th>
              <th>Assigns</th>
              <th>Action</th>            
            </tr>
          </thead>
          <tbody >
            {filteredRequirements.length > 0 ? (
              filteredRequirements.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link onClick={() => { viewRequirement(item.requirement._id) }} style={{ textDecoration: "none" }}>
                      <b>{item.requirement.regId}</b>
                    </Link>
                  </td>
                  <td>{item.requirement.client}</td>
                  <td>{item.requirement.requirementtype}</td>
                  <td>{new Date(item.requirement.startDate).toLocaleDateString()}</td>
                  <td>{item.requirement.typeOfContract}</td>
                  <td><b style={{backgroundColor: ` ${item.assignedCount === item.totalTeamCount ? "MediumSeaGreen" : "orange"}`,color:`${item.assignedCount === item.totalTeamCount ? "white" : "black"}`,borderRadius: "30px",padding: "5px",border: `1px solid black`,}}>{item.assignedCount}/{item.totalTeamCount}</b></td>
                  <td>
                    <Button
                      onClick={() => userDetailstoAssignClient(item.requirement._id)}
                      style={{padding: "5px",borderRadius: "8px",backgroundColor: "lightseagreen",color: "white",border: "1.5px solid black"}}>
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
  {/* <Link onClick={()=> setShowRequirmentCount(true)} style={{ textDecoration: "none", color: "black" }} > */}
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
  <Table  striped bordered hover responsive>
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
            <th>Years of Experience</th>
            <td>{item.yearsExperience}</td>
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
            <th>Role</th>
            <td>{item.role}</td>
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
                <Table responsive bordered >
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
      style={{backgroundColor:"lightgray",opacity:"98%"}}
        size="lg"
        show={showAssign}
        onHide={() => setShowAssign(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          {Array.isArray(assignReqdetails) && assignReqdetails.length > 0 ? (
  assignReqdetails.map((item, index) => (
    <h3 key={index}>
      <img
        style={{ width: "30px", margin: "10px" }}
        src='/Images/icon.png'
        alt="icon"
      />
      <b style={{ fontFamily: "monospace" }}> 
        Assign {item.client || 'No client'} 
      </b>
    </h3>
  ))
) : (
  <p>No data available</p>
)}


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
            {/* <th>Email</th> */}
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
              <td><b style={{fontFamily:"monospace"}}>{team.EmployeeName}</b></td>
              {/* <td>{team.Email}</td>  */}
              {/* Replace with actual fields */}
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
      <Table  responsive style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Employee Name</th>
            {/* <th>Email</th> */}
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
              <td><b style={{fontFamily:"monospace"}}>{team.EmployeeName}</b></td>
              {/* <td>{team.Email}</td> */}
               {/* Replace with actual fields */}
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
              src={`http://localhost:7993/${showUserData.userDetails.ProfilePic}`}
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
        style={{textAlign:"center"}}
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
                            <b style={{ fontFamily: "monospace" }}>Profiles</b>
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
                                <Table style={{textAlign:"center"}} striped bordered hover responsive>
                                    <thead style={{ textAlign: 'center' }}>
                                        <tr>
                                            <th>Emp Code</th>
                                            <th>Recruiter Name</th>
                                            {/* <th>Email</th> */}
                                            <th>Today's Candidates Attached</th>
                                            <th>Total Candidates Attached</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: 'center' }}>
                                        {filteredRecruiters.map(recruiter => (
                                            <tr key={recruiter.recruiterId}>
                                                <td>{recruiter.recruiterCode}</td>
                                                <td>{recruiter.recruiterName}</td>
                                                {/* <td>{recruiter.recruiterEmail}</td> */}
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
                                                          RequirmentCandidates(recruiter.recruiterId);
                                                            // setshowtotalCandidates(true);
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
                    <Table style={{textAlign:"center"}} striped bordered hover responsive>
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
            <td> <Link onClick={()=> CandidateData(candidate._id)}><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link> </td>

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
      onShow={fetchCandidates}  // Fetch candidates when modal is shown
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          <h5 style={{ textAlign: "center" }}>
            <img
              style={{ width: "30px", margin: "10px" }}
              src="/Images/icon.png"
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Total Candidates</b>
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        {candidates.length > 0 ? (
          <Table style={{textAlign:"center"}} striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Total YOE</th>
                <th>LWD</th>
                <th>ECTC</th>
                <th>Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index}>
                  <td>{candidate.firstName}{candidate.lastName}</td>
                  <td>{candidate.candidateSkills}</td>
                  <td>{candidate.totalYoe}</td>
                  <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                  <td>{candidate.ectc}</td>
                  <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
                  <td> <Link onClick={()=> CandidateData(candidate._id)}><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link> </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : !loading && <p>No candidates found.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setshowtotalCandidates(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

            <Modal
            style={{backgroundColor:"lightgray",opacity:'98%'}}
        size="lg"
        show={showRequirmentCount}
        onHide={() => setShowRequirmentCount(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          <h5 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Total Active Profiles</b>
                        </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h5 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Requirements List</b>
                        </h5>
      {requirementsData.length === 0 ? (
        <p>No requirements found.</p>
      ) : (
        <Table style={{textAlign:"center"}} striped bordered hover responsive>
          <thead>
            <tr>
              <th>Requirement ID</th>
              <th>Client</th>
              <th>Requirement Type</th>
              <th>Start Date</th>
              <th>Type Of Contract</th>
              <th>Candidate Count</th>
            </tr>
          </thead>
          <tbody>
            {requirementsData.map((req) => (
              <tr key={req._id} style={{textAlign:"center"}}>
                <td>{req.regId}</td>
                <td>{req.client || 'No Title Available'}</td>
                <td>{req.requirementtype || 'No Description Available'}</td>
                <td>{new Date(req.startDate).toLocaleDateString()}</td>
                <td>{req.typeOfContract}</td>
                <td><Link onClick={()=> fetchCandidates(req._id)} style={{textDecoration:"none"}}><b>{req.candidateCount || 0}</b></Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
        </Modal.Body>
      </Modal>
      <Modal style={{backgroundColor:"lightgray"}} size="fullscreen" show={lagShow} onHide={() => setLagShow(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
            <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidate Details </b></h5> {/* Displaying single requirement detail */}
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    { candidateDetails && (
    <div className="table-responsive">
    <Table striped bordered hover className="table-sm">
        <tbody>
        <tr>
            <td>
              <Image
                src={`http://localhost:7993/${candidateDetails.candidateImage}`}
                style={{ width: "100px", borderRadius: "100px" }}
                alt="Candidate Image"
              ></Image>
            </td>
            <td>
  <center>
    <strong>Update Status</strong>

    {/* Get the most recent status */}
    {candidateDetails.Status && candidateDetails.Status.length > 0 ? (
      <select
        style={{
          padding: "10px",
          borderRadius: "15px",
          margin: "10px",
        }}
        value={selectedStatus || candidateDetails.Status[candidateDetails.Status.length - 1].Status}
        onChange={handleStatusChange}
      >
        <option value="">Select Status</option>
        {statusOptions[candidateDetails.Status[candidateDetails.Status.length - 1].Status]?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option> 
        ))} 
      </select>
    ) : (
      <select
        style={{
          padding: "10px",
          borderRadius: "15px",
          margin: "10px",
        }}
        value={selectedStatus || ""}
        onChange={handleStatusChange}>
        <option value="">Select Status</option>
        {Object.keys(statusOptions).map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    )}

    <Button
      style={{
        padding: "5px",
        borderRadius: "15px",
        margin: "10px",
        backgroundColor: "lightseagreen",
        border: "1px solid black",
      }}
      onClick={() => postStatus(candidateId, selectedStatus)} // Pass candidateId and selectedStatus to postStatus
      >
      <b>Update Status</b>
    </Button>
  </center>
  <hr />

  {/* Display the status history */}
  {candidateDetails.Status && Array.isArray(candidateDetails.Status) && candidateDetails.Status.length > 0 ? (
    candidateDetails.Status.map((item, index) => (
      <React.Fragment key={index}>
        <tr>
          <td>
            <b>Status :</b>
          </td>
          <td style={{ fontFamily: "monospace" }}>
            {item.Status}
          </td>
        </tr>
        <tr>
          <td>
            <b>Updated Date :</b>
          </td>
          <td>{new Date(item.Date).toLocaleDateString()}</td>
        </tr>
        <hr />
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan={2}>No status updates available.</td>
    </tr>
  )}
</td>
          </tr>

            <tr>
                <td><b>Candidate Name</b></td>
                <td>{candidateDetails.firstName} {candidateDetails.lastName}</td>
            </tr>
            <tr>
                <td><b>Email:</b></td>
                <td>{candidateDetails.email}</td>
            </tr>
            <tr>
                <td><b>Dob:</b></td>
                <td>{new Date(candidateDetails.dob).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td><b>Mobile Number:</b></td>
                <td>{candidateDetails.mobileNumber}</td>
            </tr>
            {/* <tr>
                <td><b>Client</b></td>
                <td>{candidateDetails.client}</td>
            </tr> */}
            <tr>
                <td><b>Skills:</b></td>
                <td>{candidateDetails.candidateSkills}</td>
            </tr>
            <tr>
                <td><b>Ctc:</b></td>
                <td>{candidateDetails.ctc}</td>
            </tr>
            <tr>
                <td><b>Ectc:</b></td>
                <td>{candidateDetails.ectc}</td>
            </tr>
            <tr>
                <td><b>Educational Qualification:</b></td>
                <td>{candidateDetails.educationalQualification}</td>
            </tr>
            <tr>
                <td><b>Total YOE:</b></td>
                <td>{candidateDetails.totalYoe}</td>
            </tr>
            <tr>
                <td><b>Relevant YOE:</b></td>
                <td>{candidateDetails.relevantYoe}</td>
            </tr>
            <tr>
              <td><strong>Current Location:</strong></td>
              <td>{candidateDetails.currentLocation}</td>
           </tr>
            <tr>
                <td><b>Preferred Location:</b></td>
                <td>{candidateDetails.prefLocation}</td>
            </tr>
            <tr>
                <td><b>Current Org:</b></td>
                <td>{candidateDetails.currentOrg}</td>
            </tr>
            <tr>
                <td><b>Role:</b></td>
                <td>{candidateDetails.role}</td>
            </tr>
            <tr>
                <td><b>Resignation Served:</b></td>
                <td>{candidateDetails.resignationServed}</td>
            </tr>
            <tr>
                <td><b>LWD:</b></td>
                <td>{new Date(candidateDetails.lwd).toLocaleDateString()}</td>
            </tr>
            {/* <tr>
                <td><b>Status:</b></td>
                <td>{candidateDetails.Status}</td>
            </tr> */}
            <tr>
                <td><b>Offer In Hand:</b></td>
                <td>{candidateDetails.offerInHand}</td>
            </tr>
            <tr>
                <td><b>Interview Date:</b></td>
                <td>{new Date(candidateDetails.interviewDate).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td><b>Details:</b></td>
                <td>{candidateDetails.details}</td>
            </tr>
            <tr>
                <td><b>Feedback:</b></td>
                <td>{candidateDetails.feedback}</td>
            </tr>
            <tr>
                <td><b>Remark:</b></td>
                <td>{candidateDetails.remark}</td>
            </tr>
            {/* <tr>
                <td><b>Shared With Client:</b></td>
                <td>{candidateDetails.sharedWithClient}</td>
            </tr> */}
            <tr>
      <td><strong>Candidate Resume:</strong></td>
    <td>
  {typeof candidateDetails.updatedResume === 'string' ? (
    <div style={{ marginBottom: '5px' }}>
      <a href={`http://localhost:7993/${candidateDetails.updatedResume}`} target="_blank" rel="noopener noreferrer">
        View Resume
      </a>
    </div>
  ) 
  : (
    'No PDFs available.'
  )}
</td>
    </tr>
    <tr>
      <td><strong>Ornnova Profile:</strong></td>
    <td>
  {typeof candidateDetails.ornnovaProfile === 'string' ? (
    <div style={{ marginBottom: '5px' }}>
      <a href={`http://localhost:7993/${candidateDetails.ornnovaProfile}`} target="_blank" rel="noopener noreferrer">
        View Ornnova Profile
      </a>
    </div>
  ):(
    'No PDFs available.'
  )}
</td>
    </tr>
            <tr>
            <td colSpan="2"><center><label> <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Assessment</b></h5></label></center></td>

            </tr>
            {
                candidateDetails.assessments && Array.isArray(candidateDetails.assessments) && candidateDetails.assessments.length > 0 ? (
                    candidateDetails.assessments.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td><b>Assessment:</b></td>
                                <td>{item.assessment}</td>
                            </tr>
                            <tr>
                                <td><b>YOE:</b></td>
                                <td>{item.yoe}</td>
                            </tr>
                            <tr>
                                <td><b>Score:</b></td>
                                <td>{item.score}</td>
                            </tr> <hr></hr>
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2}>No assessments available.</td>
                    </tr>
                )
            }
        </tbody>
    </Table>
    </div>
)}
    </Modal.Body>
               </Modal>
 </div>
  );
}

export default TLHome;
