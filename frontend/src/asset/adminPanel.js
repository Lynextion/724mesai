import "./adminPanel.css"
import Logo from "./svg/altin-logo-w-1.png"
import { useRef, useState } from "react"
import { generatePassword } from "./generate password"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {auth} from "../firebase"
import axios from "axios"
import robotWait from "./svg/robotWait.gif"

const AdminPanel = () =>{

    const companyName = useRef(null)
    const companyRegion = useRef(null)
    const companyInfo = useRef(null)

    const userName = useRef(null)
    const userRol = useRef(null)
    const email = useRef(null)
    

    const [wait,setWait] = useState(false)

    const addWhiteList = (email,id) =>{
        const body = {
            "email":email,
            "id":id
        }
        axios.post("http://localhost:4000/insert-whitelist",{body})
        .then(() =>{
            setWait(false)
        })
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
        const temp = JSON.parse(localStorage.getItem("userData"))
        console.log(temp[0])
        setWait(true)
        addWhiteList(Email,temp[0].companyid)
        
    }

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