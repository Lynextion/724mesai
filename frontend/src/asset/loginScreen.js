import "./loginScreen.css"
import { useEffect, useRef, useState } from "react"
import left from "./svg/left.svg"
import right from "./svg/right.svg"
import logo from "./svg/altin-logo-w-1.png"
import {  signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth"
import {auth} from "../firebase"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import CryptoJS from "crypto-js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginScreen = () =>{

    const ENCRYPTION_KEY = 'o7UZXkzXFp3iMbGpJqF3hbilW1tcwCxfBDDgVZXrmO4dLE62kYcawIVvS5EULxtE'

    const encryptData = (data, key) => {
        const encrypted = CryptoJS.AES.encrypt(data, key).toString();
        return encrypted;
      };

    const decryptData = (data,key) =>{
        const decryptedData = CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    }

    
    const tips = [{
        title : "Kelime sayısı konusunda net olun.",
        context: "Asitanınızdan bir şey oluşturmasını istediğinizde, istediğiniz kelime sayısını belirtin. Örneğin, “Dijital Pazarlama hakkında 100 kelimelik bir makale yaz.” şeklinde yazın.  Ancak iyi bir uygulama olarak, ihtiyacınızdan daha yüksek bir kelime sayısı belirtmeniz daha iyidir. Çünkü böylece istemediğiniz kısımları çıkarabilir ve mükemmel bir içerik oluşturabilirsiniz."

    },
    {
        title:"Test",
        context:"Testie"
    }
    ]

    const axiosInstance = axios.create({
        baseURL:"http://localhost:4000",
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
          },
    })

    const [tipCounter,setTipCounter] = useState(0)
    const [companyFound,setCompanyFound] = useState(true)

    const email = useRef(null)
    const password = useRef(null)

    const navigate = useNavigate()
    const {name} = useParams()

    const showTips = () =>{
        return(
            <div className="tips">
                    <h1 className="tipsHeader">{tips[tipCounter].title}</h1>
                    <p className="tipsContext">{tips[tipCounter].context}</p>
            </div>
        )
    }

    const forwardTips = () => {
        
        if (tipCounter === tips.length - 1){
            
            setTipCounter(() => {return 0})
        }

        else{
            setTipCounter(previous =>{
                return previous + 1
            })
        }
    }

    const previousTips = () => {
        if(tipCounter - 1 < 0){
            setTipCounter(() => {return tips.length - 1})
        }

        else{
            setTipCounter((previous) => {return previous -1 })
        }
    }

    const checkSigned = () =>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const data = user
              getUser(data.uid)
              const JSONdata = JSON.stringify(data)
              const encrypted = encryptData(JSONdata,ENCRYPTION_KEY)
              localStorage.setItem("userFirebaseData",encrypted)
              
              
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });
}

    const onSubmit = async () =>{
        const Email = email.current.value
        const Password = password.current.value
        
        await signInWithEmailAndPassword(auth,Email,Password)
        .then((userCredential) =>{
            const user = userCredential.user
            toast.success('🦄 Wow so easy!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            saveLocalStorage(user)
            console.log(user)
            return user.uid
        })
        .then( (uid) =>{
                getUser(uid)
        })
        .then(() => checkSigned())


    }

    const getUser = async (uid) =>{
        const body = {"uid":uid}
        axiosInstance.post("findUserwithUID",{body})
        .then((response) => {
            console.log("user response ",response.data)
            const JSONdata = JSON.stringify(response.data)
            const encrypted = encryptData(JSONdata,ENCRYPTION_KEY)
            localStorage.setItem("userData",encrypted)
        }).then(() =>{navigate(`/${name}/chat`)})
    }

    const findCompany = async() =>{

        const body ={
            name:name
        }

        const companyInfo = await axiosInstance.post("/findCompanyByName",{body}).then((response) => {return response.data})
        console.log(companyInfo)
        if(companyInfo === "No Company Found"){
            setCompanyFound(false)
            console.log("noooy")
        }

        else{
            setCompanyFound(true)
            checkSigned()
        }
    }

    useEffect(() =>{
        findCompany()
    },[])

    const saveLocalStorage = async (data) => {
        const JSONdata = JSON.stringify(data)
        const encrypted = encryptData(JSONdata,ENCRYPTION_KEY)
        localStorage.setItem("userFirebaseData",encrypted)
    }

    const form = () =>{
        return(
            <>
            <div className="loginSide">
                <div className="loginForm">
                        <img className="logo" src={logo} />
                        <input className="email"   type="email" ref={email}  placeholder="Mail Adresi"/>
                        <input className="password" type="password" ref={password} placeholder="Şifre"/>
                        <button className="submit" onClick={onSubmit} ><text className="submitText">Gönder</text></button>
                
                </div>
            </div>
            <div className="infoSide">
               <button className="sliderBT" onClick={previousTips}> <img src={left}/> </button>
                {showTips()}
               <button className="sliderBT" onClick={forwardTips}> <img src={right}/> </button>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            </>
        )
    } 
    
    const error = () =>{
        return(
            <>
                <h1>Company Not Found</h1>
            </>
        )
    }

    return(
        <div className="body">
            {companyFound && form() }
            {!companyFound && error()}
        </div>
    )
}


export default LoginScreen