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
const [clientCode, setClientCode] = useState('');
const [assignedUsers,setAssignedUsers]= useState([]);
const [selectedClientId, setSelectedClientId] = useState('');
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
  let JSONData = await fetch(`https://hrbackend-e58m.onrender.com/ClientsList/${id}`, reqOption);
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
    let getClientList=async()=>{
        let reqOption={
          method:"GET"
        }
        let JSONData= await fetch("https://hrbackend-e58m.onrender.com/ClientsList",reqOption)
        let JSOData= await JSONData.json();
        setClientsList(JSOData);
       
      }

      const deleteClientDetails = async (id) => {
        // Show a confirmation dialog to the user
        const isConfirmed = window.confirm("Are you sure you want to delete this client?");
    
        // If the user confirms, proceed with the deletion
        if (isConfirmed) {
            try {
                let reqOption = {
                    method: "DELETE",
                };
                let JSONData = await fetch(`https://hrbackend-e58m.onrender.com/deleteClient/${id}`, reqOption);
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
      const response = await fetch(`https://hrbackend-e58m.onrender.com/userDetailsofAssignedClient/${id}`, reqOption);
      let data = await response.json();
      setAssignedUsers(data);
  };
    
    const userDetailstoAssignClient = async (id) => {
      let reqOption = {
          method: "GET"
      };
      const response = await fetch(`https://hrbackend-e58m.onrender.com/userDetailstoAssignClient/${id}`, reqOption);
      let data = await response.json();
      setUsersData(data);
      setFilteredData(data);
      setSelectedClientId(id);
      userDetailsofAssignedClient(id);
      setLgShow(true) 
  };

  useEffect(() => {
      filterUsers();
  }, [searchName, filterUserType]);

  const filterUsers = () => {
      let filtered = usersData;

      if (searchName) {
          filtered = filtered.filter(user =>
              user.EmployeeName.toLowerCase().includes(searchName.toLowerCase())
          );
      }

      if (filterUserType) {
          filtered = filtered.filter(user => user.UserType === filterUserType);
      }

      setFilteredData(filtered);
  };

  const assignClientToUser = async (userId) => {
    const clientId = selectedClientId; // Ensure you have a way to store the selected client ID

    // Show a confirmation dialog to the user
    const isConfirmed = window.confirm(`Are you sure you want to assign this client ?`);

    // If the user confirms, proceed with the assignment
    if (isConfirmed) {
        try {
            const response = await axios.post(`https://hrbackend-e58m.onrender.com/assignClient/${userId}/${clientId}`, 
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
<Table style={{textAlign:"center"}} responsive="sm">
        <thead>
        <tr>
          <th>Client Code</th>
          <th>Client Name</th>
          <th>Type Of Service</th>
          <th>Location</th>
          <th></th>
        </tr>
        </thead>
        {
           clientsList && clientsList.filter((item)=>{
            return search.toLowerCase() === '' ? item : item.ClientName.toLowerCase().includes(search);
           }).map((item)=>{
            return(
                <tbody>
                <tr>
                   <td><Link onClick={()=>{ readClientList(item._id)}} style={{textDecoration:"none"}}><b>{item.ClientCode}</b></Link></td>
                   <td>{item.ClientName}</td>
                   <td>{item.Services}</td>
                   <td>{item.Location}</td>
                    <Link onClick={() => userDetailstoAssignClient(item._id) }> <Image  style={{backgroundColor:"lightgray",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/assign.svg' alt='assign'></Image></Link>
                   {/* <Link onClick={()=>{ readClientList(item._id)}}><Image  style={{backgroundColor:"lightblue",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image></Link> */}
                      <Link onClick={()=>{ deleteClientDetails(item._id); }}>{userType === 'Admin' ?  <Image  style={{backgroundColor:"IndianRed",margin:"5px",padding:"10px",borderRadius:"10px"}} src='./Images/trash.svg'></Image>: ""}</Link>
                   <Link  to={`/UptadeClient/${item._id}`}  >{userType === 'Admin' ? <Image style={{backgroundColor:"lightgreen",padding:"10px",margin:"5px",borderRadius:"10px"}} src='./Images/edit.svg'></Image>  : ""} </Link>
                
                </tr>
                
         </tbody>
            )
            
            })
        }
        
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
        <InputGroup className="mb-3">
            <FormControl
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <Form.Select
                aria-label="Filter by UserType"
                value={filterUserType}
                onChange={(e) => setFilterUserType(e.target.value)}
            >
                <option value="">All</option>
                <option value="User">User</option>
                <option value="TeamLead">TeamLead</option>
                {/* Add more UserType options if needed */}
            </Form.Select>
        </InputGroup>

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
                    {filteredData.map((user, index) => (
                        <tr key={user._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.EmployeeName}</td>
                            <td>{user.Email}</td>
                            <td>{user.UserType}</td>
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
                    ))}
                </tbody>
            </Table>
        </div>

        <hr />

        <center>
            <h5
                style={{ backgroundColor: "lightgray",borderRadius: "30px",margin: "20px",padding: "2px"}}><img style={{ width: "30px", margin: "10px" }} src='/Images/icon.png' alt="icon" /><b style={{ fontFamily: "monospace" }}>Assigned Users</b>
            </h5>
        </center>

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
                    {assignedUsers.map((user, index) => (
                        <tr key={user._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.EmployeeName}</td>
                            <td>{user.Email}</td>
                            <td>{user.UserType}</td>
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
                    ))}
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