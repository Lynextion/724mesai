import "./adminPanel.css"
import Logo from "./svg/altin-logo-w-1.png"
import { useRef } from "react"
import { generatePassword } from "./generate password"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {auth} from "../firebase"
import axios from "axios"

const AdminPanel = () =>{

    const companyName = useRef(null)
    const companyRegion = useRef(null)
    const companyInfo = useRef(null)

    const userName = useRef(null)
    const userRol = useRef(null)
    const email = useRef(null)

    const addWhiteList = (email) =>{
        const data = {
            email:email
        }
        axios.post("http://localhost:4000/insert-whitelist")
    }

    
    const userSumbit= () =>{
        const Email = email.current.value
        
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
                    <button className="addUserBT" onClick={userSumbit}><p className="btP">Kişi Ekle</p></button>
                </div>
            </div>
        </div>
    )
}


export default AdminPanel