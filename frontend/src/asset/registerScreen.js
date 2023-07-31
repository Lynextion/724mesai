import { useRef, useState } from "react"
import "./registerScreen.css"
import regLogo from "./svg/wrapper.svg"
import left from "./svg/left.svg"
import right from "./svg/right.svg"
import {auth} from "../firebase"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const RegisterScreen = () => {

    const email = useRef(null)
    const password = useRef(null)
    const tempPassword =useRef(null)

    const {name} = useParams()

    const axiosInstance = axios.create({
        baseURL:"http://localhost:4000",
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
          },
    })
    
    const verifyUser = (email,uid) => {
        
        const body = {
            "email":email,
            "uid":uid
        }

        console.log(body)

        axiosInstance.post("/verifiy-user",{body}).then(() => {navigate("/chat")})

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

    const navigate = useNavigate()

    const [tipCounter,setTipCounter] = useState(0)
    
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

    

    const registerUser = async (Email,Password) =>{
        await createUserWithEmailAndPassword(auth,Email,Password)
            .then((userRecord) =>{
                console.log("succesfull:",userRecord.user.uid)
                verifyUser(Email,userRecord.user.uid)
                
            })
            .catch((error) =>{
                console.log("errr:",error)
            })
    }

    const getWhitelist = async () =>{
        
        const body = {
            "name":name
        }

       const whitelist = await axiosInstance.post("/getWhitelist",{body})
        .then((response) => {
           return response.data
        })

        return whitelist
    }

    const submit = async () =>{
        const Email = email.current.value
        const Password = password.current.value
        const TempPassword = tempPassword.current.value
        const whitelist = await getWhitelist()

        if(whitelist.includes(Email)){
            if(Password === TempPassword){
                registerUser(Email,Password)

            }
            else{
                console.log("Password do not match")
            }
        }

        else{
            console.log("hirsizz varrr")
            console.log(Email,'  ',whitelist)
        }
    }

    return(
        <div className="registerBody">
            <div className="registerSide">
                <div className="form">
                    <input className="email" ref={email} placeholder="email" />
                    <input className="password" ref={password} placeholder="Şifre" />
                    <input className="password" ref={tempPassword} laceholder="Şifre Tekrar"/>
                    <button className="submitRegister" onClick={submit}><img src={regLogo} />    <p className="registerText">Kayıt Ol</p></button>
                </div>
            </div>
            <div className ="infoSide">
                <button className="sliderBT" onClick={previousTips} > <img src={left}/> </button>
                    {showTips()}
               <button className="sliderBT" onClick={forwardTips}> <img src={right}/> </button>
            </div>
        </div>
    )
}


export default RegisterScreen