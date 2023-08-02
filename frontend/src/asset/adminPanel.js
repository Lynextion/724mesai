import "./adminPanel.css"
import Logo from "./svg/altin-logo-w-1.png"
import { useEffect, useRef, useState } from "react"
import { generatePassword } from "./generate password"
import { createUserWithEmailAndPassword,onAuthStateChanged } from "firebase/auth"
import {auth} from "../firebase"
import axios from "axios"
import robotWait from "./svg/robotWait.gif"
import { useNavigate } from "react-router-dom"
import CryptoJS from "crypto-js"

const AdminPanel = () =>{


    const ENCRYPTION_KEY = 'o7UZXkzXFp3iMbGpJqF3hbilW1tcwCxfBDDgVZXrmO4dLE62kYcawIVvS5EULxtE'

    const encryptData = (data, key) => {
        const encrypted = CryptoJS.AES.encrypt(data, key).toString();
        return encrypted;
      };

    const decryptData = (data,key) =>{
        const decryptedData = CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    }

    const companyName = useRef(null)
    const companyRegion = useRef(null)
    const companyInfo = useRef(null)

    const userName = useRef(null)
    const userRol = useRef(null)
    const email = useRef(null)

    const navigate = useNavigate()
    

    const [wait,setWait] = useState(false)

    const axiosInstance = axios.create({
        baseURL:"http://localhost:4000",
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
          },
    })

    const addWhiteList = (email,id) =>{
        const body = {
            "email":email,
            "id":id
        }
        axiosInstance.post("/insert-whitelist",{body})
        .then(() =>{
            setWait(false)
        })
    }

    const addUser = (userInfo) => {
        const body = userInfo

        axiosInstance.post("/add-user",{body})
    }

    const userAddBT = () =>{
        return(
            <>
                 <button className="addUserBT" onClick={userSumbit}><p className="btP">Kişi Ekle</p></button>
            </>
        )
    }

    const waitBT = () =>{
        return(
            <>
                <img className="robot" src={robotWait}/>
            </>
        )
    }

    const userSumbit= () =>{
        const Email = email.current.value
        const Username = userName.current.value
        const Role = userRol.current.value
        const localData = localStorage.getItem("userData")
        const decrypted = decryptData(localData,ENCRYPTION_KEY)
        const temp = JSON.parse(decrypted)

        const userInfo = {
            "email":Email,
            "companyId":temp[0].companyid,
            "role":Role,
            "Username":Username
        }


        console.log(temp[0])
        setWait(true)
        addWhiteList(Email,temp[0].companyid)
        addUser(userInfo)        
    }

    const checkIsAdmin = () =>{
        const localData = localStorage.getItem("userData")
        const decrypted = decryptData(localData,ENCRYPTION_KEY)
        const temp = JSON.parse(decrypted)
        const isAdmin = temp[0].isadmin
        console.log("isadmin",isAdmin)

        if(!isAdmin){
            navigate("/chat")
        }
    }

    const checkSigned = () =>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const User = user
              
              if(!localStorage.getItem("userFirebaseData")){
                localStorage.setItem("userFirebaseData",User)
              }

             
        
             
              
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate('/')
            }
          });
}

    useEffect(() =>{
        checkSigned()
        checkIsAdmin()
    },[])

    return(
        <div className="panelBody">
            <div className="panelHeader">
                <img src={Logo}/>
            </div>
            <div className="forms">
                <div className="infoForm">
                    <h1 className='formInfo'>Şirket Bilgileri</h1>
                    <input className="input" ref={companyName} placeholder="Şirket İsmi"/>
                    <input className="input" ref={companyRegion} placeholder="Şirket Sektörü"/>
                    <input className="input" ref={companyInfo} placeholder="Şirketin Kısaca Özeti"/>
                </div>
                <div className="infoForm">
                    <h1 className="formInfo">Kişiler</h1>
                    <input className="input" ref={userName} placeholder="İsim Soyisim"/>
                    <input className="input" ref={userRol} placeholder="Rolü"/>
                    <input className="input" ref={email} placeholder="Mail Adresi"/>
                    {!wait && userAddBT()}
                    {wait && waitBT()}
                </div>
            </div>
        </div>
    )
}


export default AdminPanel