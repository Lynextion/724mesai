import "./chatScreen.css"
import axios from "axios"
import {useEffect, useState} from "react"
import ChatButton from "./ChatButton"
import CompanyLogo from "./svg/altin-logo-w-1.png"
import Add from "./svg/add.svg"
import Messages from "./messages"
import Commands from "./command"
import { v4 as uuidv4 } from 'uuid';
import React, {useRef} from "react"


const ChatScreen = () =>{

    const buttonRef = useRef(null)

    const messages = [{"role":"user","content":"hello"},{"role":"assistant","content":"hi Ata"},{"role":"user","content":"hello"}]

    const [topics,setTopics] = useState([''])
    const [collected,setCollected] = useState(false)
    const [messageIds,setMessageIds] = useState([])
    const [messageInfo,setMessageInfo] = useState([{}])
    let [allMessage, setAllMessage] = useState([{}])
    const [message,setMessage] = useState([])
    const [currentMessageId,setCurrentMessageId] = useState()
    const [send,setSend] = useState()
    const [newMessage,setNewMessage] = useState(false)

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
        setNewMessage(false)
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
        setMessage([])
        setNewMessage(true)
        setCurrentMessageId('')

    }

   

    const updateMessage =(data) =>{
        setMessage(prevState =>{
            return [...prevState,data]
        })
    }

    const sentMessage = async ()  =>{

        if(newMessage === false){

            const body = {
                "userId": "05c8b932-ff4c-4842-b741-f56d580cf728",
                "messageId":currentMessageId,
                "message":{"role":"user","content":send}
            }
            console.log("body",body)
            updateMessage(body.message)


            await axios.post("http://localhost:4000/message",{body}).then((response) => {
                updateMessage(response.data)
            })
        }

        else{
            const body = {
                "userId": "05c8b932-ff4c-4842-b741-f56d580cf728",
                "message":{"role":"user","content":send}
            }
            console.log("body",body)
            updateMessage(body.message)


            await axios.post("http://localhost:4000/create-message",{body}).then((response) => {
                updateMessage(response.data)
            })
            callTopics()
            setNewMessage(false)
        }

    }

    const handleKeyDown = (event) => {
        if(event.ctrlKey && event.key == 'Enter') {
            event.preventDefault()
            buttonRef.current.click()
            console.log("yea")
        }
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
                        <textarea className="commandEnter" placeholder="Try Me" onKeyDown={handleKeyDown} value={send} onChange={textAreaOnChange}/>
                        <button className="sendMessage" ref={buttonRef} onClick={sentMessage}><text className="topicText">Gönder</text></button>
                    </div>

                </div>
            </div>
            
        </div>
    )
}


export default ChatScreen