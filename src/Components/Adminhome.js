import React, {  useState,useEffect, useRef } from 'react';
import AdminTopNav from './AdminTopNav';
import Users from './Users';
import UserTopNav from './UserTopNav';
import CryptoJS from 'crypto-js';


function Adminhome(){
  const JWT_SECRET = "ygsiahndCieqtkeresimsrcattoersmaigutiubliyellaueprtnernar";

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

  const localStoreStatusType = getDecryptedData("User Type");

return (
    <div className='bg'>
    {localStoreStatusType === "Admin" ? <AdminTopNav/> : <UserTopNav/>}
   
    </div>
  )
}

export default Adminhome
