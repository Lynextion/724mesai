import Add from "./svg/add.svg"
import "./chatScreen.css"

const Messaging = () =>{

    return(
        <div >
            <button className="addChat" ><img className="addSVG" src={Add} /><text className="topicText">Yeni mesaj</text></button>
            <hr className="diveder"/>
        </div>
    )
}


export default Messaging