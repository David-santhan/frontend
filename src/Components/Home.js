import React, { useEffect, useState } from 'react';
import UserTopNav from './UserTopNav';
import { Table, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import TeamLeadTopNav from './TeamLeadTopNav';
import CryptoJS from 'crypto-js';





function Home() {
  const localStoreStatusType = localStorage.getItem("User Type");
  const [requirements, setRequirements] = useState([]);
  const [claimedData, setClaimedData] = useState([]);
  const [candidateCounts, setCandidateCounts] = useState({});
  const [sortedRequirements, setSortedRequirements] = useState([]);
  const [sortedClaimRequirements, setSortedClaimRequirements] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortUploadedOrder, setSortUploadedOrder] = useState('asc');
  const [sortClaimOrder, setSortClaimOrder] = useState('asc');
  const [sortClaimedDateOrder, setSortClaimedDateOrder] = useState('asc'); 
  const [requirementData, SetRequirementData] = useState({}); // Changed to object
  const [lgShow, setLgShow] = useState(false);
  const [show, setShow] = useState(false);
  const [viewCandidate,setViewCandidate] = useState(false);
  const [updateshow, setUpdateshow] = useState(false);
  const [candidateData,setCandidateData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(['hot', 'warm']);
  const [candidatesData,setCandidatesData] = useState([]);
  let JWT_SECRET="ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar"
   // State to hold the search terms
   const [nameSearchTerm, setNameSearchTerm] = useState("");
   const [statusSearchTerm, setStatusSearchTerm] = useState("");

   // Status options
   const statusOptions = [
       'Ornnova Screen Selected', 'Shared with Client', 'Client Rejected', 
       'L1 Pending', 'L1 Selected', 'L1 Rejected', 'L2 Pending', 
       'L2 Selected', 'L2 Rejected', 'Onboard Confirmation', 
       'On Boarded', 'Rejected', 'Declined'
   ];

   // Filtered candidates based on the search terms
   const filteredCandidates = candidateData.filter(item => {
       const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
       const recentStatus = item.Status && item.Status.length > 0
           ? item.Status[item.Status.length - 1].Status.toLowerCase() // Get the most recent status
           : "no status"; // Default if no status

       return (
           fullName.includes(nameSearchTerm.toLowerCase()) &&
           (statusSearchTerm ? recentStatus === statusSearchTerm.toLowerCase() : true)
       );
   });

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

  // Function to handle the view button click
  const handleViewClick = (candidate) => {
    
  };
 

  const userId = getDecryptedData("Id");

  function handleShow() {
    // setFullscreen();
    setShow(true);
  }
  function handleUpdateShow() {
    
    setUpdateshow(true);
  }
  function handleUpdateClose () {setUpdateshow(false);}
  const onHide = () => {
    setShow(false);
  };

  useEffect(() => {
    fetchRequirements(userId);
  }, [userId]);

  useEffect(() => {
    sortRequirements();
  }, [requirements, sortOrder, sortUploadedOrder]);

  useEffect(() => {
    sortClaimedRequirements();
  }, [claimedData, sortClaimOrder]);

  const fetchRequirements = async (userId) => {
    try {
      const response = await axios.get(`https://hrbackend-1.onrender.com/getHomeReqData/${userId}`);
      // const data = await response.json();
      const data = response.data;
      const newData = data.filter(req => req.update === 'New' && !req.claimedBy.some(claim => claim.userId === userId));
      const claimedData = data.filter(req => req.update === 'Old' || req.claimedBy.some(claim => claim.userId === userId));
      setRequirements(newData);
      setClaimedData(claimedData);
    
      // Fetch candidate counts
      const counts = {};
      for (let req of claimedData) {
        try {
          const res = await axios.get(`https://hrbackend-1.onrender.com/viewactions/${req._id}/${userId}`);
          counts[req._id] = res.data.candidates.length || 0;
        } catch (err) {
          // console.error(`Error fetching candidates for ${req._id}:`, err);
          counts[req._id] = 0;
        }
      }
      setCandidateCounts(counts);
    } catch (err) {
      console.error('Error fetching requirements:', err);
    }
  };

  const requirementTypeOrder = {
    'Hot': 1,
    'Warm': 2,
    'Cold': 3,
    'Hold': 4,
    'Closed': 5
  };

  const sortRequirements = () => {
    const sorted = [...requirements].sort((a, b) => {
      const typeOrderA = requirementTypeOrder[a.requirementtype] || 6;
      const typeOrderB = requirementTypeOrder[b.requirementtype] || 6;

      if (typeOrderA !== typeOrderB) {
        return typeOrderA - typeOrderB;
      }

      if (sortOrder === 'asc') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else {
        return new Date(b.startDate) - new Date(a.startDate);
      }
    });
    setSortedRequirements(sorted);
  };

  const sortClaimedRequirements = () => {
    const sorted = [...claimedData].sort((a, b) => {
      const typeOrderA = requirementTypeOrder[a.requirementtype] || 6;
      const typeOrderB = requirementTypeOrder[b.requirementtype] || 6;

      if (typeOrderA !== typeOrderB) {
        return typeOrderA - typeOrderB;
      }

      if (sortClaimOrder === 'asc') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else {
        return new Date(b.startDate) - new Date(a.startDate);
      }
    });
    setSortedClaimRequirements(sorted);
  };

  const handleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  const handleUploadedSort = () => setSortUploadedOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  const handleClaimSort = () => setSortClaimOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  const handleSortClaimedDate = () => {
    setSortClaimedDateOrder(sortClaimedDateOrder === 'asc' ? 'desc' : 'asc');
  };

    // Sort the requirements based on claimed date
    const sortedClaimedDateRequirements = sortedClaimRequirements.sort((a, b) => {
      const dateA = new Date(a.claimedBy.find(claim => claim.userId === userId)?.claimedDate);
      const dateB = new Date(b.claimedBy.find(claim => claim.userId === userId)?.claimedDate);
  
      return sortClaimedDateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  const updateClaim = async (id) => {
    const user = {
      userId,
      claimedDate: new Date(),
    };

    try {
      const response = await fetch(`https://hrbackend-1.onrender.com/claim/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (result.status === "Success") {
        alert(result.msg);
        fetchRequirements(); // Refresh the requirements list
        window.location.reload();
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      alert('Error updating claim. Please try again later.');
    }
  };

  const viewCandidates = async(id)=>{
    try {
      const response = await axios.get(`https://hrbackend-1.onrender.com/viewactions/${id}/${userId}`)
      setCandidateData(response.data.candidates);
      handleShow()
    } catch (error) {
      alert("No Candidates")
    }
  }

  const handleCheckboxChange = (type) => {
    if (type === 'all') {
        if (selectedTypes.includes('all')) {
            setSelectedTypes([]); // Deselect all
        } else {
            setSelectedTypes(requirementTypes); // Select all types
        }
    } else {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== type));
        } else {
            // Remove 'all' if a specific type is selected
            setSelectedTypes([...selectedTypes.filter((t) => t !== 'all'), type]);
        }
    }
};

// Update the dropdown title based on selected types
const getDropdownTitle = () => {
    if (selectedTypes.length === 0) {
        return 'Select Requirement Types';
    }
    if (selectedTypes.length === requirementTypes.length) {
        return 'All';
    }
    return selectedTypes.join(', ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const ViewCandidateData = async(id)=>{
  try {
      const response = await axios.get(`https://hrbackend-1.onrender.com/candidate/${id}`);
     
      setSelectedCandidate(response.data);
      console.log(selectedCandidate)
          setViewCandidate(true)
  } catch (error) {
      console.error('Error fetching candidates:', error);
  } 
}

  const handleDeleteClick = async (candidateId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this candidate?');
  
    if (confirmDelete) {
      try {
        const response = await fetch(`https://hrbackend-1.onrender.com/api/candidates/${candidateId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setCandidateData(candidateData.filter(candidate => candidate._id !== candidateId));
          alert('Candidate deleted successfully');
          window.location.reload();
        } else {
          alert('Failed to delete candidate');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('An error occurred while trying to delete the candidate');
      }
    } else {
      // User chose not to delete
      alert('Candidate deletion canceled');
    }
  };

  const updateCandidate = async(id)=>{
    try {
      const response = await axios.get(`https://hrbackend-1.onrender.com/candidate/${id}`)
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

  const handleSaveChanges = async () => {
    const candidateId = updateCandidateDetails._id; // Assuming _id is the identifier for the candidate

    try {
      const response = await axios.put(`https://hrbackend-1.onrender.com/candidates/${candidateId}`, updateCandidateDetails);

      if (response.status === 200) {
        alert('Candidate details updated successfully ✅');
        setUpdateshow(false) // Close the modal after successful update
        window.location.reload();
      } else {
        alert('Failed to update candidate details.');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('An error occurred while updating candidate details.');
    }
  };
  const requirementDetails = async (id) => {
    try {
        const response = await axios.get(`https://hrbackend-1.onrender.com/getrequirements/${id}`);
        SetRequirementData(response.data); // Ensure this returns an object
        setLgShow(true);
    } catch (err) {
        console.log(err);
    }
};
  const requirementTypes = [ 'hot', 'warm', 'cold','hold','closed'];
  return (
    <div>
      <UserTopNav/>
     
      <center>
        <h2 style={{ margin: "10px", fontFamily: "initial", fontWeight: "bold" }}>
          <img style={{ width: "30px", margin: "10px", borderRadius: "50px" }} src='/Images/icon.png' alt='icon' />
          New Requirements
        </h2>
        <Table style={{ textAlign: "center" }} responsive="sm">
          <thead>
            <tr>
              <th>Reg Id</th>
              <th>Client</th>
              <th>Requirement Type</th>
              <th>
                <button style={{ borderRadius: "20px" }} onClick={handleSort}>
                  <b>Start Date</b> {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                </button>
              </th>
              <th>
                <button style={{ borderRadius: "20px" }} onClick={handleUploadedSort}>
                  <b>Uploaded On</b> {sortUploadedOrder === 'asc' ? '⬆️' : '⬇️'}
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequirements.map((req, index) => (
              <tr key={index}>
                <td>{req.regId}</td>
                <td>{req.client}</td>
                <td>{req.requirementtype}</td>
                <td>{new Date(req.startDate).toLocaleDateString()}</td>
                <td>{new Date(req.uploadedDate).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => updateClaim(req._id)} style={{ border: "1px solid gray", backgroundColor: "lightgreen", borderRadius: "20px" }}>
                    <b>Claim</b>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </center>
      <hr />
      <center>
            <h2 style={{ margin: '10px', fontFamily: 'initial', fontWeight: 'bold' }}>
                <img
                    style={{ width: '30px', margin: '10px', borderRadius: '50px' }}
                    src='/Images/icon.png'
                    alt='icon'
                />
                Claimed Requirements
            </h2>

            {/* Custom Dropdown with Checkbox Options */}
            <div style={{ marginBottom: '10px' }}>
                <DropdownButton
                    title={getDropdownTitle()}
                    variant="outline-secondary"
                    id="dropdown-checkbox"
                    style={{ width: '300px', fontWeight: "bolder", fontSize: "18px", textAlign: "center" }}
                >
                    {/* 'All' Option */}
                    <Dropdown.Item
                        as="div"
                        key="all"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontWeight: "bold" }}
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
                            style={{ fontWeight: "bold" }}
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

            <Table style={{ textAlign: 'center' }} responsive="sm">
                <thead>
                    <tr>
                        <th>Reg Id</th>
                        <th>Client</th>
                        <th>Requirement Type</th>
                        <th>
                            <button style={{ border: "1.5px solid black", borderRadius: "20px" }} onClick={handleSortClaimedDate}>
                                <b>Claimed On</b> {sortClaimedDateOrder === 'asc' ? '⬆️' : '⬇️'}
                            </button>
                        </th>
                        <th>Uploads</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedClaimedDateRequirements
                        .filter((req) => {
                            const reqType = req.requirementtype.toLowerCase();

                            // If 'All' is selected, show all types
                            if (selectedTypes.includes('all')) {
                                return true;
                            }

                            // Otherwise, filter based on selected requirement types
                            return selectedTypes.includes(reqType);
                        })
                        .map((req, index) => {
                            const userClaim = req.claimedBy.find((claim) => claim.userId === userId);
                            const count = candidateCounts[req._id] || 0;
                            const countColor = count > 5 ? 'MediumSeaGreen' : count >= 3 ? 'rgb(255, 200, 0)' : 'indianred';
                            const buttonColor = count > 5 ? 'MediumSeaGreen' : count >= 3 ? 'rgb(255, 200, 0)' : 'indianred';
                            const textColor = buttonColor === '' ? 'black' : 'white';

                            return (
                                <tr key={index}>
                                    <td><Link style={{ textDecoration: "none" }} onClick={() => requirementDetails(req._id)}><b>{req.regId}</b></Link></td>
                                    <td>{req.client}</td>
                                    <td>{req.requirementtype}</td>
                                    <td>{userClaim ? new Date(userClaim.claimedDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <Link onClick={() => viewCandidates(req._id)} style={{ textDecoration: 'none' }}>
                                            <b
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    margin: '10px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: countColor,
                                                    borderRadius: '90px',
                                                    border: '1.5px solid black',
                                                    padding: '8px',
                                                    color: 'white',
                                                }}
                                            >
                                                {count}
                                            </b>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/UserAction/${req._id}/${userId}`}>
                                            <Button style={{ border: '1px solid gray',backgroundColor: buttonColor,borderRadius: '20px',color: textColor,}}>
                                                <b>Take Action</b>
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </center>
      <Modal
      show={show}
      onHide={() => {
        setSelectedCandidate(null); // Reset selected candidate on modal close
        onHide();
      }}
      fullscreen={true}
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidates Details</b></h5> {/* Displaying single requirement detail */}
          </Modal.Title>
      </Modal.Header>

      <Modal.Body>
       {/* Name Search Input Field */}
       <input
                type="text"
                placeholder="Search by name..."
                value={nameSearchTerm}
                onChange={(e) => setNameSearchTerm(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", width: "300px",border:"2px solid black",borderRadius:"20px" }}
            /> <br></br>

            {/* Status Selection Dropdown */}
            <select
                value={statusSearchTerm}
                onChange={(e) => setStatusSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", padding: "10px", width: "300px",border:"2px solid black",borderRadius:"20px" }}
            >
                <option value="">All</option> {/* Default option */}
                {statusOptions.map((status, index) => (
                    <option key={index} value={status.toLowerCase()}>{status}</option>
                ))}
            </select>

            <Table responsive style={{textAlign:"center"}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Total YOE</th>
                        <th>LWD</th>
                        <th>ECTC</th>
                        <th>Status</th>
                        <th>Uploaded On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.map((item, index) => {
                        // Get the most recent status
                        const recentStatus = item.Status && item.Status.length > 0
                            ? item.Status[item.Status.length - 1].Status
                            : "No Status";

                        // Determine the text color based on the status
                        let textColor;
                        if (["Client Rejected", "L1 Rejected", "L2 Rejected", "Rejected", "Declined"].includes(recentStatus)) {
                            textColor = "red"; // Rejected statuses
                        } else if (["Shared with Client", "L1 Pending", "L2 Pending"].includes(recentStatus)) {
                            textColor = "orange"; // Pending statuses
                        } else if (recentStatus === "No Status") {
                            textColor = "blue"; // No status
                        } else {
                            textColor = "green"; // Other statuses
                        }

                        return (
                            <tr key={index}>
                                <td>{item.firstName} {item.lastName}</td>
                                <td>{item.role}</td>
                                <td>{item.totalYoe}</td>
                                <td>{new Date(item.lwd).toLocaleDateString()}</td>
                                <td>{item.ectc}</td>
                                <td style={{ color: textColor }}>
                                    <b>{recentStatus}</b> {/* Display the most recent status */}
                                </td>
                                <td>{new Date(item.uploadedOn).toLocaleDateString()}</td>
                                <td>
                                    <Link onClick={() => ViewCandidateData(item._id)}>
                                        <Image style={{ backgroundColor: "lightblue", margin: "10px", padding: "10px", borderRadius: "10px" }} src='/Images/view.svg' />
                                    </Link>
                                    <Link onClick={() => handleDeleteClick(item._id)}>
                                        <Image style={{ backgroundColor: "IndianRed", margin: "10px", padding: "10px", borderRadius: "10px" }} src='/Images/trash.svg' />
                                    </Link>
                                    <Link onClick={() => updateCandidate(item._id)}>
                                        <Image style={{ backgroundColor: "lightgreen", padding: "10px", margin: "10px", borderRadius: "10px" }} src='/Images/edit.svg' />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
      </Modal.Body>
    </Modal>
    <center>
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
                                src={`https://hrbackend-1.onrender.com/${updateCandidateDetails.candidateImage}`}
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
                    <h3> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Assessment Details</b></h3> {/* Displaying single requirement detail */}
                    {updateCandidateDetails.assessments.map((assessment, index) => (
                            <div key={index} className="form-group">
                                <label><strong>Assessment {index + 1}:</strong></label>
                                <input
                                readOnly
                                    type="text"
                                    className="form-control"
                                    value={assessment.assessment}
                                    onChange={(e) => handleAssessmentChange(index, 'assessment', e.target.value)}
                                />
                                <label><strong>Years of Experience:</strong></label>
                                <input
                                readOnly
                                    type="text"
                                    className="form-control"
                                    value={assessment.yoe}
                                    onChange={(e) => handleAssessmentChange(index, 'yoe', e.target.value)}
                                />
                                <label><strong>Score:</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={assessment.score}
                                    onChange={(e) => handleAssessmentChange(index, 'score', e.target.value)}
                                /> <hr></hr>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button style={{borderRadius:"20px",backgroundColor:"lightsteelblue",color:"green",border:"1.5px solid black"}} onClick={handleSaveChanges}>
          <b>Save Changes</b>
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
            <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >RegId:</b>{requirementData.regId}</h5> {/* Displaying single requirement detail */}
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className="table-responsive">
    <Table striped bordered hover className="table-sm">
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


               <Modal
        size="lg"
        show={viewCandidate}
        onHide={() => setViewCandidate(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          <h5>
            <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img>
            <b style={{ fontFamily: "monospace" }}>Candidate Details</b>
          </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {viewCandidate && selectedCandidate && (
        <div>
          {/* Your existing code to display the selected candidate's details goes here */}
          <Table striped bordered hover className="table-sm">
            <tbody>
              <tr>
                <td>
                  <Image
                    src={`https://hrbackend-1.onrender.com/${selectedCandidate.candidateImage}`}
                    style={{ width: "100px", borderRadius: "100px" }}
                    alt="Candidate Image"
                  />
                </td>
                <td>
                  <center>
                    <strong>Update Status</strong> <hr></hr>
                    {selectedCandidate.Status && Array.isArray(selectedCandidate.Status) && selectedCandidate.Status.length > 0 ? (
    selectedCandidate.Status.map((item, index) => (
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
      <td colSpan={2}>No Action Taken</td>
    </tr>
  )}
                  </center>
                </td>
              </tr>
              {/* Rest of your candidate details as in your provided code */}
              <tr>
                <td><b>Candidate Name</b></td>
                <td>{selectedCandidate.firstName} {selectedCandidate.lastName}</td>
              </tr>
<tr>
    <td><b>Email:</b></td>
    <td>{selectedCandidate.email}</td>
</tr>
<tr>
    <td><b>Date of Birth:</b></td>
    <td>{new Date(selectedCandidate.dob).toLocaleDateString()}</td>
</tr>
<tr>
    <td><b>Mobile Number:</b></td>
    <td>{selectedCandidate.mobileNumber}</td>
</tr>
{/* Uncomment the following if client information is needed
<tr>
    <td><b>Client:</b></td>
    <td>{candidateDetails.client}</td>
</tr>
*/}
<tr>
    <td><b>Skills:</b></td>
    <td>{selectedCandidate.candidateSkills}</td>
</tr>
<tr>
    <td><b>CTC:</b></td>
    <td>{selectedCandidate.ctc}</td>
</tr>
<tr>
    <td><b>Expected CTC:</b></td>
    <td>{selectedCandidate.ectc}</td>
</tr>
<tr>
    <td><b>Educational Qualification:</b></td>
    <td>{selectedCandidate.educationalQualification}</td>
</tr>
<tr>
    <td><b>Total YOE:</b></td>
    <td>{selectedCandidate.totalYoe}</td>
</tr>
<tr>
    <td><b>Relevant YOE:</b></td>
    <td>{selectedCandidate.relevantYoe}</td>
</tr>
<tr>
    <td><b>Current Location:</b></td>
    <td>{selectedCandidate.currentLocation}</td>
</tr>
<tr>
    <td><b>Preferred Location:</b></td>
    <td>{selectedCandidate.prefLocation}</td>
</tr>
<tr>
    <td><b>Current Organization:</b></td>
    <td>{selectedCandidate.currentOrg}</td>
</tr>
<tr>
    <td><b>Role:</b></td>
    <td>{selectedCandidate.role}</td>
</tr>
<tr>
    <td><b>Resignation Served:</b></td>
    <td>{selectedCandidate.resignationServed}</td>
</tr>
<tr>
    <td><b>Last Working Date:</b></td>
    <td>{new Date(selectedCandidate.lwd).toLocaleDateString()}</td>
</tr>
{/* Uncomment the following if status information is needed
<tr>
    <td><b>Status:</b></td>
    <td>{candidateDetails.Status}</td>
</tr>
*/}
<tr>
    <td><b>Offer In Hand:</b></td>
    <td>{selectedCandidate.offerInHand}</td>
</tr>
<tr>
    <td><b>Interview Date:</b></td>
    <td>{new Date(selectedCandidate.interviewDate).toLocaleDateString()}</td>
</tr>
<tr>
    <td><b>Details:</b></td>
    <td>{selectedCandidate.details}</td>
</tr>
<tr>
    <td><b>Feedback:</b></td>
    <td>{selectedCandidate.feedback}</td>
</tr>
<tr>
    <td><b>Remark:</b></td>
    <td>{selectedCandidate.remark}</td>
</tr>
{/* Uncomment the following if shared with client information is needed
<tr>
    <td><b>Shared With Client:</b></td>
    <td>{candidateDetails.sharedWithClient}</td>
</tr>
*/}
<tr>
    <td><strong>Candidate Resume:</strong></td>
    <td>
        {typeof selectedCandidate.updatedResume === 'string' ? (
            <div style={{ marginBottom: '5px' }}>
                <a href={`https://hrbackend-1.onrender.com/${selectedCandidate.updatedResume}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                </a>
            </div>
        ) : (
            'No PDFs available.'
        )}
    </td>
</tr>
<tr>
    <td><strong>Ornnova Profile:</strong></td>
    <td>
        {typeof selectedCandidate.ornnovaProfile === 'string' ? (
            <div style={{ marginBottom: '5px' }}>
                <a href={`https://hrbackend-1.onrender.com/${selectedCandidate.ornnovaProfile}`} target="_blank" rel="noopener noreferrer">
                    View Ornnova Profile
                </a>
            </div>
        ) : (
            'No PDFs available.'
        )}
    </td>
</tr>
<tr>
    <td colSpan="2">
        <center>
            <h5>
                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                <b style={{ fontFamily: "monospace" }}>Assessment</b>
            </h5>
        </center>
    </td>
</tr>
{
    selectedCandidate.assessments && Array.isArray(selectedCandidate.assessments) && selectedCandidate.assessments.length > 0 ? (
        selectedCandidate.assessments.map((item, index) => (
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
                </tr>
                <tr>
                    <td colSpan={2}><hr /></td>
                </tr>
            </React.Fragment>
        ))
    ) : (
        <tr>
            <td colSpan={2}>No assessments available.</td>
        </tr>
    )
}            </tbody>
          </Table>
        </div>
      )}

        </Modal.Body>
      </Modal>

    </center>
    </div>
  );
}

export default Home;
