import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Loginpage from './Components/Loginpage';
import Home from './Components/Home';
import Newrequirements from './Components/Newrequirements';
import Adminhome from './Components/Adminhome';
import Adminaddnewrequirements from './Components/Adminaddnewrequirements';
import AdminTopNav from './Components/AdminTopNav';
import AdminCreateUser from './Components/AdminCreateUser';
import CreateClient from './Components/CreateClient';
import ResetPassword from './Components/ResetPassword';
import Profile from './Components/Profile';
import Clients from './Components/Clients';
import Users from './Components/Users';
import ClientProfile from './Components/ClientProfile';
import UserTopNav from './Components/UserTopNav';
import AdminUpdateClient from './Components/AdminUpdateClient';
import UpdateUser from './Components/UpdateUser';
import Requirments from './Components/Requirments';
import UserActions from './Components/UserActions';
import TeamLeadTopNav from './Components/TeamLeadTopNav';
import TLHome from './Components/TLHome';
import CryptoJS from 'crypto-js';
import TeamClients from './Components/TeamClients';
import TLNewRequirement from './Components/TLNewRequirement';




function App() {

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
  const login = getDecryptedData("isLogedin")
  const localStorageType = getDecryptedData("User Type")
  return (
    <div className="App">
    
      <Routes>
      <Route 
  path='/' 
  element={
    login === "true" ? (
      localStorageType === "Admin" 
        ? <Adminhome /> 
        : localStorageType === "TeamLead" 
          ? <TLHome /> 
          : <Home />
    ) : (
      <Loginpage />
    )
  }
/>

      <Route path='/forgotpassword' element={<Signup/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/Adminhome' element={localStorageType === "Admin" ? <Adminhome/> : <Home/>}></Route>
        <Route path='/newrequirements' element={<Newrequirements/>}></Route>
        <Route path='/Adminaddnewrequirements' element={localStorageType === "Admin" ? <Adminaddnewrequirements/> : <Home/>}></Route>
        <Route path='/AdminTopNav' element={<AdminTopNav/>}></Route>
        <Route path='/AdminCreateUser' element={localStorageType === "Admin" ? <AdminCreateUser/> : <Home/>}></Route>
        <Route path='/CreateClient' element={localStorageType === "Admin" ? <CreateClient/> : <Home/>}></Route>
        <Route path='/ResetPassword/:id/:token' element={<ResetPassword/>}></Route>
        <Route path='/Profile'  element={<Profile/>}></Route>
        <Route path='/Clients' element={<Clients/>}></Route>
        <Route path='/Users' element={<Users/>}></Route>
        <Route path='/ClientProfile/:id' element={<ClientProfile/>}></Route>
        <Route path='/UserTopNav' element={<UserTopNav/>}></Route>
        <Route path='/UptadeClient/:id' element={localStorageType === "Admin" ? <AdminUpdateClient/> : <Home/>}></Route>
        <Route path='/UpdateUser/:id' element={localStorageType === "Admin" ? <UpdateUser/> : <Home/>}></Route>
        <Route path='/Requirments' element={localStorageType === "Admin" ? <Requirments/> : <Home/>}></Route>
        <Route path='/UserAction/:id/:user' element={<UserActions/>}></Route>
        <Route path='/TeamLeadTopNav' element={<TeamLeadTopNav/>}></Route>
        <Route path='/TLHome' element={<TLHome/>}></Route>
        <Route path='/TeamClient' element={<TeamClients/>}></Route>
        <Route path='/TLNewReq' element={<TLNewRequirement/>}></Route>
        <Route path='*' element={<div>Page Not Found</div>}></Route>
      </Routes>
      
   
      
    </div>
  );
}

export default App;
