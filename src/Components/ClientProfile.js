import React,{useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import AdminTopNav from './AdminTopNav';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import CardTitle from 'react-bootstrap/esm/CardTitle';

function ClientProfile() {
    const [clientsList,setClientsList]= useState([]);
    const{id}=useParams();

    useEffect(()=>{
        getClientList(id);
    })
        let getClientList=async(id)=>{
            let reqOption={
              method:"GET"
            }
            let JSONData= await fetch(`https://hrbackend-e58m.onrender.com/ClientsList/${id}`,reqOption)
            let JSOData= await JSONData.json();
            setClientsList(JSOData);
          }
  return (
    <div>
        <AdminTopNav/>
        <center>
        <Card style={{ width: '300px',textAlign:"start" }}>
            {
                clientsList.map((Item)=>{
                    return(
                        
                        <ListGroup variant="flush">
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Client Code :</b>{Item.ClientCode}</ListGroup.Item>
                        <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Client Name :</b>{Item.ClientName}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Services :</b>{Item.Services}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Location :</b>{Item.Location}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Name : </b>{Item.Name}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Spoc :</b>{Item.Spoc}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Mobile Number :</b>{Item.MobileNumber}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Email :</b>{Item.Email}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Services</b>{Item.Services}</ListGroup.Item>
                       <ListGroup.Item><b style={{fontFamily:"monospace",textDecoration:"underline",margin:"20px"}}>Services</b>{Item.Services}</ListGroup.Item>

      </ListGroup>
                    )
                })
            }
    
      
    </Card>
        </center>
       


    </div>
  )
}

export default ClientProfile