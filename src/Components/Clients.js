import React, { useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import AdminTopNav from './AdminTopNav';
import Image from 'react-bootstrap/Image';
import { Link,useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import { Button } from 'bootstrap';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import UserTopNav from './UserTopNav';
import Modal from 'react-bootstrap/Modal';
import CryptoJS from 'crypto-js';
import {  Form, InputGroup, FormControl } from 'react-bootstrap';





function Clients() {

const [clientsList,setClientsList]= useState([]);
let [search,setSearch]=useState('');
let navigate = useNavigate();
const [showA, setShowA] = useState(true);
const [lgShow, setLgShow] = useState(false);
const [clientList,setClientList]= useState([]);
const [usersData,setUsersData] = useState([]);
const [clientIds, setClientIds] = useState('');
const [assignedUsers,setAssignedUsers]= useState([]);
const [selectedClientId, setSelectedClientId] = useState('');
const [assignedCount,setAssignedCount]= useState('');
const{id}=useParams();
const toggleShowA = () => setShowA(!showA);

const [show, setShow] = useState(false);
const [filteredData, setFilteredData] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filterUserType, setFilterUserType] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



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
const userType = getDecryptedData("User Type")

const readClientList = async (id) => {
  let reqOption = { method: "GET" };
  let JSONData = await fetch(`https://hrbackend-1.onrender.com/ClientsList/${id}`, reqOption);
  let JSOData = await JSONData.json();
  setClientList(JSOData);
  // setSelectedClientId(id);
  // setClientCode(JSOData.ClientCode); // Store the client code
  toggleShowA();
  handleShow();
};



useEffect(()=>{
    getClientList();
    
})
let getClientList = async () => {
    let reqOption = {
        method: "GET"
    };

    try {
        let JSONData = await fetch("https://hrbackend-1.onrender.com/ClientsList", reqOption);
        let JSOData = await JSONData.json();
        // console.log(JSOData); // Log the response to inspect its structure
        // Assuming JSOData is supposed to be an array of clients
        if (JSOData.clientUserCounts) {
            setClientsList(JSOData.clientUserCounts); // Use the correct field from the response
        } else {
            console.error("Expected clientUserCounts array not found in response.");
        }

        // Iterate over each client and log the _id
        if (Array.isArray(JSOData.clientUserCounts)) {
            JSOData.clientUserCounts.forEach(client => {
                // console.log(client.clientId); // Display clientId in console
            });
        } else {
            console.error("clientUserCounts is not an array.");
        }
    } catch (error) {
        console.error("Error fetching clients:", error);
    }
};

  
      const deleteClientDetails = async (id) => {
        // Show a confirmation dialog to the user
        const isConfirmed = window.confirm("Are you sure you want to delete this client?");
    
        // If the user confirms, proceed with the deletion
        if (isConfirmed) {
            try {
                let reqOption = {
                    method: "DELETE",
                };
                let JSONData = await fetch(`https://hrbackend-1.onrender.com/deleteClient/${id}`, reqOption);
                let JSOData = await JSONData.json();
    
                if (JSOData.status === "success") {
                    alert(JSOData.msg);
                    window.location.reload();
                    navigate("/Clients");
                } else {
                    alert("Failed to delete client: " + JSOData.msg);
                }
            } catch (error) {
                console.error("Error deleting client:", error);
                alert("An error occurred while deleting the client. Please try again later.");
            }
        } else {
            // User canceled the deletion, so no action is taken
            alert("Client deletion was canceled.");
        }
    };
    
    const userDetailsofAssignedClient = async (id) => {
      let reqOption = {
          method: "GET"
      };
      const response = await fetch(`https://hrbackend-1.onrender.com/userDetailsofAssignedClient/${id}`, reqOption);
      let data = await response.json();
      setAssignedUsers(data.userDetails);
     

      
  };
  const AssignedClientCount = async (id)=>{
    let reqOption = {
        method: "GET"
    };
    const response = await fetch(`https://hrbackend-1.onrender.com/userDetailsofAssignedClient/${id}`, reqOption);
    let data = await response.json();
    setAssignedCount(data.count);
    // console.log(data.count)
   
  }
    
    const userDetailstoAssignClient = async (id) => {
      let reqOption = {
          method: "GET"
      };
      const response = await fetch(`https://hrbackend-1.onrender.com/userDetailstoAssignClient/${id}`, reqOption);
      let data = await response.json();
      console.log( data)
      setUsersData(data);
      setFilteredData(data.userDetails);
      setSelectedClientId(id);
      userDetailsofAssignedClient(id);
      setLgShow(true) 
  };

  useEffect(() => {
      filterUsers();
  }, [searchName, filterUserType]);

  const filterUsers = () => {
    // Ensure `usersData` is an array before filtering
    let filtered = Array.isArray(usersData) ? usersData : [];
    
    console.log("Initial data:", filtered);  // Debugging the original data

    // Check if searchName is a valid string and filter by name
    if (searchName?.trim()) {
        filtered = filtered.filter(user => 
            user.EmployeeName?.toLowerCase().includes(searchName.toLowerCase())
        );
        console.log("After filtering by name:", filtered);  // Debugging the result after filtering by name
    }

    // Check if filterUserType is provided and filter by user type
    if (filterUserType?.trim()) {
        filtered = filtered.filter(user => user.UserType === filterUserType);
        console.log("After filtering by user type:", filtered);  // Debugging the result after filtering by user type
    }

    // Update the filtered data state
    setFilteredData(filtered);
    console.log("Final filtered data:", filtered);  // Debugging final result
};


  const assignClientToUser = async (userId) => {
    const clientId = selectedClientId; // Ensure you have a way to store the selected client ID

    // Show a confirmation dialog to the user
    const isConfirmed = window.confirm(`Are you sure you want to assign this client ?`);

    // If the user confirms, proceed with the assignment
    if (isConfirmed) {
        try {
            const response = await axios.post(`https://hrbackend-1.onrender.com/assignClient/${userId}/${clientId}`, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data;

            if (result.status === 'success') {
                alert('Client assigned successfully ✅');
                setLgShow(false);
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
    
  return (
    <div>
        {/* <AdminTopNav/> */}
        {userType === 'Admin' ? <AdminTopNav /> : <UserTopNav />} 
    <center><h2 style={{fontFamily:"fantasy",fontWeight:"bolder"}}><img src='/Images/icon.png' style={{width:"30px"}}></img> Clients</h2></center>
   <center><input style={{ padding: '10px', width: '300px',margin:"20px",borderRadius:"15px" }} onChange={(e)=> setSearch(e.target.value)} type='search' placeholder='🔍   Search Name'></input></center>
    <center>
    <Row>
    <Col >{
            clientList.map((item,i)=>{
                return(
                  <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                  <strong className="me-auto"><b style={{fontFamily:"monospace",margin:"5px"}}>Client Name:</b>{item.ClientName}</strong>
            <small><b style={{fontFamily:"monospace",margin:"5px"}}>Code:</b>{item.ClientCode}</small>
             </Modal.Header>
                  <Modal.Body style={{textAlign:"start"}}>     
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>Type Of Services:</b>{item.Services}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>Location:</b>{item.Location}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>1<sup>st</sup>Name:</b>{item.Name}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>1<sup>st</sup>Spoc:</b>{item.Spoc}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>1<sup>st</sup>Mobile Number:</b>{item.MobileNumber}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>1<sup>st</sup>Email:</b>{item.Email}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>2<sup>nd</sup>Name:</b>{item.Name1}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>2<sup>nd</sup>Spoc:</b>{item.Spoc1}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>2<sup>nd</sup>MobileNumber:</b>{item.MobileNumber1}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>2<sup>nd</sup>Email:</b>{item.Email1}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>3<sup>rd</sup>Name:</b>{item.Name2}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>3<sup>rd</sup>Spoc:</b>{item.Spoc2}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>3<sup>rd</sup>MobileNumber:</b>{item.MobileNumber2}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>3<sup>rd</sup>Email:</b>{item.Email2}</p>
</Modal.Body>
                 
                </Modal>

                )
            })
        }
        </Col>
      </Row> 
    </center>  
  <center>
  <Table style={{ textAlign: "center" }} responsive="sm">
    <thead>
        <tr>
            <th>Client Code</th>
            <th>Client Name</th>
            <th>Type Of Service</th>
            <th>Location</th>
            <th>Assigns</th>
            <th colSpan={3}>Actions</th>
        </tr>
    </thead>
    <tbody>
        {clientsList && clientsList
            .filter(item => search.toLowerCase() === '' || item.clientName.toLowerCase().includes(search))
            .map(item => (
                <tr key={item.clientId}>
                    <td>
                        <Link onClick={() => { readClientList(item.clientId) }} style={{ textDecoration: "none" }}>
                            <b>{item.clientCode}</b>
                        </Link>
                    </td>
                    <td>{item.clientName}</td>
                    <td>{item.clientDetails.typeOfService || "N/A"}</td>
                    <td>{item.clientDetails.location || "N/A"}</td>
                    <td onClick={() => userDetailstoAssignClient(item.clientId)}>
                         <strong style={{backgroundColor: item.userCount === item.userTypeCounts ? "lightgreen" : "lightgray",padding: "8px",borderRadius: "10px",color: "white" // You can change the text color to enhance visibility on green background
                           }}><Link style={{ textDecoration: "none", color: "black" }}>{item.userCount}/{item.userTypeCounts}</Link></strong></td>                    
                    {/* <td>
                        <Link onClick={() => userDetailstoAssignClient(item.clientId)}>
                            <Image style={{ backgroundColor: "lightgray", padding: "10px", borderRadius: "10px" }} src='./Images/assign.svg' alt='assign' />
                        </Link>
                    </td> */}
                    <td>
                        <Link onClick={() => { deleteClientDetails(item.clientId); }}>
                            {userType === 'Admin' ? <Image style={{ backgroundColor: "IndianRed", padding: "10px", borderRadius: "10px" }} src='./Images/trash.svg' alt='delete' /> : ""}
                        </Link>
                    </td>
                    <td>
                        <Link to={`/UptadeClient/${item.clientId}`}>
                            {userType === 'Admin' ? <Image style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "10px" }} src='./Images/edit.svg' alt='edit' /> : ""}
                        </Link>
                    </td>
                </tr>
            ))}
    </tbody>
</Table>


          <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
            <h5>
                <img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" />
                <b style={{ fontFamily: "monospace" }}>Assign Client</b>
            </h5>
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {/* Search and Filter Controls */}
    <InputGroup className="mb-3">
        <FormControl
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)} // Update search input
        />
        <Form.Select
            aria-label="Filter by UserType"
            value={filterUserType}
            onChange={(e) => setFilterUserType(e.target.value)} // Update filter dropdown
        >
            <option value="">All</option>
            <option value="User">User</option>
            <option value="TeamLead">TeamLead</option>
            {/* Add more UserType options as needed */}
        </Form.Select>
    </InputGroup>

    {/* Table to Display Filtered Users */}
    <div className="table-responsive mb-3">
        <Table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Sno</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">User Type</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.length > 0 ? (
                    filteredData.map((user, index) => (
                        <tr key={user._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.EmployeeName || 'N/A'}</td>
                            <td>{user.Email || 'N/A'}</td>
                            <td>{user.UserType || 'N/A'}</td>
                            <td>
                                <Link
                                    onClick={() => assignClientToUser(user._id)}
                                    style={{
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        backgroundColor: "lightsteelblue",
                                        padding: "5px",
                                        color: "black",
                                        borderRadius: "20px"
                                    }}
                                >
                                    Assign
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            No Users Found
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>

    <hr />

    {/* Title for Assigned Users Table */}
    <center>
        <h5
            style={{
                backgroundColor: "lightgray",
                borderRadius: "30px",
                margin: "20px",
                padding: "2px"
            }}
        >
            <img
                style={{ width: "30px", margin: "10px" }}
                src='/Images/icon.png'
                alt="icon"
            />
            <b style={{ fontFamily: "monospace" }}>Assigned Users</b>
        </h5>
    </center>

    {/* Table to Display Assigned Users */}
    <div className="table-responsive">
        <Table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Sno</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">User Type</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {assignedUsers.length > 0 ? (
                    assignedUsers.map((user, index) => (
                        <tr key={user._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.EmployeeName || 'N/A'}</td>
                            <td>{user.Email || 'N/A'}</td>
                            <td>{user.UserType || 'N/A'}</td>
                            <td>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        backgroundColor: "lightgreen",
                                        padding: "6px",
                                        color: "black",
                                        borderRadius: "20px"
                                    }}
                                >
                                    Assigned
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            No Assigned Users
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
</Modal.Body>

</Modal>

         
</center>

    </div>
  )
}

export default Clients
