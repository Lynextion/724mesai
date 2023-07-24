import "./loginScreen.css"
import { useEffect, useRef, useState } from "react"
import left from "./svg/left.svg"
import right from "./svg/right.svg"
import logo from "./svg/altin-logo-w-1.png"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth"
import {auth} from "../firebase"
import { useNavigate } from "react-router-dom"

const LoginScreen = () =>{


    const tips = [{
        title : "Kelime sayısı konusunda net olun.",
        context: "Asitanınızdan bir şey oluşturmasını istediğinizde, istediğiniz kelime sayısını belirtin. Örneğin, “Dijital Pazarlama hakkında 100 kelimelik bir makale yaz.” şeklinde yazın.  Ancak iyi bir uygulama olarak, ihtiyacınızdan daha yüksek bir kelime sayısı belirtmeniz daha iyidir. Çünkü böylece istemediğiniz kısımları çıkarabilir ve mükemmel bir içerik oluşturabilirsiniz."

    },
    {
        title:"Test",
        context:"Testie"
    }
    ]

    const [tipCounter,setTipCounter] = useState(0)
    const [btPressed,setBTPressed] = useState(false)
    const [tempEmail,setTempEmail] = useState('')
    const [tempPassword,setTempPassword] = useState('')

    const email = useRef(null)
    const password = useRef(null)

    const navigate = useNavigate()

    const showTips = () =>{
        return(
            <div className="tips">
                    <h1 className="tipsHeader">{tips[tipCounter].title}</h1>
                    <p className="tipsContext">{tips[tipCounter].context}</p>
            </div>
        )
    }

    const forwardTips = () => {
        const length = tipCounter.length

        if (tipCounter == length){
            setTipCounter(0)
        }

        else{
            setTipCounter(previous =>{
                return previous + 1
            })
        }
    }

    const checkSigned = () =>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              
              navigate("/chat")
              
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
            console.log(user)
        }).then(() => checkSigned())


    }

    useEffect(() =>{
        checkSigned()
    },[])
  

    return(
        <div className="body">
            <div className="loginSide">
                <div className="loginForm">
                        <img className="logo" src={logo} />
                        <input className="email"   type="email" ref={email}  placeholder="Mail Adresi"/>
                        <input className="password" type="password" ref={password} placeholder="Şifre"/>
                        <button className="submit" onClick={onSubmit} ><text className="submitText">Gönder</text></button>
                
                </div>
            </div>
            <div className="infoSide">
               <button className="sliderBT"> <img src={left}/> </button>
                {showTips()}
               <button className="sliderBT" onClick={forwardTips}> <img src={right}/> </button>
            </div>

        </div>
    )
}


export default LoginScreen