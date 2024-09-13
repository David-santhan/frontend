import React, { useEffect, useState } from 'react';
import AdminTopNav from './AdminTopNav';
import UserTopNav from './UserTopNav';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Dropdown, DropdownButton, FormCheck, Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Image from 'react-bootstrap/Image';
import CryptoJS from 'crypto-js';


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
    const [showCandidate, setShowCandidate] = useState(false);
    const [recruitersData, setRecruitersData] = useState([]);
    const [requirementData, SetRequirementData] = useState({}); // Changed to object
    const requirementTypes = ['Hot', 'Cold', 'Warm', 'Hold', 'Closed'];
    const [selectedTypes, setSelectedTypes] = useState(['Hot', 'Warm']);

   
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
            const response = await fetch('https://hrbackend-1.onrender.com/getrequirements');
            const data = await response.json();
            SetRequirements(data);

            const counts = {};
            for (let req of data) {
                try {
                    const candidateRes = await axios.get(`https://hrbackend-1.onrender.com/adminviewactions/${req._id}`);
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
                    const response = await axios.get(`https://hrbackend-1.onrender.com/api/requirements/${req._id}/claimedByCount`);
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
            const response = await axios.get(`https://hrbackend-1.onrender.com/api/requirements/${requirementId}/claimedByDetails`);
            setShowClaimedUsers(response.data.claimedUsers);
            setShow(true);
        } catch (error) {
            console.error(`Error fetching claimed users for requirement ${requirementId}:`, error);
        }
    };

    const fetchRecruiterDetails = async (reqId) => {
        try {
            const response = await axios.get(`https://hrbackend-1.onrender.com/api/recruiters/${reqId}`);
            setRecruitersData(response.data.recruiters);
            setShowA(true);
            console.log(response.data)
        } catch (err) {
            toggleShowB();
        }
    };
   
    const fetchCandidates = async (recruiterId, reqId) => {
        try {
            const response = await axios.get('https://hrbackend-1.onrender.com/api/candidates', {
                params: {
                    recruiterId,
                    reqId
                }
            });
            const candidatesData = response.data;
                  
            console.log( candidatesData); // Print the candidate details to the console
            setCandidates(candidatesData); // Store candidates in state if you need to display them
            setShowCandidate(true);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    }
    const requirementDetails = async (id) => {
        try {
            const response = await axios.get(`https://hrbackend-1.onrender.com/getrequirements/${id}`);
            SetRequirementData(response.data); // Ensure this returns an object
            setLgShow(true);
        } catch (err) {
            console.log(err);
        }
    };
    const CandidateData = async(id)=>{
        try {
            const response = await axios.get(`https://hrbackend-1.onrender.com/candidate/${id}`);
           
            console.log(response.data)
                setCandidateDetails(response.data);   
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
            const response = await fetch(`https://hrbackend-1.onrender.com/api/candidates/${candidateId}`, {
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
      
    return (
        <div>
            {localStorageType === "Admin" ? <AdminTopNav /> : <UserTopNav />}
            <center>
                <h2 style={{ fontFamily: "fantasy", fontWeight: "bolder" }}>
                    <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img>Requirements
                </h2>
            </center>
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

            <Table style={{ textAlign: "center" }} responsive="sm">
                <thead>
                    <tr>
                        <th>Reg Id</th>
                        <th>Client</th>
                        <th>Requirement Type</th>
                        <th>No of Profiles</th>
                        <th>No of Claims</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRequirements
                        .filter(item => selectedTypes.length === requirementTypes.length || selectedTypes.includes(item.requirementtype))
                        .map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <Link style={{ textDecoration: "none" }} onClick={() => requirementDetails(item._id)}>
                                        <b>{item.regId}</b>
                                    </Link>
                                </td>
                                <td>{item.client}</td>
                                <td>{item.requirementtype}</td>
                                <td>
                                    <Link style={{ textDecoration: "none" }} onClick={() => fetchRecruiterDetails(item._id)}>
                                        <b style={{ backgroundColor: "lightgray", borderRadius: "8px", padding: "9px", color: "black" }}>
                                            {candidateCounts[item._id] || 0}
                                        </b>
                                    </Link>
                                </td>
                                <td>
                                    <Link style={{ textDecoration: "none" }} onClick={() => fetchClaimedUsersDetails(item._id)}>
                                        <b style={{ backgroundColor: "lightsteelblue", borderRadius: "8px", padding: "9px", color: "black" }}>
                                            {claimedByCounts[item._id]}
                                        </b>
                                    </Link>
                                </td>
                            </tr>
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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Employee Code</th>
                                        <th>Employee Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        showClaimedUsers.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.EmpCode}</td>
                                                <td>{item.EmployeeName}</td>
                                                <td>{item.Email}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </center>
                    </Modal.Body>
                </Modal>

                <Modal show={showA} size="lg"onHide={() => setShowA(false)}dialogClassName="modal-90w"aria-labelledby="example-custom-modal-styling-title" >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Recruiters Actions</b></h5> {/* Displaying single requirement detail */}

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="table-responsive">
            <Table striped bordered hover className="table-sm">
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Uploads</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recruitersData.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.recruiter.EmpCode}</td>
                                    <td>{item.recruiter.EmployeeName}</td>
                                    <td>{item.recruiter.Email}</td>
                                    <td
                                        style={{ cursor: "pointer", color: "blue" }}
                                        onClick={() => fetchCandidates(item.recruiter._id,item.regId)}>
                                        <b>{item.candidateCount}</b>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                </div>
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
            <Modal show={showCandidate} onHide={() => setShowCandidate(false)} fullscreen={true} dialogClassName="modal-90w" aria-labelledby="candidates-modal-title">
                <Modal.Header closeButton>
                    <Modal.Title id="candidates-modal-title">
                        <strong className="me-auto">
                        <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidates Details</b></h5>
                        </strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered hover>
                    <thead style={{textAlign:"center"}}>
                        <tr>
                            <th>Sno</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Uploaded On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{textAlign:"center"}}>
                        {candidates.map((candidate,index) => (
                            <tr key={candidate.id}>
                                <td>{index + 1}</td>
                                <td>{candidate.firstName}{candidate.lastName}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.mobileNumber}</td>
                                <td>{new Date(candidate.uploadedOn).toLocaleDateString()}</td>
                                <td>
                                <Link onClick={()=> CandidateData(candidate._id)} >
                        <Image style={{ backgroundColor: "lightblue", margin: "10px", padding: "10px", borderRadius: "10px" }} src='/Images/view.svg' />
                      </Link>
                      <Link onClick={()=> handleDeleteClick(candidate._id)} >
                        <Image style={{ backgroundColor: "IndianRed", margin: "10px", padding: "10px", borderRadius: "10px" }} src='/Images/trash.svg' />
                      </Link>
                      {/* <Link>
                        <Image style={{ backgroundColor: "lightgreen", padding: "10px", margin: "10px", borderRadius: "10px" }} src='/Images/edit.svg' />
                      </Link> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={lagShow} onHide={() => setLagShow(false)} aria-labelledby="example-modal-sizes-title-lg" style={{ backgroundColor: "lightgrey",opacity:"97%" }}>
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Candidate Details</b></h5> {/* Displaying single requirement detail */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            { candidateDetails && (
    <div className="table-responsive">
    <Table striped bordered hover className="table-sm">
        <tbody>
        <tr>
      <td> <Image  src={`https://hrbackend-1.onrender.com/${candidateDetails.candidateImage}`} style={{width:"100px",borderRadius:"100px"}} alt='Candidate Image' ></Image>
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
            <tr>
                <td><b>Internal Screening:</b></td>
                <td>{candidateDetails.internalScreening}</td>
            </tr>
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
            <tr>
                <td><b>Shared With Client:</b></td>
                <td>{candidateDetails.sharedWithClient}</td>
            </tr>
            <tr>
      <td><strong>Candidate Resume:</strong></td>
    <td>
  {typeof candidateDetails.updatedResume === 'string' ? (
    <div style={{ marginBottom: '5px' }}>
      <a href={`https://hrbackend-1.onrender.com/${candidateDetails.updatedResume}`} target="_blank" rel="noopener noreferrer">
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
      <a href={`https://hrbackend-1.onrender.com/${candidateDetails.ornnovaProfile}`} target="_blank" rel="noopener noreferrer">
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
            </center>
        </div>
    );
}

export default Requirements;
