import "./loginScreen.css"
import { useRef, useState } from "react"
import left from "./svg/left.svg"
import right from "./svg/right.svg"
import logo from "./svg/altin-logo-w-1.png"

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

   

    return(
        <div className="body">
            <div className="loginSide">
                <div className="loginForm">
                        <img className="logo" src={logo} />
                        <input className="email" type="email" placeholder="Mail Adresi"/>
                        <input className="password" type="password" placeholder="Şifre"/>
                        <button className="submit" ><text className="submitText">Gönder</text></button>
                
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