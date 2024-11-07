import React, { useEffect, useState } from 'react';
import AdminTopNav from './AdminTopNav';
import UserTopNav from './UserTopNav';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Form, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Dropdown, DropdownButton, FormCheck, Button, FormControl, InputGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Image from 'react-bootstrap/Image';
import CryptoJS from 'crypto-js';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';


function Requirements() {
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
    let localStorageType = getDecryptedData("User Type");
    let [requirements, SetRequirements] = useState([]);
    const [candidateCounts, setCandidateCounts] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [candidateDetails,setCandidateDetails] = useState([]);
    const [claimedByCounts, setClaimedByCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [showClaimedUsers, setShowClaimedUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [lagShow, setLagShow] = useState(false);
    const [showAssigns,setShowAssigns] = useState(false);
    const [showCandidate, setShowCandidate] = useState(false);
    const [recruitersData, setRecruitersData] = useState([]);
    const [requirementData, SetRequirementData] = useState({}); // Changed to object
    const requirementTypes = ['Hot', 'Cold', 'Warm', 'Hold', 'Closed'];
    const [selectedTypes, setSelectedTypes] = useState(['Hot', 'Warm']);
    const [candidateId,setCandidateId]=useState('');
    const [showTotalModal, setShowTotalModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [assignedUserDetails,setAssignedUserDetails] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [remainingUsers, setRemainingUsers] = useState([]);
    const [selectedReqId,setSelectedReqId]= useState('');
    // State for filters
    const [selectedCandidateStatus, setSelectedCandidateStatus] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [openItems, setOpenItems] = useState({}); // Track open/close state by item ID

  const toggleFlip = (id) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // Toggle the specific item’s state by ID
    }));
  };

   

    // Function to filter candidates
    const filteredRecruitersData = recruitersData.map(item => ({
        ...item,
        candidates: item.candidates.filter(candidate => {
            const recentStatus = candidate.Status && candidate.Status.length > 0
                ? candidate.Status[candidate.Status.length - 1].Status
                : "No Action Taken";

            const matchesStatus = selectedCandidateStatus ? recentStatus === selectedCandidateStatus : true;
            const matchesName = candidateName 
                ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(candidateName.toLowerCase())
                : true;

            return matchesStatus && matchesName;
        })
    })).filter(item => item.candidates.length > 0); // Keep only items with candidates


    
const [formData, setFormData] = useState({
  id:'',
  client: '',
  typeOfContract: '',
  startDate: '',
  duration: '',
  location: '',
  sourceCtc: '',
  qualification: '',
  yearsExperience: '',
  relevantExperience: '',
  skill: '',
  role: '',
  requirementtype: '',
  assessments: [], // Initialize assessments as an array
});

// States for search filters
const [searchName, setSearchName] = useState('');
const [searchRole, setSearchRole] = useState('');
const [searchStatus, setSearchStatus] = useState('');

// Temporary states for holding input values
const [tempSearchName, setTempSearchName] = useState('');
const [tempSearchRole, setTempSearchRole] = useState('');
const [tempSearchStatus, setTempSearchStatus] = useState('All');
const [selectedStatus, setSelectedStatus] = useState('');
const [searchReq, setSearchReq] = useState("");
const [expandedRecruiter, setExpandedRecruiter] = useState(null);

   


    const handleSearchChange = (event) => {
        setSearchReq(event.target.value);
    };

 
// Status options for the search dropdown
const statusSearchOptions = [ 'Ornnova Screen Selected', 'Shared with Client', 'Client Rejected', 'L1 Pending', 
    'L1 Selected', 'L1 Rejected', 'L2 Pending', 'L2 Selected', 'L2 Rejected', 
    'Onboard Confirmation', 'On Boarded', 'Rejected', 'Declined'];

// Function to filter candidates based on search criteria
const filterCandidates = () => {
  return candidates.filter(candidate => {
    const recentStatus = candidate.Status && candidate.Status.length
      ? candidate.Status[candidate.Status.length - 1].Status
      : 'No status available';

    // Filter by name
    const matchesName = `${candidate.firstName} ${candidate.lastName}`
      .toLowerCase()
      .includes(searchName.toLowerCase());

    // Filter by role
    const matchesRole = candidate.role
      .toLowerCase()
      .includes(searchRole.toLowerCase());

    // Filter by status
    const matchesStatus = searchStatus === 'All' || recentStatus === searchStatus || searchStatus === '';

    return matchesName && matchesRole && matchesStatus;
  });
};

// Function to trigger filtering when search button is clicked
const handleSearchClick = () => {
  setSearchName(tempSearchName);
  setSearchRole(tempSearchRole);
  setSearchStatus(tempSearchStatus);
};

// Get the filtered candidates
const filteredCandidates = filterCandidates();
   
    const handleCheckboxChange = (type) => {
        if (type === 'all') {
            setSelectedTypes(selectedTypes.length === requirementTypes.length ? [] : requirementTypes);
        } else {
            setSelectedTypes(prevSelected => 
                prevSelected.includes(type)
                ? prevSelected.filter(item => item !== type)
                : [...prevSelected, type]
            );
        }
    };

    const getDropdownTitle = () => {
        if (selectedTypes.length === requirementTypes.length) return 'All';
        if (selectedTypes.length === 0) return 'Select';
        return selectedTypes.join(', ');
    };

    const toggleShowB = () => setShowB(!showB);
    
    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const response = await fetch('https://ornnovabackend.onrender.com/admingetrequirements');
            const data = await response.json();
            SetRequirements(data);
             console.log(data)
            const counts = {};
            for (let req of data) {
                try {
                    const candidateRes = await axios.get(`https://ornnovabackend.onrender.com/adminviewactions/${req._id}`);
                    counts[req._id] = candidateRes.data.candidateCount || 0;
                   
                } catch (err) {
                    counts[req._id] = 0;
                }
            }
            setCandidateCounts(counts);
        } catch (err) {
            console.error('Error fetching requirements:', err);
        }
    };

    useEffect(() => {
        const fetchClaimedByCounts = async () => {
            try {
                const counts = {};
                for (let req of requirements) {
                    const response = await axios.get(`https://ornnovabackend.onrender.com/api/requirements/${req._id}/claimedByCount`);
                    counts[req._id] = response.data.claimedByCount || 0;
                }
                setClaimedByCounts(counts);
            } catch (err) {
                console.log('Error fetching claimedBy counts:', err);
            }
        };

        fetchClaimedByCounts();
    }, [requirements]);

    const fetchClaimedUsersDetails = async (requirementId) => {
        try {
            const response = await axios.get(`https://ornnovabackend.onrender.com/api/requirements/${requirementId}/claimedByDetails`);
            setShowClaimedUsers(response.data.claimedUsers);
            setShow(true);
        } catch (error) {
            console.error(`Error fetching claimed users for requirement ${requirementId}:`, error);
        }
    };

const fetchRecruiterDetails = async (reqId) => {
    try {
        const response = await axios.get(`https://ornnovabackend.onrender.com/api/recruiters/${reqId}`);
        setRecruitersData(response.data.recruiters);
        console.log(response.data.recruiters);
        setShowA(true); // Show the recruiter data when fetched
    } catch (err) {
        toggleShowB(); // Handle error
    }
};

const toggleAccordion = async (id) => {
    if (expandedId === id) {
        // If the accordion is being closed
        setExpandedId(null); // Reset expanded ID
    } else {
      const response = await axios.get(`https://ornnovabackend.onrender.com/api/recruiters/${id}`);
      setRecruitersData(response.data.recruiters);
      toggleFlip(id);
      setExpandedId(id); // Set the current ID as expanded
    }
};
    const requirementDetails = async (id) => {
        try {
            const response = await axios.get(`https://ornnovabackend.onrender.com/getrequirements/${id}`);
            SetRequirementData(response.data); // Ensure this returns an object
            setLgShow(true);
        } catch (err) {
            console.log(err);
        }
    };
    const CandidateData = async(id)=>{
        try {
            const response = await axios.get(`https://ornnovabackend.onrender.com/candidate/${id}`);
           
            console.log(response.data)
                setCandidateDetails(response.data); 
                setCandidateId(id);  
            setLagShow(true)
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } 
    }
 // Fetch candidate details when the modal is opened
    
    const filteredRequirements = requirements.filter(item =>
        item.requirementtype.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortOrder = ['hot', 'warm', 'cold', 'hold', 'closed'];
    const sortedRequirements = filteredRequirements.sort((a, b) => {
        return sortOrder.indexOf(a.requirementtype.toLowerCase()) - sortOrder.indexOf(b.requirementtype.toLowerCase());
    });

    const handleDeleteClick = async (candidateId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this candidate?');
        
        if (confirmDelete) {
          try {
            const response = await fetch(`https://ornnovabackend.onrender.com/api/candidates/${candidateId}`, {
              method: 'DELETE',
            });
      
            if (response.ok) {
              // Update the state to remove the deleted candidate
              setCandidateDetails(candidateDetails.filter(candidate => candidate._id !== candidateId));
              alert('Candidate deleted successfully ✅');
              window.location.reload();
            } else {
              const errorData = await response.json();
              alert(`Failed to delete candidate ❌: ${errorData.message || 'Unknown error occurred'}`);
            }
          } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('An error occurred while trying to delete the candidate ❌');
          }
        } else {
          alert('Candidate deletion canceled');
        }
      };
      
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
            setLagShow(false);
            window.location.reload();
            handleCloseTotalCandidates();
            handleCloseModal();
            console.log('Updated Main Document:', data);
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
      };
      const handleCloseTotalCandidates = () => { // renamed from handleCloseModal
        setShowTotalModal(false); // renamed from setShowModal
        setSelectedRequirement(null);
      };
      const handleCloseModal = () => setShowModal(false);
      // Delete Requirement
      const handleDelete = async (id) => {
        if (!id) {
          console.log("No regId provided");
          return;
        }
    
        // Confirm the action with the user
        const isConfirmed = window.confirm("Are you sure you want to delete this requirement?");
        
        if (!isConfirmed) {
          // If the user cancels, do nothing
          return;
        }
    
        try {
          const response = await fetch(`https://ornnovabackend.onrender.com/deleteRequirement/${id}`, {
            method: 'DELETE',
          });
    
          const result = await response.json();
    
          if (response.ok) {
            alert("Requirement deleted successfully ✅");
            window.location.reload();
            console.log(`Requirement deleted successfully ✅`);
            // Optionally, refresh the page or update the UI here
          } else {
            alert(`Error: ${result.message}`)

            console.error(`Error: ${result.message}`);
          }
        } catch (error) {
          alert("Error deleting requirement:", error)
          console.error("Error deleting requirement:", error);
        }
      };
      // Edit Requirement
      const fetchRequirement = async (id) => {
        try {
            const response = await fetch(`https://ornnovabackend.onrender.com/getrequirements/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({ ...data, id: data._id }); // Set ID for the PUT request
                setShowEditModal(true);
                console.log(data);
            } else {
                console.error('Failed to fetch requirement data');
            }
        } catch (error) {
            console.error('Error fetching requirement data:', error);
        }
      };
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };  
    const handleAssessmentChange = (index, e) => {
      const { name, value } = e.target;
      const updatedAssessments = [...formData.assessments];
      updatedAssessments[index][name] = value;
      setFormData((prevData) => ({
          ...prevData,
          assessments: updatedAssessments,
      }));
    };
    const addAssessment = () => {
      setFormData((prevData) => ({
          ...prevData,
          assessments: [...prevData.assessments, { assessment: '', yoe: '' }],
      }));
    };
    const deleteAssessment = (index) => {
      const newAssessments = formData.assessments.filter((_, i) => i !== index);
      setFormData({
          ...formData,
          assessments: newAssessments,
      });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.put(`https://ornnovabackend.onrender.com/editRequirement/${formData.id}`, formData); // Use the correct ID and data
          alert("Updated Successfully ✅"); // Ensure your API returns a message
          setShowEditModal(false); // Close the modal after successful update
          window.location.reload();
          // Optionally, refresh the requirements list or update the UI accordingly
      } catch (err) {
          console.error(err);
          alert("Error updating requirement.");
      }
    }; 
// Function to fetch requirement details without Axios
const fetchRequirementDetails = async (reqId) => {
  try {
      // Send GET request using the Fetch API
      const response = await fetch(`https://ornnovabackend.onrender.com/admingetrequirements/${reqId}`);
      
      // Check if the response is okay (status 200)
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(data);
          
          // Update the assigned user details in the state
          setAssignedUserDetails(data.userDetails);
          
          // Fetch the remaining users
          fetchRemainingUsers(reqId);
          
          // Open the modal for assignment
          setShowAssigns(true);
          setSelectedReqId(reqId);
      } else {
          throw new Error("Received non-JSON response from server");
      }
  } catch (err) {
      console.error('Error fetching requirement details:', err);
  }
};

const fetchRemainingUsers = async (reqId) => {
  try {
      // Make a GET request to the /remainingusers/:id API using Axios
      const response = await axios.get(`https://ornnovabackend.onrender.com/remainingusers/${reqId}`);
      
      // Set the remaining users in the state
      setRemainingUsers(response.data);
  } catch (err) {
      console.error('Error fetching remaining users:', err.message);
  }
};

// Fetch user count from the API
const fetchUsersCount = async () => {
  try {
    const response = await axios.get("https://ornnovabackend.onrender.com/allUsersCount"); // API call to get count
    setUsersCount(response.data); // update state with the count
  } catch (error) {
    console.error("Error fetching user count:", error);
  }
};

// Call the function when component mounts
useEffect(() => {
  fetchUsersCount();
}, []); // empty dependency array to run it once on mount
  
const assignReqToUser = async (userId) => {
  const ReqId = selectedReqId; // Ensure you have a way to store the selected requirement ID

  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm(`Are you sure you want to assign this Requirement?`);

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

              // Re-fetch the requirement details (assigned users and remaining users)
              fetchRequirementDetails(ReqId);
          } else {
              alert(result.msg);
          }
      } catch (error) {
          console.error('Error assigning requirement:', error.response ? error.response.data : error.message);
          alert('An error occurred while assigning the requirement. Please try again later.');
      }
  } else {
      // User canceled the assignment, so no action is taken
      alert('Requirement assignment was canceled ❌');
  }
};

// Function to unassign requirement from a user
const unassignReqFromUser = async (userId) => {
  const ReqId = selectedReqId; // Ensure you have the selected requirement ID

  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm(`Are you sure you want to unassign this Requirement?`);

  // If the user confirms, proceed with the unassignment
  if (isConfirmed) {
    try {
      const response = await fetch(`https://ornnovabackend.onrender.com/unassignReq/${userId}/${ReqId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        alert('Requirement unassigned successfully ✅');
        // Refresh the UI or re-fetch data if necessary
        fetchRequirementDetails(ReqId); // Re-fetch requirement details to update the user list
      } else {
        alert(result.msg || 'An error occurred while unassigning the requirement. Please try again later.');
      }
    } catch (error) {
      console.error('Error unassigning requirement:', error);
      alert('An error occurred while unassigning the requirement. Please try again later.');
    }
  } else {
    // User canceled the unassignment, so no action is taken
    alert('Requirement unassignment was canceled ❌');
  }
};


    return (
        <div>
            {localStorageType === "Admin" ? <AdminTopNav /> : <UserTopNav />}
            <center>
                <h2 style={{ fontFamily: "fantasy", fontWeight: "bolder" }}>
                    <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img>Requirements
                </h2>
            </center>
            <FormControl
            type='search'
                    placeholder="🔍 Search By Client Name"
                    aria-label="Search by Client Name"
                    aria-describedby="basic-addon1"
                    value={searchReq}
                    onChange={handleSearchChange}
                    style={{width:"300px",margin:"20px",border:"2.5px inset black",padding:"10px",borderRadius:"25px"}}
                />
            <center>
            <div style={{ marginBottom: '10px' }}>
                <DropdownButton
                    title={getDropdownTitle()}
                    variant="outline-secondary"
                    id="dropdown-checkbox"
                    style={{ width: '300px', fontWeight: 'bolder', fontSize: '18px', textAlign: 'center' }}
                >
                    {/* 'All' Option */}
                    <Dropdown.Item
                        as="div"
                        key="all"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontWeight: 'bold' }}
                    >
                        <input
                            type="checkbox"
                            id="checkbox-all"
                            checked={selectedTypes.length === requirementTypes.length}
                            onChange={() => handleCheckboxChange('all')}
                        />
                        <label htmlFor="checkbox-all" style={{ marginLeft: '10px' }}>
                            All
                        </label>
                    </Dropdown.Item>

                    {requirementTypes.map((type) => (
                        <Dropdown.Item
                            as="div"
                            key={type}
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontWeight: 'bold' }}
                        >
                            <input
                                type="checkbox"
                                id={`checkbox-${type}`}
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleCheckboxChange(type)}
                            />
                            <label htmlFor={`checkbox-${type}`} style={{ marginLeft: '10px' }}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
                
            </div>

            <Col md={6} className="mb-2">
                <Toast style={{ backgroundColor: "indianred" }} onClose={() => setShowB(false)} show={showB} animation={false}>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">
                            <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                            <b style={{ fontSize: "20px", fontFamily: "serif", textAlign: "center" }}> No Uploads</b>
                        </strong>
                    </Toast.Header>
                </Toast>
            </Col>
            {/* Table */}
            <Table bordered style={{ textAlign: "center" }} responsive="sm"  hover>
                <thead>
                    <tr>
                        <th>Reg Id</th>
                        <th>Client</th>
                        <th>Role</th>
                        <th>Type Of Contract</th>
                        <th>Requirement Type</th>
                        <th>Start Date</th>
                        <th>Uploaded On</th>
                        <th>Assigns</th>
                        <th>No of Profiles</th>
                        <th>No of Claims</th>
                        <th colSpan={3}>Actions</th>
                    </tr>
                </thead>
                <tbody>
      {sortedRequirements
        .filter(item =>
          selectedTypes.length === requirementTypes.length || selectedTypes.includes(item.requirementtype)
        )
        .filter(item =>
          item.client.toLowerCase().includes(searchReq.toLowerCase()) // Filter by client name
        )
        .map((item) => (
          <React.Fragment key={item._id}>
            {/* Main row */}
            <tr>
              <td>
                <Link style={{ textDecoration: "none" }} onClick={() => requirementDetails(item._id)}>
                  <b>{item.regId}</b>
                </Link>
              </td>
              <td>{item.client}</td>
              <td>{item.role}</td>
              <td>{item.typeOfContract}</td>
              <td>{item.requirementtype}</td>
              <td>{new Date(item.startDate).toLocaleDateString()}</td>
              <td>{new Date(item.uploadedDate).toLocaleDateString()}</td>
              <td>
                <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="lightpink";e.target.style.color="black"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}} style={{ textDecoration: "none" }} onClick={() => fetchRequirementDetails(item._id)}>
                  <strong style={{ backgroundColor: "dimgrey", borderRadius: "8px", padding: "9px", color: "white" }}>
                    {item.userCount}/{usersCount}
                  </strong>
                </Link>
              </td>
              <td>
                <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="bisque";e.target.style.color="black"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="lightsteelblue";e.target.style.color="black"}}} style={{ textDecoration: "none" }} onClick={() => fetchRecruiterDetails(item._id)}>
                  <b style={{ backgroundColor: "lightsteelblue", borderRadius: "8px", padding: "9px", color: "black" }}>
                    {candidateCounts[item._id] || 0}
                  </b>
                </Link>
              </td>
              <td>
                <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="lightgray";e.target.style.color="black"}}} style={{ textDecoration: "none" }} onClick={() => fetchClaimedUsersDetails(item._id)}>
                  <b style={{ backgroundColor: "lightgray", borderRadius: "8px", padding: "9px", color: "black" }}>
                    {claimedByCounts[item._id]}
                  </b>
                </Link>
              </td>
              <td>
                <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="grey";e.target.style.color="white"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="Indianred";e.target.style.color="black"}}} onClick={() => handleDelete(item._id)}>
                  <Image style={{ backgroundColor: "IndianRed", padding: "10px", borderRadius: "10px" }} src='./Images/trash.svg' />
                </Link>
              </td>
              <td>
                <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="lightgreen";e.target.style.color="black"}}} onClick={() => fetchRequirement(item._id)}>
                  <Image style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "10px" }} src='./Images/edit.svg' />
                </Link>
              </td>
              <td>
              <Link onMouseMove={(e)=>{{e.target.style.backgroundColor="gray";e.target.style.color="white"}}} onMouseLeave={(e)=>{{e.target.style.backgroundColor="";e.target.style.color="black"}}} onClick={() => toggleAccordion(item._id)}>
                <Image
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    transform: openItems[item._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',  // Smooth rotation
                  }}
                  src='./Images/expand.svg'
                  alt="Expand Icon"
                />
              </Link>
            </td>
            </tr>

            {/* Conditionally render the accordion row below the main row */}
            {expandedId === item._id && (
              <tr>
                <td colSpan="12">
                  <Accordion activeKey="0">
                    <Accordion.Item eventKey="0">
                      {/* <Accordion.Header>More Details</Accordion.Header> */}
                      <Accordion.Body>
                      <Table  bordered hover responsive className="table-sm" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Candidate Name</th>
                        <th>Role</th>
                        <th>ECTC</th>
                        <th>LWD</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecruitersData.map((item, i) => (
                        <React.Fragment key={i}>
                            {item.candidates.length > 0 ? (
                                item.candidates.filter(candidate => {
                                    const recentStatus = candidate.Status && candidate.Status.length > 0
                                        ? candidate.Status[candidate.Status.length - 1].Status
                                        : "No Action Taken";

                                    const matchesStatus = selectedCandidateStatus ? recentStatus === selectedCandidateStatus : true;
                                    const matchesName = candidateName 
                                        ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(candidateName.toLowerCase())
                                        : true;

                                    return matchesStatus && matchesName;
                                }).map((candidate, index) => {
                                    const recentStatus = candidate.Status && candidate.Status.length > 0
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
                                        <tr key={index}>
                                            {index === 0 && (
                                                <td rowSpan={item.candidates.length}>{item.recruiter.EmployeeName}</td>
                                            )}
                                            <td>{candidate.firstName} {candidate.lastName}</td>
                                            <td>{candidate.role}</td>
                                            <td>{candidate.ectc}</td>
                                            <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                                            <td style={{ color: textColor }}>
                                                <b>{recentStatus}</b>
                                            </td>
                                            <td
                                                style={{ cursor: "pointer", color: "blue" }}
                                                onClick={() => CandidateData(candidate._id)}>
                                                <b>
                                                    <img
                                                        style={{
                                                            backgroundColor: "lightblue",
                                                            margin: "5px",
                                                            padding: "10px",
                                                            borderRadius: "10px",
                                                        }}
                                                        src='./Images/view.svg'
                                                        alt="View"
                                                    />
                                                </b>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr key={i}>
                                    <td>{item.recruiter.EmpCode}</td>
                                    <td>{item.recruiter.EmployeeName}</td>
                                    <td colSpan={6}>No Candidates</td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
    </tbody>

            </Table>
            
                <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "serif" }} id="example-custom-modal-styling-title">
                            <strong className="me-auto"><img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img> <b style={{ fontSize: "25px", fontFamily: "serif" }}> Claimed Recruiters</b> </strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <center>
                            <Table style={{textAlign:"center"}} responsive  hover>
                                <thead>
                                    <tr>
                                        <th>Employee Code</th>
                                        <th>Employee Name</th>
                                        {/* <th>Email</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        showClaimedUsers.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.EmpCode}</td>
                                                <td>{item.EmployeeName}</td>
                                                {/* <td>{item.Email}</td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </center>
                    </Modal.Body>
                </Modal>

                <Modal show={showA} size="fullscreen"onHide={() => setShowA(false)}dialogClassName="modal-90w"aria-labelledby="example-custom-modal-styling-title" >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Recruiters Actions</b></h5> {/* Displaying single requirement detail */}

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* Filters */}
            <div style={{ marginBottom: '10px' }}>
                 
                
                <input
                    type="search"
                    placeholder="Search by Candidate Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    style={{ padding:"10px",width:"300px",margin:"10px",border:"2px solid black",borderRadius:"20px" }}
                /> <br></br>
                <select style={{padding:"10px",width:"300px",margin:"10px",border:"2px solid black",borderRadius:"20px"}} onChange={(e) => setSelectedCandidateStatus(e.target.value)} value={selectedCandidateStatus}>
                    <option value="">All Statuses</option>
                    {statusSearchOptions.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <Table  bordered hover responsive className="table-sm" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Candidate Name</th>
                        <th>Role</th>
                        <th>ECTC</th>
                        <th>LWD</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecruitersData.map((item, i) => (
                        <React.Fragment key={i}>
                            {item.candidates.length > 0 ? (
                                item.candidates.filter(candidate => {
                                    const recentStatus = candidate.Status && candidate.Status.length > 0
                                        ? candidate.Status[candidate.Status.length - 1].Status
                                        : "No Action Taken";

                                    const matchesStatus = selectedCandidateStatus ? recentStatus === selectedCandidateStatus : true;
                                    const matchesName = candidateName 
                                        ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(candidateName.toLowerCase())
                                        : true;

                                    return matchesStatus && matchesName;
                                }).map((candidate, index) => {
                                    const recentStatus = candidate.Status && candidate.Status.length > 0
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
                                        <tr key={index}>
                                            {index === 0 && (
                                                <td rowSpan={item.candidates.length}>{item.recruiter.EmployeeName}</td>
                                            )}
                                            <td>{candidate.firstName} {candidate.lastName}</td>
                                            <td>{candidate.role}</td>
                                            <td>{candidate.ectc}</td>
                                            <td>{new Date(candidate.lwd).toLocaleDateString()}</td>
                                            <td style={{ color: textColor }}>
                                                <b>{recentStatus}</b>
                                            </td>
                                            <td
                                                style={{ cursor: "pointer", color: "blue" }}
                                                onClick={() => CandidateData(candidate._id)}>
                                                <b>
                                                    <img
                                                        style={{
                                                            backgroundColor: "lightblue",
                                                            margin: "5px",
                                                            padding: "10px",
                                                            borderRadius: "10px",
                                                        }}
                                                        src='./Images/view.svg'
                                                        alt="View"
                                                    />
                                                </b>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr key={i}>
                                    <td>{item.recruiter.EmpCode}</td>
                                    <td>{item.recruiter.EmployeeName}</td>
                                    <td colSpan={6}>No Candidates</td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            </Modal.Body>
            </Modal>

                <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
            <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >RegId:</b>{requirementData.regId}</h5> {/* Displaying single requirement detail */}
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className="table-responsive">
    <Table  bordered hover className="table-sm">
                    <tbody>
                        <tr>
                            <td><b>Client:</b></td>
                            <td>{requirementData.client}</td>
                        </tr>
                        <tr>
                            <td><b>Requirement Type:</b></td>
                            <td>{requirementData.requirementtype}</td>
                        </tr>
                        <tr>
                            <td><b>Type Of Contract:</b></td>
                            <td>{requirementData.typeOfContract}</td>
                        </tr>
                        <tr>
                            <td><b>Start Date:</b></td>
                            <td>{new Date(requirementData.startDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td><b>Duration:</b></td>
                            <td>{requirementData.duration}</td>
                        </tr>
                        <tr>
                            <td><b>Location:</b></td>
                            <td>{requirementData.location}</td>
                        </tr>
                        <tr>
                            <td><b>Source CTC:</b></td>
                            <td>{requirementData.sourceCtc}</td>
                        </tr>
                        <tr>
                            <td><b>Qualification:</b></td>
                            <td>{requirementData.qualification}</td>
                        </tr>
                        <tr>
                            <td><b>YOE:</b></td>
                            <td>{requirementData.yearsExperience}</td>
                        </tr>
                        <tr>
                            <td><b>Relevant YOE:</b></td>
                            <td>{requirementData.relevantExperience}</td>
                        </tr>
                        <tr>
                            <td><b>Skill:</b></td>
                            <td>{requirementData.skill}</td>
                        </tr>
                        <tr>
                            <td><b>Uploaded Date:</b></td>
                            <td>{ new Date(requirementData.uploadedDate).toLocaleDateString()}</td>
                        </tr>

                        {/* Assessment Section */}
                          <tr>
                            <td colSpan="2"><center><label> <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Assessment</b></h5></label></center></td>
                        </tr>
                        {requirementData.assessments && requirementData.assessments.length > 0 ? (
                             requirementData.assessments.map((assessment, index) => (
                             <React.Fragment key={index}>
                                   <tr>
                                       <td><b>Assessment:</b></td>
                                       <td>{assessment.assessment}</td>
                                   </tr>
                                   <tr>
                                       <td><b>YOE:</b></td>
                                       <td>{assessment.yoe}</td>
                                   </tr> <hr></hr>
                               </React.Fragment>
                           ))) : (
                                    <tr>
                                         <td colSpan="2">No assessments available</td>
                                    </tr>
                            )}
                    </tbody>
                </Table>
                </div>
    </Modal.Body>
               </Modal>
           
            <Modal size="lg" show={lagShow} onHide={() => setLagShow(false)} aria-labelledby="example-modal-sizes-title-lg" style={{ backgroundColor: "lightgrey",opacity:"99%" }}>
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidate Details</b></h5> {/* Displaying single requirement detail */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>        
            { candidateDetails && (
    <div className="table-responsive">
    <Table  bordered hover className="table-sm">
        <tbody>
        <tr>
      <td> <Image  src={`https://ornnovabackend.onrender.com/${candidateDetails.candidateImage}`} style={{width:"100px",borderRadius:"100px"}} alt='Candidate Image' ></Image>
      </td>
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
                <td><b>Internal Screening:</b></td>
                <td>{candidateDetails.internalScreening}</td>
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

            <Modal size='lg' show={showEditModal} style={{backgroundColor:"lightgray",opacity:"98%"}} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title><h3>
            <img
              style={{ width: "30px", margin: "10px" }}
              src='/Images/icon.png'
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Edit Requirement</b>
          </h3></Modal.Title>
  </Modal.Header>
  <Modal.Body>
   
  {showEditModal && (
            <div className="edit-requirement-modal">
               <form
  style={{
    backgroundColor: "lightgray",
    padding: "20px",
    borderRadius: "20px",
    maxWidth: "100%",
  }}
  onSubmit={handleSubmit}
>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="client"><strong>Client</strong></label>
      <input
        type="text"
        name="client"
        value={formData.client}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>

    <div style={{ flex: "1", minWidth: "250px" }}>
  <label htmlFor="typeOfContract"><strong>Type of Contract</strong></label>
  <select
    name="typeOfContract"
    value={formData.typeOfContract}
    onChange={handleChange}
    required
    style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
  >
    <option value="">Select Contract Type</option>
    <option value="FTE">FTE</option>
    <option value="C2H">C2H</option>
  </select>
</div>

  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="startDate"><strong>Start Date</strong></label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>

    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="duration"><strong>Duration</strong></label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>
  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="location"><strong>Location</strong></label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>

    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="sourceCtc"><strong>Source CTC</strong></label>
      <input
        type="text"
        name="sourceCtc"
        value={formData.sourceCtc}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>
  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="qualification"><strong>Qualification</strong></label>
      <input
        type="text"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>

    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="yearsExperience"><strong>Years of Experience</strong></label>
      <input
        type="text"
        name="yearsExperience"
        value={formData.yearsExperience}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>
  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="skill"><strong>Skill</strong></label>
      <input
        type="text"
        name="skill"
        value={formData.skill}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>

    <div style={{ flex: "1", minWidth: "250px" }}>
      <label htmlFor="role"><strong>Role</strong></label>
      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />
    </div>
  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    <div style={{ flex: "1", minWidth: "250px" }}>
  <label htmlFor="requirementtype"><strong>Requirement Type</strong></label>
  <select
    name="requirementtype"
    value={formData.requirementtype}
    onChange={handleChange}
    required
    style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
  >
    <option value="">Select Requirement Type</option>
    <option value="Hot">Hot</option>
    <option value="Warm">Warm</option>
    <option value="Cold">Cold</option>
    <option value="Hold">Hold</option>
    <option value="Closed">Closed</option>
  </select>
</div>

  </div>

  <div className="assessments" style={{ marginBottom: "20px" }}> <hr></hr>
<center>
<h3>
            <img
              style={{ width: "30px", margin: "10px" }}
              src='/Images/icon.png'
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Assessment</b>
          </h3></center> 
              {formData.assessments.map((assessment, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: "1", minWidth: "250px" }}>
          <label htmlFor={`assessment-${index}`}><strong>Assessment</strong></label>
          <input
            type="text"
            name="assessment"
            value={assessment.assessment}
            onChange={(e) => handleAssessmentChange(index, e)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <div style={{ flex: "1", minWidth: "250px" }}>
          <label htmlFor={`yoe-${index}`}><strong>Years of Experience</strong></label>
          <input
            type="string"
            name="yoe"
            value={assessment.yoe}
            onChange={(e) => handleAssessmentChange(index, e)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <button
          type="button"
          onClick={() => deleteAssessment(index)}
          style={{
            backgroundColor: "indianred",
            
            padding: "5px",
            borderRadius: "10px",
            border: "none",
            height:"5vh"
          }}
        >
          <img src='./Images/trash.svg'></img>
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addAssessment}
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
      }}
    >
      Add Assessment
    </button>
  </div>

  {/* <button
    type="submit"
    style={{
      backgroundColor: "blue",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      border: "none",
      marginRight: "10px",
    }}
  >
    Update Requirement
  </button> */}

  {/* <button
    type="button"
    onClick={() => setShowEditModal(false)}
    style={{
      backgroundColor: "gray",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      border: "none",
    }}
  >
    Close
  </button> */}
</form>

            </div>
        )}
    
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      <strong>Cancel</strong>
    </Button>
    <Button type="submit" onClick={ handleSubmit}  variant="success"><strong>Save Changes</strong></Button>
  </Modal.Footer>
</Modal>


<Modal size='lg' show={showAssigns} onHide={
  ()=>{setShowAssigns(false);window.location.reload();}}>
        <Modal.Header closeButton>
          <Modal.Title>
          <h3>
            <img
              style={{ width: "30px", margin: "10px" }}
              src='/Images/icon.png'
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Assigned Users</b>
          </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
                    <Table bordered hover responsive style={{textAlign:"center"}}>
                        <thead>
                            <tr>
                              <th>Sno</th>
                                <th>Name</th>
                                <th>User Type</th>
                                <th colSpan={2}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedUserDetails.map((item,index)=>{
                              return(
                                <tr> 
                                   <th scope="row">{index + 1}</th>
                                  <td>{item.name}</td>
                                      <td>{item.userType}</td>
                                      <td><Button style={{borderRadius:"20px"}} variant='success'><b>Assigned</b></Button></td>
                                      <td><Button  onMouseEnter={(e) => e.target.style.backgroundColor = "lightcoral"}
                                                   onMouseLeave={(e) => e.target.style.backgroundColor = "lightsteelblue"} style={{borderRadius:"20px",fontWeight:"bolder",color:"black",border:"0px",backgroundColor:"lightsteelblue"}}  onClick={()=> unassignReqFromUser(item._id)}>Un Assign</Button></td>
                                </tr>)})}
                        </tbody>
                    </Table>   <hr></hr>
                    <h4 style={{textAlign:"center"}}>
            <img
              style={{ width: "30px", margin: "10px" }}
              src='/Images/icon.png'
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Assign Users</b>
          </h4> <hr></hr>
                    <Table bordered hover responsive style={{textAlign:"center"}} >
                <thead>
                    <tr>
                        <th >Sno</th>
                        <th >Name</th>
                        <th >User Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {remainingUsers.length > 0 ? (
                        remainingUsers.map((user, index) => (
                            <tr key={user._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.userType || 'N/A'}</td>
                                <td>
  <Button 
    onClick={() => { assignReqToUser(user._id) }} 
    style={{
      backgroundColor: "lightcoral", 
      border: "0px", 
      borderRadius: "20px", 
      color: "black",
      fontWeight:"bold"
    }} 
    onMouseEnter={(e) => e.target.style.backgroundColor = "lightgreen"}
    onMouseLeave={(e) => e.target.style.backgroundColor = "lightcoral"}
  >
    Assign
  </Button>
</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                No remaining users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>

            </center>
        </div>
    );
}

export default Requirements;
