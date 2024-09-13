
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Img from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';


function AdminTopNav() {
  let navigate = useNavigate();
  let storeObj = useSelector((store) => {
    return store;
  });

  const JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";

  // Function to decrypt data
  const decryptData = (encryptedData, secret) => {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
      return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Function to fetch and decrypt data from localStorage
  const getDecryptedData = (key) => {
      const encryptedData = localStorage.getItem(key);
      return encryptedData ? decryptData(encryptedData, JWT_SECRET) : null;
  };

  const localStoreEmpName = getDecryptedData("Name");
  const localStoreProfile = getDecryptedData("ProfilePic");
  const userType = getDecryptedData("User Type");
  const localStorageEmail = getDecryptedData("Email");
  const [loginUserData, setLoginUserData] = useState([]);

  let userData = async (email) => {
    let reqOption = {
      method: "GET",
    };
    let JSONData = await fetch(`https://hrbackend-e58m.onrender.com/loggedinuserdata/${email}`, reqOption);
    let JSOData = await JSONData.json();
    setLoginUserData(JSOData);
  };

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
    userData(localStorageEmail);
    if (localStoreEmpName && localStoreProfile) {
      // do nothing
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {loginUserData.map((item) => {
        return (
          <Navbar expand="lg" className="bg-body-tertiary" key={item._id}>
            <Container fluid>
              <Navbar.Brand href="/Adminhome">
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
                    <a href="/Adminhome">
                      <Img src='/Images/LOGO_ORNNOVA.avif' style={{ width: "200px" }} />
                    </a>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-center flex-grow-1 pe-3">
                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Requirments">
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/Adminaddnewrequirements"><b>Add New Requirement</b></NavDropdown.Item>
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", marginTop: "10px", textAlign: "center" }} href="/Requirments"><b>Requirements</b></NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Users">
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/AdminCreateUser"><b>Create User</b></NavDropdown.Item>
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center", marginTop: "10px" }} href="/Users"><b>Users</b></NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown style={{ margin: "30px", border: "2px solid gray", padding: "5px", borderRadius: "20px", fontWeight: "bold", textAlign: "center" }} title="Clients">
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center" }} href="/CreateClient"><b>Create Client</b></NavDropdown.Item>
                      <NavDropdown.Item style={{ border: "1px solid gray", borderRadius: "20px", textAlign: "center", marginTop: "10px" }} href="/Clients"><b>Clients</b></NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  <Nav>
                    <Navbar.Brand href="/Profile">
                      <Img src={`https://hrbackend-e58m.onrender.com/${item.ProfilePic}`} style={{ width: "70px", borderRadius: "50px", margin: '10px' }} />
                    </Navbar.Brand>
                    <Navbar.Text style={{ margin: "5px" }}>
                      <b style={{ color: "black", textDecoration: "underline", fontFamily: "initial" }}>Welcome:</b> 
                      <b style={{ fontFamily: "fantasy" }}> {item.EmployeeName}</b>
                    </Navbar.Text>
                    <Button onClick={() => { logout() }} style={{ width: "45px", height: "45px", margin: "10px", backgroundColor: "lightgray", color: "red", fontWeight: "bold", borderRadius: "90px", border: "1.5px solid indianred", fontSize: "small" }}>
                      <Img src='/Images/logout.svg' style={{ width: "130%" }} />
                    </Button>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        )
      })}
    </div>
  )
}

export default AdminTopNav;
