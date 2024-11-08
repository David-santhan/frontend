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
  const [showUserModal,setShowUserModal] = useState(false);
  const [showTeamModal,setShowTeamModal] = useState(false);
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
const [savedStatus,setSavedStatus] = useState('');
const [totalfilteredCandidates, setTotalfilteredCandidates] = useState([]);
const [displayedCandidates, setDisplayedCandidates] = useState([]);
const [updateshow, setUpdateshow] = useState(false);
const [newRequirements, setNewRequirements] = useState([]);


const [updateCandidateDetails, setUpdateCandidateDetails] = useState({
  candidateImage: '',
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  dob: '',
  ctc: '',
  ectc: '',
  totalYoe: '',
  relevantYoe: '',
  lwd: '',
  currentLocation: '',
  prefLocation: '',
  resignationServed: '',
  currentOrg: '',
  candidateSkills: '',
  role: '',
  internalScreening: '',
  sharedWithClient: '',
  feedback: '',
  details: '',
  interviewDate: '',
  educationalQualification: '',
  offerInHand: '',
  remark: '',
  updatedResume: '',
  ornnovaProfile: '',
  assessments: [],
});
const [updateCandidateName,setUpdateCandidateName]= useState("");
function handleUpdateShow() {
    
  setUpdateshow(true);
}
function handleUpdateClose () {setUpdateshow(false);}

// Function to delete a candidate
const deleteCandidate = async (candidateId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this candidate?");
  if (!isConfirmed) {
    return; // Exit the function if the user cancels
  }

  try {
    const response = await axios.delete(`https://ornnovabackend.onrender.com/api/candidates/${candidateId}`);
    if (response.status === 200) {
      // Update the local state to remove the deleted candidate from the list
      setCandidates(candidates.filter(candidate => candidate._id !== candidateId));
      alert(response.data.message); // Optional: Show success message
    }
  } catch (error) {
    console.error("Error deleting candidate:", error);
    alert('Failed to delete candidate');
  }
};

const updateCandidate = async(id)=>{
  try {
    const response = await axios.get(`https://ornnovabackend.onrender.com/candidate/${id}`)
    console.log(response.data)
    setUpdateCandidateDetails(response.data);
    handleUpdateShow();
  } catch (error) {
    console.log(error)
  }
}

const handleInputChange = (field, value) => {
  setUpdateCandidateDetails(prevDetails => ({
    ...prevDetails,
    [field]: value,
  }));
};

const handleAssessmentChange = (index, field, value) => {
  const updatedAssessments = [...updateCandidateDetails.assessments];
  updatedAssessments[index] = {
    ...updatedAssessments[index],
    [field]: value,
  };
  setUpdateCandidateDetails(prevDetails => ({
    ...prevDetails,
    assessments: updatedAssessments,
  }));
};

// Function that saves changes, with conditional logic for "Upload"
const handleSaveChanges = async (status) => {
const candidateId = updateCandidateDetails._id;

try {
  // Prepare updated details based on whether it's a save or upload action
  const updatedDetails = {
    ...updateCandidateDetails,
    ...(status === "Uploaded" ? { savedStatus: "Uploaded", uploadedDate: new Date().toISOString() } : {})
  };

  const response = await axios.put(`https://ornnovabackend.onrender.com/candidates/${candidateId}`, updatedDetails);

  if (response.status === 200) {
    alert('Candidate details updated successfully ✅');
    setUpdateshow(false); // Close the modal after successful update
    window.location.reload();
  } else {
    alert('Failed to update candidate details.');
  }
} catch (error) {
  console.error('Error updating candidate:', error);
  alert('An error occurred while updating candidate details.');
}
};

// Separate functions for Save and Upload buttons
const saveChanges = () => handleSaveChanges("Saved");
const uploadChanges = () => handleSaveChanges("Uploaded");


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

  // Show all candidates initially
  useEffect(() => {
    setDisplayedCandidates(selectedCandidates);
  }, [selectedCandidates]);

  // // Initially show all candidates
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
// Handle search logic
  const handleTeamSearch = () => {
    const filteredCandidates = selectedCandidates.filter(candidate => {
      const nameMatches = `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(name.toLowerCase());
      const roleMatches = candidate.role.toLowerCase().includes(role.toLowerCase());
      const statusMatches = status
        ? candidate.Status && candidate.Status.length
          ? candidate.Status[candidate.Status.length - 1].Status.toLowerCase().includes(status.toLowerCase())
          : "no status".includes(status.toLowerCase())
        : true; // if no status selected, include all statuses

      return nameMatches && roleMatches && statusMatches;
    });

    setDisplayedCandidates(filteredCandidates); // Store the filtered candidates
  };
  //  Handle search logic for user candidates
  const handleUserCandidatesSearch = () => {
    const filteredUserCandidates = selectedCandidates.filter(candidate => {
      const nameMatches = `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(name.toLowerCase());
      const roleMatches = candidate.role.toLowerCase().includes(role.toLowerCase());
      const statusMatches = status
        ? candidate.Status && candidate.Status.length
          ? candidate.Status[candidate.Status.length - 1].Status.toLowerCase().includes(status.toLowerCase())
          : "no status".includes(status.toLowerCase())
        : true; // if no status selected, include all statuses
  
      // Check for savedStatus match if it's selected
      const savedStatusMatches = savedStatus
        ? candidate.savedStatus && candidate.savedStatus.toLowerCase() === savedStatus.toLowerCase()
        : true; // if no savedStatus selected, include all
  
      return nameMatches && roleMatches && statusMatches && savedStatusMatches;
    });
  
    setDisplayedCandidates(filteredUserCandidates); // Update the displayed user candidates state
  };
  
  const handleShowCandidates = (candidates) => {
    setSelectedCandidates(candidates);
    setShowModal(true); // Open the modal
  };
  const handleShowTeamCandidates = (teamCandidatesDetails) => {
    setSelectedCandidates(teamCandidatesDetails);
    setShowTeamModal(true);
  };
  // Show all user candidates initially

const handleShowUserCandidates = (userCandidates)=>{
   setSelectedCandidates(userCandidates);
   setShowUserModal(true);
}

  const handleCloseModal = () => setShowModal(false);
  const handleCloseTeamModal = ()=> setShowTeamModal(false)
   const handleCloseUserModal = ()=> setShowUserModal(false);
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
      let response = await axios.get(`https://ornnovabackend.onrender.com/TlHome/${userId}`);
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
        let JSONData = await fetch(`https://ornnovabackend.onrender.com/getUserData/${id}`, reqOption);
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
    let JSONData = await fetch(`https://ornnovabackend.onrender.com/getTeamrequirements/${userId}`, reqOption);
    let JSOData = await JSONData.json();
  
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
      let JSONData = await fetch(`https://ornnovabackend.onrender.com/getrequirements/${id}`, reqOption);
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
    const response = await fetch(`https://ornnovabackend.onrender.com/userDetailsofAssignedRequirement/${id}/${userId}`, reqOption);
    let data = await response.json();
    setAssignedUsersData(data);
    console.log(data)    
};
  const userDetailstoAssignClient = async (id) => {
    let reqOption = {
        method: "GET"
    };
    const response = await fetch(`https://ornnovabackend.onrender.com/userDetailstoAssignRequirement/${id}/${userId}`, reqOption);
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
          const response = await axios.post(`https://ornnovabackend.onrender.com/assignReq/${userId}/${ReqId}`, 
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

const unassignReqFromUser = async (userId) => {
  const ReqId = selectedReqId; // Ensure you have a way to store the selected requirement ID

  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm(`Are you sure you want to unassign this Requirement?`);

  // If the user confirms, proceed with the unassignment
  if (isConfirmed) {
      try {
          const response = await axios.post(`https://ornnovabackend.onrender.com/unassignReq/${userId}/${ReqId}`, 
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const result = response.data;

          if (result.status === 'success') {
              alert('Requirement unassigned successfully ✅');
              setShowAssign(false);
              window.location.reload();
              // Optionally refresh the user list or perform any other updates
          } else {
              alert(result.msg);
          }
      } catch (error) {
          console.error('Error unassigning requirement:', error.response ? error.response.data : error.message);
          alert('An error occurred while unassigning the requirement. Please try again later.');
      }
  } else {
      // User canceled the unassignment, so no action is taken
      alert('Requirement unassignment was canceled ❌');
  }
};

const Reqcounts = async () => {
  let reqOption = {
    method: "GET"
  };

  try {
    const response = await fetch(`https://ornnovabackend.onrender.com/getTeamRequirementsCount/${userId}`, reqOption);
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

const RequirmentCandidates = async (id) => {
  try {
    // Define the options for the fetch request
    const reqOption = {
      method: "GET",
    };

    // Fetching the data from the backend
    const response = await fetch(`https://ornnovabackend.onrender.com/getRequirementsCandidatesCount/${id}/${userId}`, reqOption);

    // Check if the response is not ok
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parsing the JSON response
    const data = await response.json();
    console.log(data)
    // Check if the response status is Success
    if (data.status === "Success" && data.requirements) {
      // Update the state with the fetched requirements
      setRequirementsData(data.requirements); // Store requirements in state
      setShowRequirmentCount(true);
      setSelectedRecruiterId(id);
    } else {
      // Handle unexpected data format or error messages
      throw new Error(data.msg || "Unexpected data format");
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Failed to fetch requirement candidates:", error);
    alert(error.message); // Optional: alert the error message to the user
  }
};

const fetchCandidates = async (id) => {
  setLoading(true); // Show loading indicator
  setError(""); // Reset error state

  try {
    const response = await fetch(`https://ornnovabackend.onrender.com/viewactions/${id}/${selectedRecruiterId}`);
    const data = await response.json();
   

    if (response.ok) {
      if (data.candidates) {
        setCandidates(data.uploadedCandidates);
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
      const response = await axios.get(`https://ornnovabackend.onrender.com/candidate/${id}`);
     
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
  const response = await fetch(`https://ornnovabackend.onrender.com/requirementDetailsWithAssignedUsers/${userId}`, reqOption);
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
      const response = await fetch(`https://ornnovabackend.onrender.com/updatestatus/${id}`, {
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

// const fetchRequirements = async () => {
//   try {
//     const response = await axios.get(`https://ornnovabackend.onrender.com/getHomeReqData/${userId}`);
//     // const data = await response.json();
//     const data = response.data;
//     const newData = data.filter(req => req.update === 'New' && !req.claimedBy.some(claim => claim.userId === userId));
//     const claimedData = data.filter(req => req.update === 'Old' || req.claimedBy.some(claim => claim.userId === userId));
//     setNewRequirements(newData);
//     setShowCandidateDetailsHome(claimedData);
  
//   } catch (err) {
//     console.error('Error fetching requirements:', err);
//   }
// }; 
// useEffect=()=>{
//   fetchRequirements();
// }

// const updateClaim = async (id) => {
//   const user = {
//     userId,
//     claimedDate: new Date(),
//   };

//   try {
//     const response = await fetch(`https://ornnovabackend.onrender.com/claim/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(user),
//     });

//     const result = await response.json();
//     if (result.status === "Success") {
//       alert(result.msg);
//       fetchRequirements(); // Refresh the requirements list
//       window.location.reload();
//     } else {
//       alert(result.msg);
//     }
//   } catch (error) {
//     console.error('Error updating claim:', error);
//     alert('Error updating claim. Please try again later.');
//   }
// };

  return (
 <div>
  <TeamLeadTopNav/>
<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
<CardGroup>
  <Link   style={{ textDecoration: "none", color: "black" }} to="/TLNewReq">
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

{/* <Table style={{ textAlign: "center" }} responsive="sm">
          <thead>
            <tr>
              <th>Reg Id</th>
              <th>Client</th>
              
              <th>Requirement Type</th>
              <th>Role</th>
              <th>Skills</th>
              <th>
                <button style={{ borderRadius: "20px" }} >
                  <b>Start Date</b> 
                </button>
              </th>
              <th>
                <button style={{ borderRadius: "20px" }} >
                  <b>Uploaded On</b> 
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {newRequirements.map((req, index) => (
              <tr key={index}>
                <td>{req.regId}</td>
                <td>{req.client}</td>
                <td>{req.requirementtype}</td>
                <td>{req.role}</td>
                <td>{req.skill}</td>
                <td>{new Date(req.startDate).toLocaleDateString()}</td>
                <td>{new Date(req.uploadedDate).toLocaleDateString()}</td>
                <td>
                  <Button onClick={()=>{updateClaim(req._id)}}  style={{ border: "1px solid gray", backgroundColor: "lightgreen", borderRadius: "20px" }}>
                    <b>Claim</b>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> <hr></hr> */}

<h3 style={{textAlign:"center"}}>
          <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png'alt="icon"/>
          <b style={{ fontFamily: "monospace" }}>Requirements</b>    
        </h3>
        <input type="search"placeholder="🔍 Search by ID, Client, or Role"value={searchQuery}onChange={(e) => setSearchQuery(e.target.value)} style={{ marginBottom: "20px", padding: "8px", width: "300px",borderRadius:"15px" }} // optional styling
        />
            {/* Your Table */}
            <Table style={{ textAlign: "center" }}  bordered hover responsive>
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
                        <th>Your Profiles</th>
                        <th>Team Profiles</th>
                        <th>Total Profiles</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
  {(filteredData || []).map((req, index) => (
    <tr key={index}>
      <td>
        <Link
          style={{ textDecoration: "none" }}
          onClick={() => viewRequirement(req.requirementDetails?._id)}
        >
          <b>{req.requirementDetails?.regId}</b>
        </Link>
      </td>
      <td>{req.requirementDetails?.client}</td>
      <td>{req.requirementDetails?.role}</td>
      <td>{req.requirementDetails?.typeOfContract}</td>
      <td>{req.requirementDetails?.requirementtype}</td>
      <td>{new Date(req.requirementDetails?.startDate).toLocaleDateString()}</td>
      <td>{new Date(req.requirementDetails?.uploadedDate).toLocaleDateString()}</td>

      <td>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            {req.assignedUsernames?.length > 0 ? (
              req.assignedUsernames.join(", ")
            ) : (
              <strong>No users assigned</strong>
            )}
          </span>
          <div style={{ width: "20%", height: "20%" }}>
            <Button onMouseMove={(e)=>{{e.target.style.backgroundColor="lightpink";e.target.style.color="black"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor= req.userCount === 0 ? "indianred" : "lightslategray";e.target.style.color="white"}}}
              style={{
                backgroundColor: req.userCount === 0 ? "indianred" : "lightslategray",
                borderRadius: "20px",
                textAlign: "center",
                border: "1px solid black",
                fontWeight:"bold"
              }}
              onClick={() => userDetailstoAssignClient(req.requirementDetails?._id)}
            >
              {req.userCount}
            </Button>
          </div>
        </div>
      </td>

      {/* Today Candidates Count */}
      <td>
        {req.todayCandidateCount > 0 ? (
          <div onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}}onMouseLeave={(e)=>{{e.target.style.backgroundColor="";e.target.style.color="blue"}}}
            style={{ cursor: "pointer", color: "blue",fontWeight:"bold",padding:"10px",borderRadius:"10px" }}
            onClick={() => handleShowCandidates(req.combinedTodayCandidates)}
          >
           {req.todayCandidateCount}
          </div>
        ) : (
          <strong>0</strong>
        )}
      </td>
       {/* User Candidates Count */}
       <td>
        {req.userCandidatesCount > 0 ? (
          <div onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}}onMouseLeave={(e)=>{{e.target.style.backgroundColor="";e.target.style.color="blue"}}}
          style={{ cursor: "pointer", color: "blue",fontWeight:"bold",padding:"10px",borderRadius:"10px" }}
          onClick={() => handleShowUserCandidates(req.totalUserCandidatesDetails)}
          >
            {req.userCandidatesCount}
          </div>
        ) : (
          <strong>0</strong>
        )}
      </td>

      {/* Team Candidates Count */}
      <td>
        {req.teamCandidatesCount > 0 ? (
          <div onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}}onMouseLeave={(e)=>{{e.target.style.backgroundColor="";e.target.style.color="blue"}}}
          style={{ cursor: "pointer", color: "blue",fontWeight:"bold",padding:"10px",borderRadius:"10px" }}
          onClick={() => handleShowTeamCandidates(req.totalTeamCandidatesDetails)}
          >
            {req.teamCandidatesCount}
          </div>
        ) : (
          <strong>0</strong>
        )}
      </td>

      {/* Total Candidates Count */}
      <td>
        {req.totalCandidateCount > 0 ? (
          <div onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}}onMouseLeave={(e)=>{{e.target.style.backgroundColor="";e.target.style.color="blue"}}}
          style={{ cursor: "pointer", color: "blue",fontWeight:"bold",padding:"10px",borderRadius:"10px" }}
          onClick={() => handleShowTotalCandidates(req)}
          >
            {req.totalCandidateCount}
          </div>
        ) : (
          <strong>0</strong>
        )}
      </td>

     

      <td>
        <Link to={`/UserAction/${req.requirementDetails?._id}/${userId}`}>
          <Button style={{ border: '0px ', backgroundColor: "MediumSeaGreen", borderRadius: '20px',fontWeight:"bold",padding:"5px" }} onMouseMove={(e)=>{{e.target.style.backgroundColor = "gray";e.target.style.padding = "7px"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor = "MediumSeaGreen";e.target.style.padding = "5px"}}}>
            Upload
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

      {/* // Table displaying filtered candidates */}
{filteredCandidates.length > 0 ? (
  <Table style={{ textAlign: "center" }}  bordered hover responsive>
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
        // Ensure candidate.Status is defined and is an array
        const recentStatus = Array.isArray(candidate.Status) && candidate.Status.length > 0
          ? candidate.Status[candidate.Status.length - 1].Status
          : "No Action Taken";

        let textColor;
        if (recentStatus === "No Action Taken") {
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
            <Table style={{ textAlign: "center", marginTop: "20px" }}  bordered hover responsive>
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
                    : "No Action Taken";

                  let textColor;
                  if (recentStatus === "No Action Taken") {
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
              src={`https://ornnovabackend.onrender.com/${showUserData.userDetails.ProfilePic}`}
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
                    <Button onMouseMove={(e)=>{{e.target.style.backgroundColor="lightgray";e.target.style.color="black"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="lightseagreen";e.target.style.color="white"}}}
                      onClick={() => userDetailstoAssignClient(item.requirement._id)}
                      style={{padding: "5px",borderRadius: "8px",backgroundColor: "lightseagreen",color: "white",border: "1.5px solid black",fontWeight:"bold"}}>
                   Assign
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
  <Table   bordered hover responsive>
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
      <Table hover responsive style={{textAlign: "center"}}>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th>Action</th>
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
                <Button onClick={() => assignReqToUser(team._id)} onMouseMove={(e)=>{e.target.style.backgroundColor = "lightgreen"}} onMouseLeave={(e)=>{e.target.style.backgroundColor = "lightsteelblue"}} style={{backgroundColor: "lightsteelblue", color: "black", border: "0px",fontWeight:"bold"}}>
                  Assign
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
      <Table hover responsive style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th colSpan={2}>Action</th>
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
                <Button style={{ backgroundColor: "lightgreen", color: "black", border: "0px" }}>
                  <b>Assigned</b>
                </Button>

              </td>
              <td>
                <Button onClick={()=> unassignReqFromUser(team._id)} onMouseMove={(e)=>{e.target.style.backgroundColor = "lightsteelblue"}} onMouseLeave={(e)=>{e.target.style.backgroundColor = "indianred"}}  style={{backgroundColor: "indianred", color: "white", border: "0px",fontWeight:"bold"}}>
                  Un Assign
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
              src={`https://ornnovabackend.onrender.com/${showUserData.userDetails.ProfilePic}`}
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
                                <Table style={{textAlign:"center"}}  bordered hover responsive>
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
                    <Table style={{textAlign:"center"}}  bordered hover responsive>
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
          <Table style={{textAlign:"center"}}  bordered hover responsive>
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
        <Table style={{textAlign:"center"}}  bordered hover responsive>
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
      
{/* Team Uloads Modal */}
               <Modal show={showTeamModal} onHide={handleCloseTeamModal} size="fullscreen">
      <Modal.Header closeButton>
        <Modal.Title> <h3 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Team Candidates</b>
                        </h3></Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search Inputs */}
        <FormControl
          type="search"
          placeholder="Search by Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px', width: "300px", border: "1px solid black", borderRadius: "15px" }}
        />

        {/* Role input */}
        <FormControl
          type="search"
          placeholder="Search by Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: '10px', width: "300px", border: "1px solid black", borderRadius: "15px" }}
        />

        {/* Status dropdown */}
        <FormControl as="select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: '10px', width: "300px", border: "1px solid black", borderRadius: "15px" }}>
          <option value="">All</option>
          {statusSearchOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </FormControl>

        {/* Search Button */}
        <center>
          <Button variant="primary" onClick={handleTeamSearch} style={{ marginBottom: '20px' }}>
            Search
          </Button>
        </center>

        {/* Candidate Table */}
        {displayedCandidates && displayedCandidates.length > 0 ? (
          <Table  bordered hover responsive style={{textAlign:"center"}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Total YOE</th>
                <th>LWD</th>
                <th>ECTC</th>
                <th>Status</th>
                <th>Uploaded Date</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedCandidates.map((candidate, idx) => {
                const recentStatus = candidate.Status && candidate.Status.length
                  ? candidate.Status[candidate.Status.length - 1].Status
                  : "No Action Taken";

                let textColor;
                if (recentStatus === "No Action Taken") {
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
                    <td> <Link onClick={()=> CandidateData(candidate._id)}><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link> </td>
                    <td> <Link onClick={()=> updateCandidate(candidate._id)}><Image  style={{backgroundColor:"lightgreen",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/edit.svg'></Image></Link> </td>

                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No candidates match your search criteria.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseTeamModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Your Uploads Modal */}
    <Modal show={showUserModal} onHide={handleCloseUserModal} size="fullscreen">
    <Modal.Header closeButton>
      <Modal.Title> <h3 style={{ textAlign: "center" }}>
                            <img
                                style={{ width: "30px", margin: "10px" }}
                                src='/Images/icon.png'
                                alt="icon"
                            />
                            <b style={{ fontFamily: "monospace" }}>Your Uploads</b>
                        </h3></Modal.Title>
    </Modal.Header>

    <Modal.Body>
  {/* Search Inputs for User Candidates */}
  <Row className="justify-content-center" style={{ gap: "10px", marginBottom: "20px" }}>
  {/* Search by Name */}
  <Col xs={12} sm={6} md={3}>
    <FormControl
      type="search"
      placeholder="Search by Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{ width: "100%", border: "1px solid black", borderRadius: "15px" }}
    />
  </Col>

  {/* Search by Role */}
  <Col xs={12} sm={6} md={3}>
    <FormControl
      type="search"
      placeholder="Search by Role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      style={{ width: "100%", border: "1px solid black", borderRadius: "15px" }}
    />
  </Col>

  {/* Status Select */}
  <Col xs={12} sm={6} md={3}>
    <FormControl
      as="select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      style={{ width: "100%", border: "1px solid black", borderRadius: "15px" }}
    >
      <option value="">All Statuses</option>
      {statusSearchOptions.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </FormControl>
  </Col>

  {/* Saved Status Select */}
  <Col xs={12} sm={6} md={3}>
    <FormControl
      as="select"
      value={savedStatus}
      onChange={(e) => setSavedStatus(e.target.value)}
      style={{ width: "100%", border: "1px solid black", borderRadius: "15px" }}
    >
      <option value="">All Types</option>
      <option value="Saved">Saved</option>
      <option value="Uploaded">Uploaded</option>
    </FormControl>
  </Col>

  {/* Search Button */}
  <Col xs={12} className="text-center mt-2">
    <Button variant="primary" onClick={handleUserCandidatesSearch} style={{ width: "100%", maxWidth: "300px" }}>
      Search
    </Button>
  </Col>
</Row> <hr></hr>


  {/* User Candidate Table */}
  {displayedCandidates && displayedCandidates.length > 0 ? (
    <Table  bordered hover responsive style={{ textAlign: "center" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Total YOE</th>
          <th>LWD</th>
          <th>ECTC</th>
          <th>Status</th>
          <th>Uploaded Date</th>
          <th colSpan={4}>Action</th>
        </tr>
      </thead>
      <tbody>
        {displayedCandidates.map((candidate, idx) => {
          const recentStatus = candidate.Status && candidate.Status.length
            ? candidate.Status[candidate.Status.length - 1].Status
            : "No Action Taken";

          let textColor;
          if (recentStatus === "No Action Taken") {
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
                    style={{ backgroundColor: "lightblue", margin: "5px", padding: "10px", borderRadius: "10px" }} 
                    src='./Images/view.svg' 
                  />
                </Link>
              </td>
              <td>
                <Link onClick={() => deleteCandidate(candidate._id)} style={{ pointerEvents: recentStatus === "No Action Taken" ? "auto" : "none" }}>
                  <Image 
                    style={{ backgroundColor: recentStatus === "No Action Taken" ? "indianred" : "lightgray", margin: "5px", padding: "10px", borderRadius: "10px", opacity: recentStatus === "No Action Taken" ? 1 : 0.5 }} 
                    src='./Images/trash.svg' 
                  />
                </Link>
              </td>
              <td>
                <Link onClick={() => updateCandidate(candidate._id)} style={{ pointerEvents: recentStatus === "No Action Taken" ? "auto" : "none" }}>
                  <Image 
                    style={{ backgroundColor: recentStatus === "No Action Taken" ? "lightgreen" : "lightgray", margin: "5px", padding: "10px", borderRadius: "10px", opacity: recentStatus === "No Action Taken" ? 1 : 0.5 }} 
                    src='/Images/edit.svg' 
                  />
                </Link>
              </td>
              <td>
                {candidate.savedStatus === 'Saved' && (
                  <Button 
                    onClick={() => updateCandidate(candidate._id)} 
                    style={{ fontWeight: "bold", backgroundColor: "green", border: "0px", padding: "5px", borderRadius: "20px" }} 
                    onMouseMove={(e) => { e.target.style.backgroundColor = "gray"; e.target.style.padding = "10px"; }} 
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "green"; e.target.style.padding = "5px"; }}
                  >
                    Upload
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  ) : (
    <p>No user candidates match your search criteria.</p>
  )}
</Modal.Body>


    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseUserModal}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>

  {/* Candidate Modal */}
  <Modal style={{backgroundColor:"lightgray"}} size="fullscreen" show={lagShow} onHide={() => setLagShow(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
            <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidate Details </b></h5> {/* Displaying single requirement detail */}
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    { candidateDetails && (
    <div className="table-responsive">
    <Table  bordered hover className="table-sm">
        <tbody>
        <tr>
            <td>
              <Image
                src={`https://ornnovabackend.onrender.com/${candidateDetails.candidateImage}`}
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
      <a href={`https://ornnovabackend.onrender.com/${candidateDetails.updatedResume}`} target="_blank" rel="noopener noreferrer">
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
      <a href={`https://ornnovabackend.onrender.com/${candidateDetails.ornnovaProfile}`} target="_blank" rel="noopener noreferrer">
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

               <Modal
      style={{ backgroundColor: "lightgray", opacity: "98%" }}
      show={updateshow}
      size="lg"
      onHide={handleUpdateClose}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          <h5>
            <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img>
            <b style={{ fontFamily: "monospace" }}>Update Candidate Information</b>
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form style={{backgroundColor:"lightsteelblue",borderRadius:"20px"}}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label><strong>Candidate Image:</strong></label>
                        <div>
                            <img
                                src={`https://ornnovabackend.onrender.com/${updateCandidateDetails.candidateImage}`}
                                style={{ width: "100px", borderRadius: "100px" }}
                                alt='Candidate Image'
                            />
                        </div>
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>First Name:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Last Name:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Email:</strong></label>
                        <input
                            type="email"
                            className="form-control"
                            value={updateCandidateDetails.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Mobile Number:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.mobileNumber}
                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        />
                    </div>
                   
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Date of Birth:</strong></label>
                        <input
                            type="date"
                            className="form-control"
                            value={new Date(updateCandidateDetails.dob).toLocaleDateString('en-CA')}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>CTC:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.ctc}
                            onChange={(e) => handleInputChange('ctc', e.target.value)}
                        />
                    </div>
                   
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>ECTC:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.ectc}
                            onChange={(e) => handleInputChange('ectc', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Total YOE:</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            value={updateCandidateDetails.totalYoe}
                            onChange={(e) => handleInputChange('totalYoe', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Relevant YOE:</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            value={updateCandidateDetails.relevantYoe}
                            onChange={(e) => handleInputChange('relevantYoe', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>LWD:</strong></label>
                        <input
                            type="date"
                            className="form-control"
                            value={new Date(updateCandidateDetails.lwd).toLocaleDateString('en-CA')}
                            onChange={(e) => handleInputChange('lwd', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Current Location:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.currentLocation}
                            onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Preferred Location:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.prefLocation}
                            onChange={(e) => handleInputChange('prefLocation', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Resignation Served:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.resignationServed}
                            onChange={(e) => handleInputChange('resignationServed', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Current Organization:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.currentOrg}
                            onChange={(e) => handleInputChange('currentOrg', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Candidate Skills:</strong></label>
                        <textarea
                            className="form-control"
                            value={updateCandidateDetails.candidateSkills}
                            onChange={(e) => handleInputChange('candidateSkills', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Role:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                        />
                    </div>
                   
                </div>
                {/* <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Internal Screening:</strong></label>
                        <select
                            className="form-control"
                            value={updateCandidateDetails.internalScreening}
                            onChange={(e) => handleInputChange('internalScreening', e.target.value)}
                        >
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Shared With Client:</strong></label>
                        <select
                            className="form-control"
                            value={updateCandidateDetails.sharedWithClient}
                            onChange={(e) => handleInputChange('sharedWithClient', e.target.value)}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                   
                </div> */}
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Feedback:</strong></label>
                        <textarea
                            className="form-control"
                            value={updateCandidateDetails.feedback}
                            onChange={(e) => handleInputChange('feedback', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Details:</strong></label>
                        <textarea
                            className="form-control"
                            value={updateCandidateDetails.details}
                            onChange={(e) => handleInputChange('details', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Interview Date:</strong></label>
                        <input
                            type="date"
                            className="form-control"
                            value={new Date(updateCandidateDetails.interviewDate).toLocaleDateString('en-CA')}
                            onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Educational Qualification:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.educationalQualification}
                            onChange={(e) => handleInputChange('educationalQualification', e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="row">
                <div className="col-md-6 form-group">
                        <label><strong>Offer In Hand:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={updateCandidateDetails.offerInHand}
                            onChange={(e) => handleInputChange('offerInHand', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label><strong>Last Interview Date:</strong></label>
                        <input
                            type="date"
                            className="form-control"
                            value={new Date(updateCandidateDetails.interviewDate).toLocaleDateString('en-CA')}
                            onChange={(e) => handleInputChange('lastInterviewDate', e.target.value)}
                        />
                    </div>
                </div> <hr></hr>
                <div className="row">
            <div className="col-md-12 form-group">
                <h3>
                    <img style={{width: "30px", margin: "10px"}} src='/Images/icon.png' alt="icon" />
                    <b style={{fontFamily: "monospace"}}>Assessment Details</b>
                </h3>
                {updateCandidateDetails.assessments.map((assessment, index) => (
                    <div key={index} className="form-group">
                        <label><strong>Assessment {index + 1}:</strong></label>
                        <input
                            readOnly
                            type="text"
                            className="form-control"
                            value={assessment.assessment}
                        />
                        <label><strong>Years of Experience:</strong></label>
                        <input
                            readOnly
                            type="text"
                            className="form-control"
                            value={assessment.yoe}
                        />
                        <label><strong>Score:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            value={assessment.score}
                            onChange={(e) => handleAssessmentChange(index, 'score', e.target.value)}
                        />
                        <hr />
                    </div>
                ))}
            </div>
        </div>
            </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
      {updateCandidateDetails.savedStatus === "Saved" && (
                    <Button style={{borderRadius:"20px",backgroundColor:"mediumseagreen",color:"white",border:"1.5px solid black",fontWeight:"bold"}}
                        type="button"
                        className="btn btn-secondary ml-2"
                        onMouseMove={(e)=>{{e.target.style.backgroundColor = "lightgray";e.target.style.color = "black";e.target.style.padding = "10px"}}}
                        onMouseLeave={(e)=>{{e.target.style.backgroundColor = "mediumseagreen";e.target.style.color = "white";e.target.style.padding = "7px"}}}
                        onClick={uploadChanges}
                        // onClick={handleUploadStatus}
                    >
                        Upload
                    </Button>
                )}
        <Button                         onMouseMove={(e)=>{{e.target.style.backgroundColor = "green";e.target.style.color = "white";e.target.style.padding = "10px"}}}
                        onMouseLeave={(e)=>{{e.target.style.backgroundColor = "lightgray";e.target.style.color = "green";e.target.style.padding = "7px"}}}
 style={{borderRadius:"20px",backgroundColor:"lightgray",color:"green",border:"1.5px solid black",fontWeight:"bold"}} onClick={saveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>


 </div>
  );
}

export default TLHome;
