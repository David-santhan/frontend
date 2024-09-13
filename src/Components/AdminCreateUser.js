import React, { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AdminTopNav from './AdminTopNav';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Image from 'react-bootstrap/esm/Image';
import { useNavigate } from 'react-router-dom';
import UserTopNav from './UserTopNav';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import CryptoJS from 'crypto-js';

function AdminCreateUser() {
  const [empCode, setEmpCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [errors, setErrors] = useState({});
  const [profilepicpath, setProfilepicpath] = useState('./Images/noimg.jpg');
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([{userId:""}]);
  let JWT_SECRET="ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar"

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
  const Name = getDecryptedData("Name");


  let empIdinputRef = useRef();
  let employeeNameinputRef = useRef();
  let emailinputRef = useRef();
  let profilePicRef = useRef();
  let passwordinputRef = useRef();
  let userTypeinputRef = useRef();
  let defaultstatusRef = "Active";
  let defaultName = Name;
  let userToken = `${email}+ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar`;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validate = () => {
    let errors = {};

    if (!empCode) {
      errors.empCode = 'Employee ID is required.';
    }

    if (!employeeName) {
      errors.employeeName = 'Employee Name is required.';
    }

    if (!emailPattern.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!userType) {
      errors.userType = 'User Type is required.';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendUserDataToDataBase = async () => {
    try {
        let dataToSend = new FormData();
        dataToSend.append("EmpCode", empCode);
        dataToSend.append("EmployeeName", employeeName);
        dataToSend.append("Email", email);
        dataToSend.append("Password", password);
        dataToSend.append("UserType", userType);

        if (profilePicRef.current.files.length > 0) {
            dataToSend.append("ProfilePic", profilePicRef.current.files[0]);
        }

        dataToSend.append("Status", defaultstatusRef);
        dataToSend.append("Token", userToken);
        dataToSend.append("CreatedBy", defaultName);

        // Append each UserId in the Team array individually
        // selectedUsers.forEach((user, index) => {
        //   dataToSend.append(`Team[${index}]`, user.userId);
        // });

        let reqOption = {
            method: "POST",
            body: dataToSend,
        };

        let JSONData = await fetch("https://hrbackend-1.onrender.com/newUser", reqOption);
        let JSOData = await JSONData.json();

        if (JSOData.status === "Success") {
            alert(JSOData.msg);
            setModalMessage(JSOData.msg);
            setModalShow(true);
            window.location.reload();
        } else {
            setModalMessage(JSOData.msg);
            setModalShow(true);
        }
        console.log(JSOData);
    } catch (error) {
        console.error("Error sending user data:", error);
        setModalMessage("Failed to send user data. Please try again.");
        setModalShow(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      sendUserDataToDataBase();
    }
  };

  let navigate = useNavigate();

  // const handleUserTypeChange = (e) => {
  //   setUserType(e.target.value);
  //   if (e.target.value === "TeamLead") {
  //     const userConfirmed = window.confirm("Do you want to Assign Team Now ?");
  //     if (userConfirmed) {
  //       handleShow();
  //       gettingUsersData();
  //     }
  //   }
  // };
  

  // const handleUserSelection = (e) => {
  //   const userId = e.target.value;
  //   const isChecked = e.target.checked; 
  //   if (isChecked) {
  //     setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, { userId }]);
  //   } else {
  //     setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter(user => user.userId !== userId));
  //   }
  // };

  // const gettingUsersData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:7993/getUserDataToADDtoTeam", {
  //       method: "GET"
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     setUsersData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (userType === "TeamLead") {
  //     gettingUsersData();
  //   }
  // }, [userType]);

  return (
    <div>
      <AdminTopNav/>
      <center>
        <Form onSubmit={handleSubmit} style={{ backgroundColor: "aliceblue", padding: "30px", borderRadius: "20px", margin: "15px" }}>
          <h3 style={{ textAlign: "center", fontFamily: "initial" }}>
            <b><img style={{ width: "35px", borderRadius: "50px" }} src='/Images/icon.png' alt="icon" /> Create User</b>
          </h3>
          <hr></hr>

          <Row>
         <Col>
         <FormLabel><b>Profile Pic</b></FormLabel> <br></br>
          <Image src={profilepicpath} style={{ borderRadius: "100px", margin: "10px", width: "150px", height: "150px", border: "1px solid gray"}}></Image>
          <Form.Control ref={profilePicRef} style={{ width: "250px", borderRadius: "15px" }} type='file' onChange={(event) => {
            let profilePicPath = URL.createObjectURL(event.target.files[0]);
            setProfilepicpath(profilePicPath);
          }}></Form.Control>
         </Col>
         </Row>
         <Row>
            <Col>
              <FormLabel><b>Emp Code</b></FormLabel>
              <Form.Control ref={empIdinputRef} value={empCode} onChange={(e) => setEmpCode(e.target.value)} style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }} placeholder="Employee ID" />
              {errors.empCode && (<p style={{ color: 'red' }}>{errors.empCode}</p>)}
            </Col>
            <Col>
              <FormLabel><b>Employee Name</b></FormLabel>
              <Form.Control ref={employeeNameinputRef} value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }} placeholder="Employee Name" />
              {errors.employeeName && (<p style={{ color: 'red' }}>{errors.employeeName}</p>)}
            </Col>
         
         
           {/* </Row>
          <Row> */}
            <Col>
              <FormLabel><b>Email ID</b></FormLabel>
              <Form.Control ref={emailinputRef} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "300px", borderRadius: "15px", borderColor: errors.email ? 'red' : 'black' }} placeholder="Email ID" />
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </Col>
            <Col>
              <FormLabel><b>Password</b></FormLabel>
              <Form.Control ref={passwordinputRef} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "300px", borderRadius: "15px", borderColor: errors.email ? 'red' : 'black' }} placeholder="Password" />
              {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </Col>
          {/* </Row>
          <Row> */}
            <Col>
              <FormLabel><b>Confirm Password</b></FormLabel>
              <Form.Control value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "300px", borderRadius: "15px", borderColor: errors.confirmPassword ? 'red' : 'black' }} placeholder="Confirm Password" />
              {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
            </Col>
            <Col>
              <FormLabel><b>User Type</b></FormLabel>
              <Form.Select ref={userTypeinputRef} value={userType} onChange={(e)=> setUserType(e.target.value) } style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}>
                <option>Select User Type</option>
                <option value="Admin">Admin</option>
                <option value="TeamLead">TeamLead</option>
                <option value="User">User</option>
              </Form.Select>
              {errors.userType && <p style={{ color: 'red' }}>{errors.userType}</p>}
            </Col>
            <Col>
              <FormLabel><b>Status</b></FormLabel>
              <Form.Control  value={defaultstatusRef} readOnly style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}  />
            </Col>

          
          </Row>
         
          <br></br>
          <Button type="submit" style={{ margin: "10px", borderRadius: "15px", width: "250px", backgroundColor: "darkgreen", border: "none" }}>
            <b>Create User</b>
          </Button>
         
        </Form>
      </center>

      {/* Modal Component */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>               
             <h5> <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon"></img><b style={{fontFamily:"monospace"}} >Select Users To Assign</b></h5> {/* Displaying single requirement detail */}
          </Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>
        {userType === "TeamLead" && (
            <div>
                <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Employee Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map(user => (
                    <tr key={user._id}>
                      <td>
                        <Form.Check type="checkbox" value={user._id} onChange={handleUserSelection} />
                      </td>
                      <td>{user.EmployeeName}</td>
                      <td>{user.Email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Assign
          </Button>
        </Modal.Footer> */}
      </Modal>

      
    </div>
  );
}

export default AdminCreateUser;
