import "./chatScreen.css"
import axios from "axios"
import {useEffect, useState} from "react"
import ChatButton from "./ChatButton"
import CompanyLogo from "./svg/altin-logo-w-1.png"
import Add from "./svg/add.svg"
import Messages from "./messages"
import Commands from "./command"
import React, {useRef} from "react"
import robotWait from "./svg/robotWait.gif"
import {  signOut ,onAuthStateChanged} from "firebase/auth";
import {auth} from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js'
import UserScreen from "./userScreen"
import UserTasks from "./userTasks"
import * as Tabs from '@radix-ui/react-tabs';
import Messaging from "./messagin"


const ChatScreen = () =>{

    const buttonRef = useRef(null)
    const bottomScroll = useRef(null)

    const ENCRYPTION_KEY = 'o7UZXkzXFp3iMbGpJqF3hbilW1tcwCxfBDDgVZXrmO4dLE62kYcawIVvS5EULxtE'

    const encryptData = (data, key) => {
        const encrypted = CryptoJS.AES.encrypt(data, key).toString();
        return encrypted;
      };

    const decryptData = (data,key) =>{
        const decryptedData = CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    }
    
    
    const [collected,setCollected] = useState(false)
    const [messageInfo,setMessageInfo] = useState([{}])
    let [allMessage, setAllMessage] = useState([{}])
    const [message,setMessage] = useState([])
    const [currentMessageId,setCurrentMessageId] = useState()
    const [send,setSend] = useState()
    const [newMessage,setNewMessage] = useState(false)
    const [activate,setActivate] = useState(true)
    const [disabled,setDisabled] = useState(false)
    const[pageLoaded,setPageLoaded] = useState(false)
    const [showTopic,setShowTopic] = useState(true)
    
    const tempLocal = decryptData(localStorage.getItem("userData"),ENCRYPTION_KEY)
    const tempInfo = JSON.parse(tempLocal)
    const userInfo = tempInfo[0]
    const tempuserId = userInfo.id
    const [userId,setUserId] = useState(tempuserId)
   

    const navigate = useNavigate()

    const {name} = useParams()

    const checkSigned = () =>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const User = user
              
              if(!localStorage.getItem("userFirebaseData")){
                const encryptedData = encryptData(user,ENCRYPTION_KEY)
                localStorage.setItem("userFirebaseData",encryptedData)
              }

             
              console.log("userInfo ", userId)

              callTopics()
              
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate(`/${name}/`)
            }
          });
    }

    const axiosInstance = axios.create({
        baseURL:"http://localhost:4000",
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
          },
    })

    

    const callTopics =  async ()  =>{

        try{

        
            const data = {"userId": userId}
            console.log(data)
            axiosInstance.post("/all-message",{data}).then((response) => {scrapTopics(response.data)})
            
        }
        catch(err){
            return(<>
                <h1>Sunucuda bir problem yaşandı lütfen sayfayı yenileyiniz</h1>
            </>)
        }
    }

    const scrapTopics = (data) =>{
        
        const topic = data.map((data) =>{return(data.topic)}) 
        const tempMessageId = data.map((data) =>{return((data.messageId))})
        
        console.log("datadır bu ha",data)
        setAllMessage(data)

        const date = data.map((data) =>{
            return(data.date)
        })

        const temp = []

        for(let i = 0 ; i < tempMessageId.length ; i++){
            temp.push({
                messageId:tempMessageId[i],
                topic:topic[i],
                date:date[i]
            })
        }
        console.log("mesaj idleri ",temp)
        setMessageInfo(temp)

        setTimeout(() => setCollected(true), 1000);
        setPageLoaded(true)
    }


    const handleClick= (e) =>{
        allMessage.map((data) =>{
            if (data.messageId === e){
                setMessage(data.messages)
            }
        })
        
        setCurrentMessageId(e)
        console.log("e")
        setNewMessage(false)
    }
    

    const renderTopics = () =>{
        return(
            <>
               <ChatButton topic={messageInfo} handleClick={handleClick.bind(this)} deleteChat={deleteMessage.bind(this)}/> 
            </>
        )
    }

    const findCompany = async() =>{

        const body ={
            name:name
        }

        const companyInfo = await axiosInstance.post("/findCompanyByName",{body}).then((response) => {return response.data})
        console.log(companyInfo)
        if(companyInfo === "No Company Found"){
            navigate(`/${name}/`)
            console.log("noooy")
        }

        else{
            
            checkSigned()
        }
    }

   


    useEffect(() =>{
        findCompany()
        
    },[])

  
    const textAreaOnChange = (e) => {
        setSend(e.target.value)
        e.target.value = ''

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

    const tempUpdateMessage = (message,id) =>{
        console.log("lalala",message,id)
        allMessage.map((data) =>{
            if (data.messageId === id){
                console.log("listtt",data.messages)
                data.messages.push(message)
                setMessage(data.messages)
            }
        })
    }

    const sentMessage = async ()  =>{
        

        if(setActivate){
            const tempMessageId = currentMessageId
            if(newMessage === false){
                setActivate(false)
                setDisabled(true)
                const body = {
                    "userId": userId,
                    "messageId":tempMessageId,
                    "message":{"role":"user","content":send}
                }
                setSend('')
                console.log("body",body)
                tempUpdateMessage(body.message,tempMessageId)
                bottomScroll.current.scrollIntoView({behavior:'smooth'})

                await axiosInstance.post("/message",{body}).then((response) => {
                    tempUpdateMessage(response.data,tempMessageId)
                }).then(() => setActivate(true)).then(() => setDisabled(false))
                bottomScroll.current.scrollIntoView({behavior:'smooth'})
            }

            else{

                setActivate(false)
                setDisabled(true)
                setDisabled('')
                console.log("191 ",userId)
                const body = {
                    "userId": userId,
                    "message":{"role":"user","content":send}
                }
                console.log("body",body)
                updateMessage(body.message)
                bottomScroll.current.scrollIntoView({behavior:'smooth'})

                await axiosInstance.post("/create-message",{body}).then((response) => {
                    updateMessage(JSON.parse(response.data.result))
                    console.log("response result",response.data.result)
                    setCurrentMessageId(response.data.messageId)
                }).then(() => setActivate(true)).then(() => setDisabled(false))
                callTopics()
                setNewMessage(false)
                bottomScroll.current.scrollIntoView({behavior:'smooth'})
            }

    }

    }

    const handleKeyDown = (event) => {

        try{

            if(event.ctrlKey && event.key == 'Enter') {
                event.preventDefault()
                buttonRef.current.click()
                console.log("yea")
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const deleteMessage =  async (id) =>{
        await axiosInstance.get(`/delete-message/${id}`).then(() => callTopics() )
    }

    const wait = () =>{

        return(
            <>
            { !activate && <img className="robot" src={robotWait}/>}
            {activate && <button className="sendMessage" disabled={disabled} ref={buttonRef} onClick={sentMessage}><text className="topicText">Gönder</text></button>}
            </>
        )
    }

    const pageLoading = () =>{

        return(
            <>
            <img src={robotWait}/>
            </>
        )
    }

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate(`/${name}/`);
            localStorage.removeItem("userData")
            localStorage.removeItem("userFirebaseData")
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
    

    const page = () =>{
        return(
            <>
            <div className="allChat">
                <div className="head">
                    <img src={CompanyLogo} className="companyLogo" />
                   
                    
                </div>
                {showTopic && (
                <div className="topicDiv" disabled={true}>
                     <Tabs.Root className="TabsRoot" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Manage Chat Mode">
                    <Tabs.Trigger className="TabsTrigger" value="tab1">
                        ChatBot
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger" value="tab2">
                        Messages
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="TabsContent" value="tab1">
                    <button className="addChat" onClick={createNewTopic}><img className="addSVG" src={Add} /><text className="topicText">Yeni mesaj</text></button>
                    <hr className="diveder"/>
                    {collected && renderTopics()}
                    </Tabs.Content>
                    <Tabs.Content className="TabsContent" value="tab2">
                        <Messaging/>
                    </Tabs.Content>
                   </Tabs.Root>
                </div>
                )}
                <UserTasks userId={tempuserId}  />
                <hr className="diveder"/>
                <UserScreen signOut={handleLogout.bind(this)}/>
               
            </div>
            <div className="chat">
                <div  ref={bottomScroll} className="messageContainer">
                    <Messages messages={message}/>
                    <div ></div>
                </div>
                <div className="command">
                    <Commands/>
                    <div className="textArea">
                        <textarea className="commandEnter" placeholder="Try Me" onKeyDown={handleKeyDown} value={send} onChange={textAreaOnChange}/>
                        {wait()}
                        
                    </div>

                </div>
            
            </div>
            </>
        )
    }

    return(
        <div className="body">
            {pageLoaded && page()}
            {!pageLoaded && pageLoading()}
            
        </div>
    )
}


export default ChatScreen