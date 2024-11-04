import React, { useEffect, useState } from 'react';
import TeamLeadTopNav from './TeamLeadTopNav'
import CryptoJS from 'crypto-js';
import UserTopNav from './UserTopNav';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';


function TeamClients() {
  const [show, setShow] = useState(false);
  const [clientList,setClientList]= useState([]);

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
  const UserType = getDecryptedData("User Type")
  const userId = getDecryptedData("Id");

  // State to store user and team data
  const [userData, setUserData] = useState(null);
  const [clientData, setClientData] = useState([]);

  // Fetch user and team data
  const fetchUserData = async (userId) => {
    try {
      let response = await axios.get(`https://hrbackend-2.onrender.com/TlClients/${userId}`);
      let data = response.data;
 
      setUserData(data.user);
      setClientData(data.Client);
      console.log(data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const readClientList = async (id) => {
    let reqOption = { method: "GET" };
    let JSONData = await fetch(`https://hrbackend-2.onrender.com/ClientsList/${id}`, reqOption);
    let JSOData = await JSONData.json();
    setClientList(JSOData);
    // setSelectedClientId(id);
    // setClientCode(JSOData.ClientCode); // Store the client code
    handleShow();
  };
  return (
    <div>
      {UserType === 'TeamLead' ? <TeamLeadTopNav /> : <UserTopNav />}
      <center>
        <h3>
          <img
            style={{ width: "30px", margin: "10px" }}
            src='/Images/icon.png'
            alt="icon"
          />
          <b style={{ fontFamily: "monospace" }}>Clients Assigned</b>
        </h3>

      {/* Displaying Team Information */}
      {clientData.length > 0 && (
        <div>
          <Table style={{textAlign:"center"}} >
            <thead>
              <tr>
              <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Services</th>
                
              </tr>
            </thead>
            <tbody>
              {clientData.map((team, index) => (
                <tr key={index}>
                 <td><Link style={{textDecoration:"none"}} onClick={()=>{ readClientList(team._id)}} ><b>{team.ClientCode}</b></Link></td>
                  <td>{team.ClientName}</td>
                  <td>{team.Services}</td> {/* Replace with actual fields */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      </center>
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
    </div>
  )
}

export default TeamClients
