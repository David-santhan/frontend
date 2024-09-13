// UpdateUser.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminTopNav from './AdminTopNav';
import UserTopNav from './UserTopNav';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Image from 'react-bootstrap/esm/Image';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function UpdateUser() {
    const { id } = useParams();
    let navigate = useNavigate();
    const [selectedUsers, setSelectedUsers] = useState([]); // Initialize as an empty array
    const [show, setShow] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [userValue, setUserValue] = useState({
        id: id,
        name: "",
        Code: "",
        email: "",
        status: "",
        usertype: "",
        profile: "",
    });

    useEffect(() => {
        axios.get(`https://hrbackend-1.onrender.com/getUserdatatoUpdate/${id}`)
            .then(res => {
                setUserValue({
                    ...userValue,
                    name: res.data.EmployeeName,
                    Code: res.data.EmpCode,
                    email: res.data.Email,
                    status: res.data.Status,
                    usertype: res.data.UserType,
                    profile: res.data.ProfilePic
                });
            }).catch(err => console.log(err));
    }, [id]); // Added id as a dependency to prevent stale closure

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    let JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";

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

    const userType = getDecryptedData("User Type");

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Prepare the payload
      const updatedUserData = {
          ...userValue,
          ...(userValue.usertype === "TeamLead" && { Team: selectedUsers }), // Conditionally add Team
      };
  
      // Debugging: Log the payload
      console.log("Updated User Data:", updatedUserData);
  
      try {
          const response = await axios.put(`https://hrbackend-1.onrender.com/updateUser/${id}`, updatedUserData);
          alert(response.data.msg);
          navigate("/Users");
      } catch (err) {
          console.error(err);
          alert("Error updating user.");
      }
  };
  

    const handleUserTypeChange = () => {
        if (userValue.usertype === "TeamLead") {
            handleShow();
            gettingUsersData();
        }
    };

    const handleUserSelection = (e) => {
        const userId = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
        } else {
            setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter(id => id !== userId));
        }
    };

    const gettingUsersData = async () => {
        try {
            const response = await fetch("https://hrbackend-1.onrender.com/getUserDataToADDtoTeam", {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setUsersData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (userValue.usertype === "TeamLead") {
            gettingUsersData();
        }
    }, [userValue.usertype]);

    return (
        <div>
            {userType === 'Admin' ? <AdminTopNav /> : <UserTopNav />}

            <Form onSubmit={handleSubmit} style={{ backgroundColor: "aliceblue", padding: "30px", borderRadius: "20px", margin: "15px" }}>
                <Image src={`https://hrbackend-1.onrender.com/${userValue.profile}`} style={{ width: "100px", borderRadius: "100px" }} alt="Profile" />

                <h3 style={{ textAlign: "center", fontFamily: "initial" }}>
                    <b><img style={{ width: "35px", borderRadius: "50px" }} src='/Images/icon.png' alt="icon" /> Update {userValue.usertype}</b>
                </h3>
                <hr/>

                <Row>
                    <Col>
                        <FormLabel><b>Emp Code</b></FormLabel>
                        <Form.Control
                            value={userValue.Code}
                            onChange={(e) => setUserValue({ ...userValue, Code: e.target.value })}
                            style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}
                            placeholder="Employee ID"
                        />
                    </Col>
                    <Col>
                        <FormLabel><b>Employee Name</b></FormLabel>
                        <Form.Control
                            value={userValue.name}
                            onChange={(e) => setUserValue({ ...userValue, name: e.target.value })}
                            style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}
                            placeholder="Employee Name"
                        />
                    </Col>

                    <Col>
                        <FormLabel><b>Email ID</b></FormLabel>
                        <Form.Control
                            readOnly
                            value={userValue.email}
                            style={{ width: "300px", borderRadius: "15px" }}
                            placeholder="Email ID"
                        />
                    </Col>

                    <Col>
                        <FormLabel><b>User Type</b></FormLabel>
                        <Form.Select
                            value={userValue.usertype}
                            onChange={(e) => setUserValue({ ...userValue, usertype: e.target.value })}
                            style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}
                        >
                            <option>Choose...</option>
                            <option>User</option>
                            <option>TeamLead</option>
                            <option>Admin</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <FormLabel><b>Status</b></FormLabel>
                        <Form.Select
                            value={userValue.status}
                            onChange={(e) => setUserValue({ ...userValue, status: e.target.value })}
                            style={{ width: "300px", borderRadius: "15px", border: "1px solid black" }}
                        >
                            <option>Choose...</option>
                            <option>Active</option>
                            <option>InActive</option>
                        </Form.Select>
                    </Col>
                </Row>
                <hr />

                <Button
                    onClick={handleUserTypeChange}
                    disabled={userValue.usertype !== "TeamLead"}
                    style={{ borderRadius: "15px", width: "200px" }}
                >
                    Assign Team
                </Button>
                <hr />

                <center>
                    <Button
                        type='submit'
                        style={{ borderRadius: "15px", margin: "20px", backgroundColor: "green", border: "1px solid black" }}
                    >
                        <b>Update</b>
                    </Button>
                </center>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h5>
                                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                                <b style={{ fontFamily: "monospace" }}>Select Users To Assign</b>
                            </h5>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                            <Form.Check
                                                type="checkbox"
                                                value={user._id}
                                                onChange={handleUserSelection}
                                                checked={selectedUsers.includes(user._id)}
                                            />
                                        </td>
                                        <td>{user.EmployeeName}</td>
                                        <td>{user.Email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleClose}>
                            Assign
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </div>
    );
}

export default UpdateUser;
