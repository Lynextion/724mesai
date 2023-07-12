import "./chatScreen.css"
import axios from "axios"
import {useEffect, useState} from "react"
import ChatButton from "./ChatButton"
import CompanyLogo from "./svg/altin-logo-w-1.png"
import Add from "./svg/add.svg"
import Messages from "./messages"
import Commands from "./command"
import { v4 as uuidv4 } from 'uuid';



const ChatScreen = () =>{

    const messages = [{"role":"user","content":"hello"},{"role":"assistant","content":"hi Ata"},{"role":"user","content":"hello"}]

    const [topics,setTopics] = useState([''])
    const [collected,setCollected] = useState(false)
    const [messageIds,setMessageIds] = useState([])
    const [messageInfo,setMessageInfo] = useState([{}])
    let [allMessage, setAllMessage] = useState([{}])
    const [message,setMessage] = useState(messages)
    const [currentMessageId,setCurrentMessageId] = useState()
    const [send,setSend] = useState()

    const callTopics =  async ()  =>{

        const data = {"userId": "05c8b932-ff4c-4842-b741-f56d580cf728"}
        axios.post("http://localhost:4000/all-message",{data}).then((response) => {scrapTopics(response.data)})
    
    }

    const scrapTopics = (data) =>{
        
        const topic = data.map((data) =>{return(data.topic)}) 
        setTopics(topic)
        const tempMessageId = data.map((data) =>{return((data.messageId))})
        setMessageIds(tempMessageId)
        console.log("datadır bu ha",data)
        setAllMessage(data)

        const temp = []

        for(let i = 0 ; i < tempMessageId.length ; i++){
            temp.push({
                messageId:tempMessageId[i],
                topic:topic[i]
            })
        }
        console.log("mesaj idleri ",temp)
        setMessageInfo(temp)

        setTimeout(() => setCollected(true), 1000);
    }


    const handleClick= (e) =>{
        allMessage.map((data) =>{
            if (data.messageId === e){
                setMessage(data.messages)
            }
        })
        
        setCurrentMessageId(e)
    }
    

    const renderTopics = () =>{
        return(
            <>
               <ChatButton topic={messageInfo} handleClick={handleClick.bind(this)}/> 
            </>
        )
    }

    useEffect(() =>{
        callTopics()
    },[])

  
    const textAreaOnChange = (e) => {
        setSend(e.target.value)

    }

    const createNewTopic= () =>{
        const uuid = uuidv4()
    }

   

    const updateAllMessage =(id,data) =>{
        setMessage(prevState =>{
            return [...prevState,data]
        })
    }

    const sentMessage = async ()  =>{
        const body = {
            "userId": "05c8b932-ff4c-4842-b741-f56d580cf728",
            "messageId":currentMessageId,
            "message":{"role":"user","content":send}
        }
        console.log("body",body)
        updateAllMessage(currentMessageId,body.message)
        

        await axios.post("http://localhost:4000/message",{body}).then((response) => {
            updateAllMessage(currentMessageId,response.data)
        })
    }

    return(
        <div className="body">
            <div className="allChat">
                <div className="head">
                    <img src={CompanyLogo} className="companyLogo" />
                    
                </div>
                <div className="topicDiv">
                    <button className="addChat" onClick={createNewTopic}><img className="addSVG" src={Add} /><text className="topicText">Yeni mesaj</text></button>
                    <hr className="diveder"/>
                    {collected && renderTopics()}
                </div>
            </div>
            <div className="chat">
                <div className="messageContainer">
                    <Messages messages={message}/>
                </div>
                <div className="command">
                    <Commands/>
                    <div className="textArea">
                        <textarea className="commandEnter" value={send} onChange={textAreaOnChange}/>
                        <button className="sendMessage" onClick={sentMessage}><text className="topicText">Gönder</text></button>
                    </div>

                </div>
            </div>
            
        </div>
    )
}


export default ChatScreen