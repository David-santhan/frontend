import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Img from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Modal from 'react-bootstrap/Modal';
import { Table,Image, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';




function TeamLeadTopNav() {

    let JWT_SECRET="ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar"
    const [show, setShow] = useState(false);
    const [showCandidateDetailsHome,setShowCandidateDetailsHome]= useState([]);
    const [viewReq, setViewReq] = useState([]);
  const [showReq, setShowReq] = useState(false); 
const [showEditModal, setShowEditModal] = useState(false);
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


const fetchRequirement = async (id) => {
  try {
      const response = await fetch(`https://hrbackend-2.onrender.com/getrequirements/${id}`);
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
      const response = await axios.put(`https://hrbackend-2.onrender.com/editRequirement/${formData.id}`, formData); // Use the correct ID and data
      alert("Updated Successfully ✅"); // Ensure your API returns a message
      setShowEditModal(false); // Close the modal after successful update
      // Optionally, refresh the requirements list or update the UI accordingly
  } catch (err) {
      console.error(err);
      alert("Error updating requirement.");
  }
};



  const viewRequirement = async (id) => {
    let reqOption = {
      method: 'GET',
    };
    try {
      let JSONData = await fetch(`https://hrbackend-2.onrender.com/getrequirements/${id}`, reqOption);
      let JSOData = await JSONData.json();
      
      setViewReq([JSOData]); // Wrap in an array to iterate properly in the table
      setShowReq(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    let navigate = useNavigate();
   
    const [loginUserData, setLoginUserData] = useState([]);

    const userData = async (email) => {
        let reqOption = {
            method: "GET",
        };
        let JSONData = await fetch(`https://hrbackend-2.onrender.com/loggedinuserdata/${email}`, reqOption);
        let JSOData = await JSONData.json();
        setLoginUserData(JSOData);
    };
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
  const localStoreEmpName = getDecryptedData("Name");
  const localStoreProfile = getDecryptedData("ProfilePic");
  const localStoreEmail = getDecryptedData("Email");
  const userId = getDecryptedData("Id");
    const logout = () => {
        localStorage.removeItem("isLogedin");
        localStorage.removeItem("Name");
        localStorage.removeItem("Employee Code");
        localStorage.removeItem("Email");
        localStorage.removeItem("User Type");
        localStorage.removeItem("ProfilePic");
        localStorage.removeItem("Status");
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        userData(localStoreEmail);
        if (localStoreEmpName && localStoreProfile) {
            // Do nothing
        } else {
            navigate("/");
        }
    }, []);

    const requirementDetailsWithAssignedUsers = async () => {
        let reqOption = {
            method: "GET"
        };
        const response = await fetch(`https://hrbackend-2.onrender.com/requirementDetailsWithAssignedUsers/${userId}`, reqOption);
        let data = await response.json();
        setShowCandidateDetailsHome(data);
        // console.log(data)    
      };
      
      useEffect(()=>{
        requirementDetailsWithAssignedUsers();
      })

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
          const response = await fetch(`https://hrbackend-2.onrender.com/deleteRequirement/${id}`, {
            method: 'DELETE',
          });
    
          const result = await response.json();
    
          if (response.ok) {
            console.log(`Requirement deleted successfully ✅`);
            // Optionally, refresh the page or update the UI here
          } else {
            console.error(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error("Error deleting requirement:", error);
        }
      };
    // State for search input
  const [searchTerm, setSearchTerm] = useState('');

  // Filter requirements based on client name
  const filteredRequirements = showCandidateDetailsHome.filter((req) =>
    req.requirementDetails.client.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
            {loginUserData.map((item) => (
                <Navbar expand="lg" className="bg-body-tertiary" key={item._id}>
                    <Container fluid>
                        <Navbar.Brand href="/TLHome">
                            <Img src='/Images/LOGO_ORNNOVA.avif' style={{ width: "200px" }} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-`}>
                                    <a href="/TLHome">
                                        <Img src='/Images/LOGO_ORNNOVA.avif' style={{ width: "200px", borderRadius: "50px" }} />
                                    </a>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-center flex-grow-1 pe-3">
                                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Requirements">
                                        <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/TLNewReq"><b>Add New Requirement</b></NavDropdown.Item>
                                        <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", marginTop: "10px", textAlign: "center" }} onClick={handleShow} ><b>Requirements</b></NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Users">
                                        <NavDropdown.Item disabled style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/AdminCreateUser"><b>Create User</b></NavDropdown.Item>
                                        <NavDropdown.Item disabled  style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center", marginTop: "10px" }} href="/Users"><b>Users</b></NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Clients">
                                        <NavDropdown.Item disabled style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/CreateClient"><b>Create Client</b></NavDropdown.Item>
                                        <NavDropdown.Item  style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center", marginTop: "10px" }} href="/TeamClient"><b>Clients</b></NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                                <Nav>
                                    <Navbar.Brand href="/Profile">
                                        <Img src={`https://hrbackend-2.onrender.com/${item.ProfilePic}`} style={{ width: "70px", borderRadius: "50px", margin: '10px' }} />
                                    </Navbar.Brand>
                                    <Navbar.Text style={{ margin: "5px" }}>
                                        <b style={{ color: "black", textDecoration: "underline", fontFamily: "initial" }}>Welcome:</b>
                                        <b style={{ fontFamily: "fantasy" }}> {item.EmployeeName}</b>
                                    </Navbar.Text>
                                    <Button onClick={logout} style={{ width: "45px", height: "45px", margin: "10px", backgroundColor: "lightgray", color: "red", fontWeight: "bold", borderRadius: "90px", border: "1.5px solid indianred", fontSize: "small" }}>
                                        <Img src='/Images/logout.svg' style={{ width: "130%" }} />
                                    </Button>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}

<Modal size='fullscreen' show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>
            <img
              style={{ width: "30px", margin: "10px" }}
              src='/Images/icon.png'
              alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Requirements</b>
          </h3>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search input */}
        <FormControl
        style={{width:"300px",padding:"10px",border:"2px inset black",borderRadius:"20px"}}
          type="text"
          placeholder="🔍 Search by Client Name"
          className="mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequirements.map((req, index) => (
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
                  <Link onClick={() => handleDelete(req.requirementDetails._id)}>
                    <Image style={{ backgroundColor: "IndianRed", padding: "10px", borderRadius: "10px" }} src='./Images/trash.svg' />
                  </Link>
                  </td>
                  <td>
                  <Link onClick={() => fetchRequirement(req.requirementDetails._id)}>
                    <Image style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "10px" }} src='./Images/edit.svg' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
   
  <Form style={{backgroundColor:"lightgray",padding:"10px",borderRadius:"20px"}} onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="client">
                            <Form.Label><strong>Client</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
    <Form.Group controlId="typeOfContract">
        <Form.Label><strong>Type of Contract</strong></Form.Label>
        <Form.Control
            as="select"  // Change the input type to a select
            name="typeOfContract"
            value={formData.typeOfContract}
            onChange={handleChange}
            required
        >
            <option value="">Select Type of Contract</option> {/* Placeholder option */}
            <option value="C2H">C2H</option>
            <option value="FTE">FTE</option>
        </Form.Control>
    </Form.Group>
</Col>

                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <Form.Label><strong>Start Date</strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="duration">
                            <Form.Label><strong>Duration</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="location">
                            <Form.Label><strong>Location</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="sourceCtc">
                            <Form.Label><strong>Source CTC</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="sourceCtc"
                                value={formData.sourceCtc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="qualification">
                            <Form.Label><strong>Qualification</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="yearsExperience">
                            <Form.Label><strong>Years of Experience</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="relevantExperience">
                            <Form.Label><strong>Relevant Experience</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="relevantExperience"
                                value={formData.relevantExperience}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
    <Form.Group controlId="skill">
        <Form.Label><strong>Skill</strong></Form.Label>
        <Form.Control
            as="textarea"  // Change the input type to a textarea
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            required
            rows={3}  // Optional: Set the number of visible text lines
        />
    </Form.Group>
</Col>

                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="role">
                            <Form.Label><strong>Role</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
    <Form.Group controlId="requirementtype">
        <Form.Label><strong>Requirement Type</strong></Form.Label>
        <Form.Control
            as="select"  // Change the input type to a select
            name="requirementtype"
            value={formData.requirementtype}
            onChange={handleChange}
            required
        >
            <option value="hot">Hot</option>
            <option value="cold">Cold</option>
            <option value="warm">Warm</option>
            <option value="hold">Hold</option>
            <option value="closed">Closed</option>
        </Form.Control>
    </Form.Group>
</Col>

                </Row> <hr></hr>

                <center><h3><img style={{ width: "30px", margin: "10px" }}src='/Images/icon.png'alt="icon"/>
            <b style={{ fontFamily: "monospace" }}>Assessment</b>
          </h3></center> <hr></hr>
                {formData.assessments.map((assessment, index) => (
                    <Row key={index} className="align-items-center mb-2">
                        <Col md={5}>
                            <Form.Group controlId={`assessment${index}`}>
                                <Form.Label><strong>Assessment</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="assessment"
                                    value={assessment.assessment}
                                    onChange={(e) => handleAssessmentChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group controlId={`yoe${index}`}>
                                <Form.Label><strong>Years of Experience</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="yoe"
                                    value={assessment.yoe}
                                    onChange={(e) => handleAssessmentChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Button style={{backgroundColor:"indianred",border:"0px solid gray",borderRadius:"20px"}} onClick={() => deleteAssessment(index)}><img src='/Images/trash.svg'></img></Button>
                        </Col>
                    </Row>
                ))} <hr></hr>
                <Button variant="primary"  onClick={addAssessment} style={{ marginBottom: '10px' }}>
                    <strong>Add Assessment</strong>
                </Button>
            </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      <strong>Cancel</strong>
    </Button>
    <Button type="submit" onClick={ handleSubmit}  variant="success"><strong>Save Changes</strong></Button>
  </Modal.Footer>
</Modal>

        </div>
  )
}

export default TeamLeadTopNav
