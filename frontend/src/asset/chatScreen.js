import "./chatScreen.css"
import axios from "axios"
import {useEffect, useState} from "react"
import ChatButton from "./ChatButton"
import CompanyLogo from "./svg/altin-logo-w-1.png"
import Add from "./svg/add.svg"
import Messages from "./messages"
import Commands from "./command"

const ChatScreen = () =>{

    const messages = [{"role":"user","content":"hello"},{"role":"system","content":"hi Ata"},{"role":"user","content":"hello"}]

    const [topics,setTopics] = useState([''])
    const [collected,setCollected] = useState(false)
    const [messageId,setMessageId] = useState([])
    const [messageInfo,setMessageInfo] = useState([{}])
    

    const callTopics =  async ()  =>{

        const data = {"userId": "c22d5518-6154-4887-bf92-7461f7d0f565"}
        axios.post("http://localhost:4000/all-message",{data}).then((response) => {scrapTopics(response.data)})
    
    }

    const scrapTopics = (data) =>{
        
        const topic = data.map((data) =>{return(data.topic)}) 
        setTimeout(() => setCollected(true), 1000);

        setTopics(topic)
        
        const messageId = data.map((data) => {return(data.messageid)})
        
        setMessageId(messageId)

        

    }



    const renderTopics = () =>{
        return(
            <>
               <ChatButton topic={topics}/> 
            </>
        )
    }

    useEffect(() =>{
        callTopics()
    },[])


    return(
        <div className="body">
            <div className="allChat">
                <div className="head">
                    <img src={CompanyLogo} className="companyLogo" />
                    
                </div>
                <div className="topicDiv">
                    <button className="addChat"><img className="addSVG" src={Add} /><text className="topicText">Yeni mesaj</text></button>
                    <hr className="diveder"/>
                    {collected && renderTopics()}
                </div>
            </div>
            <div className="chat">
                <div className="messageContainer">
                    <Messages messages={messages}/>
                </div>
                <div className="command">
                    <Commands/>
                    <div className="textArea">
                        <textarea className="commandEnter"/>
                        <button className="sendMessage"><text className="topicText">Gönder</text></button>
                    </div>

                </div>
            </div>
            
        </div>
    )
}


export default ChatScreen