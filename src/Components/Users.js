import React,{useEffect, useState} from 'react';
import AdminTopNav from './AdminTopNav';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import UserTopNav from './UserTopNav';
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';






function Users() {
    let [userDetailsList,setUserDetailsList]=useState([]);
    let [search,setSearch]=useState('');
    let [showUserData,setShowUserData]= useState([]);
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const userType = localStorage.getItem("User Type")

let navigate = useNavigate();
    useEffect(()=>{
        getUserList();
    })

    let getUserList=async()=>{
        let reqOption={
          method:"GET"
        }
        let JSONData= await fetch("https://ornnovabackend.onrender.com/userDetailsHome",reqOption)
        let JSOData= await JSONData.json();
        setUserDetailsList(JSOData);   
      }

      let deleteUserDetails = async (id) => {
        // Confirmation prompt before deleting
        const confirmation = window.confirm("Are you sure you want to delete this user?");
    
        if (confirmation) {
            let reqOption = {
                method: "DELETE",
            };
            try {
                let JSONData = await fetch(`https://ornnovabackend.onrender.com/deleteUser/${id}`, reqOption);
                let JSOData = await JSONData.json();
    
                if (JSOData.status === "success") {
                    alert(JSOData.msg);
                    window.location.reload();
                    navigate("/Users");
                } else {
                    alert(JSOData.msg || "Failed to delete user.");
                }
            } catch (error) {
                alert("Error occurred: " + error.message);
            }
        } else {
            // User canceled the delete action
            alert("User deletion canceled.");
        }
    };
    

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
    
  return (
    <div>
        <AdminTopNav/>
        {/* { userType === 'Admin' ? <AdminTopNav/> : <UserTopNav/> }  */}
        <center> <h2 style={{fontFamily:"fantasy",fontWeight:"bolder"}}><img style={{width:"30px",margin:"10px"}} src='/Images/icon.png'></img>Users</h2></center>  
       <center><input style={{ padding: '10px', width: '300px',margin:"20px",borderRadius:"15px" }}
                           onChange={(e)=> setSearch(e.target.value)} type='search' placeholder='🔍   Search Name'></input></center>
         <center>
        {/* <Row >
        <Col>
      {
        showUserData&&showUserData.map((item)=>{
          return(
             <Toast show={showA} onClose={toggleShowA}>
             <Toast.Header>
            <strong className="me-auto"><b style={{fontFamily:"monospace",margin:"5px"}}>Client Name:</b>{item.EmployeeName}</strong>
            <small><b style={{fontFamily:"monospace",margin:"5px"}}>Code:</b>{item.EmpCode}</small>
          </Toast.Header>
          <Toast.Body style={{textAlign:"start"}}>
            <center>            <img style={{width:"200px"}}src={`https://ornnovabackend.onrender.com/${item.ProfilePic}`} ></img></center> <hr></hr>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>Email:</b>{item.Email}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>User Type:</b>{item.UserType}</p>
            <p><b style={{fontFamily:"monospace",margin:"20px"}}>Status:</b>{item.Status}</p>

          </Toast.Body>
        </Toast>
          )
            })
        }
        
        </Col>
    </Row>   */}

    <Row>
    <Col>
  {showUserData && showUserData.userDetails && (
    <Modal show={show} onHide={handleClose}>
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
      <Table hover bordered style={{border:"1px solid lightgray"}}   responsive="sm">
            <thead style={{textAlign:"center"}} >
              <tr >
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th> User Type  </th>
                <th> Status</th>
                  <th>Initiated By</th>
      <th colSpan={3}>Actions</th>
                
              </tr>
            </thead>
            {
       userDetailsList &&  userDetailsList.filter((item)=>{
            return search.toLowerCase() === '' ? item : item.EmployeeName.toLowerCase().includes(search);
          }).map((item)=>{ 
            return(
            <tbody style={{textAlign:"center"}} >
              <tr>
                <td>{item.EmpCode}</td>
                <td>{item.EmployeeName}</td>
                <td>{item.Email}</td>
                <td>{item.UserType}</td>
                <td>{item.Status}</td>
                <td>{item.CreatedBy}</td>
                 <td>
                  <Image onClick={()=>{ readUserDatafun(item._id)}} style={{backgroundColor:"lightblue",padding:"10px",borderRadius:"10px"}} src='./Images/view.svg'></Image> 
                 </td>
              <td>
                 <Image onClick={()=>{ deleteUserDetails(item._id)}} style={{backgroundColor:"IndianRed",padding:"10px",borderRadius:"10px"}} src='./Images/trash.svg'></Image> </td>
                 <td>  
               <Link to={`/UpdateUser/${item._id}`}><Image  style={{backgroundColor:"lightgreen",padding:"10px",borderRadius:"10px"}} src='./Images/edit.svg'></Image></Link> </td>
              </tr>
              </tbody>
            )
          })
        }
</Table>

        </center> 
    </div>
  )
}

export default Users
