import React, {  useState,useEffect, useRef } from 'react';
// import AdminTopNav from './AdminTopNav';
import Users from './Users';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import Image from 'react-bootstrap/Image';
// import { useNavigate } from 'react-router-dom';
// import Table from 'react-bootstrap/Table';
// import { useSelector } from 'react-redux';
// import UserTopNav from './UserTopNav';

function Adminhome(){
// useEffect(()=>{
//   getUserList();
// })


// let storeObj = useSelector((store)=>{
//   return store;
// })
// // console.log(storeObj);
// // localStorage.setItem("Name1",storeObj.loginDetails.EmployeeName)
// // localStorage.setItem("Employee Code1",storeObj.loginDetails.EmpCode)
// // localStorage.setItem("Email1",storeObj.loginDetails.Email)
// // localStorage.setItem("User Type1",storeObj.loginDetails.UserType)
// // localStorage.setItem("ProfilePic1",storeObj.loginDetails.ProfilePic)
// // localStorage.setItem("Status1",storeObj.loginDetails.Status)



// let [search,setSearch]=useState('');
//   let [userDetailsList,setUserDetailsList]=useState([]);
//   let [selectedType,setSelectedType]=useState();

//   let userTypeRef=useRef();
//   let userStatusRef=useRef();

//   let navigate = useNavigate();

//   let getUserList=async()=>{
//     let reqOption={
//       method:"GET"
//     }
//     let JSONData= await fetch("http://localhost:7993/userDetailsHome",reqOption)
//     let JSOData= await JSONData.json();
//     setUserDetailsList(JSOData);   
//   }
//   let deleteUserDetails=async (id)=>{
//     let reqOption={
//         method:"DELETE",
//     };   
//  let JSONData=await fetch( `http://localhost:7993/deleteUser/${id}`,reqOption);
//  let JSOData=await JSONData.json();
//  if(JSOData.status==="success"){
//     alert(JSOData.msg);
//     window.location.reload();
//     navigate("/Adminhome");
//  }
// }

// let localStoreStatusType = localStorage.getItem("User Type");
  return (
    <div className='bg'>
    {/* {localStoreStatusType === "Admin" ? <AdminTopNav/> : <UserTopNav/>} */}
    {/* <AdminTopNav/> */}
    <Users/>
      
     
      
    </div>
  )
}

export default Adminhome