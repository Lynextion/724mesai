const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { spawn } = require('child_process');
const fs = require("fs")
const db = require("./dbConnect")
const { execFile } = require('child_process');
const path = require('path');


const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cors())

app.get("/",(req,res) =>{
    res.json("Hellooo")
})



app.post("/message", async (req,res) => {

  console.log(req.body.body)

  const userId = req.body.body.userId
  const userMessaage = req.body.body.message

  
  const messageInfo = await db.receiveMessage(req.body.body.messageId)
  const companyInfo = await db.findCompany(userId)
  const userInfo = await db.findUser(userId)

  const JSONmessage = messageInfo.messages.map((data) => {
    return JSON.parse(data)
  })
  JSONmessage.push(userMessaage)
  console.log("json message  ",JSONmessage)

  const messages = {
    "userInfo":{

      "userId":userId,
      "userName":userInfo.name,
      "role":userInfo.role,
      "companyId":companyInfo.id

    },

    "messageInfo":{
      "messageId":req.body.body.messageid,
      "message":JSONmessage,
      "topic":messageInfo.topic,
      "date":messageInfo.date
      
    },

    "companyInfo":{
      "companyName":companyInfo.name,
      "companyId":companyInfo.id,
      "sector":companyInfo.sector
    }

  }



 //Python için arguments eklenecek
  
  const pythonScriptPath = path.join("main.py")

  let result = ''; // Store the result from the Python script

// Capture the output of the Python process
execFile('python3', [pythonScriptPath, JSON.stringify(messages)],(error,stdout,stderr) => {
  // Append the received data to the result variable

  if(error){
    console.log(error)
    return
  }

  result += stdout;
  console.log("resil;t",result)
  data = result
  const updatedMessages = {
    "userInfo":{

      "userId":userId,
      "userName":userInfo.name,
      "role":userInfo.role,
      "companyId":companyInfo.id

    },

    "messageInfo":{
      "messageId":messageInfo.messageid,
      "message":[userMessaage,JSON.parse(data)],
      "topic":messageInfo.topic,
      "date":messageInfo.date
      
    },

    "companyInfo":{
      "companyName":companyInfo.name,
      "companyId":companyInfo.id,
      "sector":companyInfo.sector
    }

  }
  console.log("i call")
  db.addMessage(updatedMessages)
  res.send(result); 
  
});

// Handle the completion of the Python process


})

app.post("/create-message", async (req,res) =>{

    const userId = req.body.body.userId
    const userMessaage = req.body.body.message
  

    const messageInfo = await db.createMessage(userId,userMessaage)
    const companyInfo = await db.findCompany(userId)
    const userInfo = await db.findUser(userId)

    const messages = {
      "userInfo":{

        "userId":userId,
        "userName":userInfo.name,
        "role":userInfo.role,
        "companyId":companyInfo.id

      },

      "messageInfo":{
        "messageId":messageInfo.messageid,
        "message":[JSON.parse(messageInfo.messages)],
        "topic":messageInfo.topic,
        "date":messageInfo.date
        
      },

      "companyInfo":{
        "companyName":companyInfo.name,
        "companyId":companyInfo.id,
        "sector":companyInfo.sector
      }

    }

   

   

  
   //Python için arguments eklenecek
   const pythonScriptPath = path.join("main.py")

   let result = ''; // Store the result from the Python script
 
 // Capture the output of the Python process
 execFile('python3', [pythonScriptPath, JSON.stringify(messages)],(error,stdout,stderr) => {
   // Append the received data to the result variable
   result += stdout;
   console.log("stdd ",result)
   data = result
   const updatedMessages = {
     "userInfo":{
 
       "userId":userId,
       "userName":userInfo.name,
       "role":userInfo.role,
       "companyId":companyInfo.id
 
     },
 
     "messageInfo":{
       "messageId":messageInfo.messageid,
       "message":[JSON.parse(result)],
       "topic":messageInfo.topic,
       "date":messageInfo.date
       
     },
 
     "companyInfo":{
       "companyName":companyInfo.name,
       "companyId":companyInfo.id,
       "sector":companyInfo.sector
     }
 
   }
   console.log("i call",updatedMessages)
   db.addMessage(updatedMessages)
   res.send(result); 
   
 });

  // Handle the completion of the Python process
  
})

app.post("/all-message", async (req,res) => {
  
  console.log("reqqq" ,req)
  const userId = req.body.data.userId

  const messageData = await db.allMessage(userId)
  

  
    const data = messageData.map((data) =>{
      return {
        messageId : data.messageid,
        companyId : data.companyid,
        date : data.date,
        messages: data.messages.map((object) => {return(JSON.parse(object))}),
        topic : data.topic,
        userid : data.userId
      }
    })
    console.log("adataaa ",data)
    res.send(data)
  
  

})

app.post("/collect-message", async (req,res) => {
  const messageId = req.body.messageId

  const messageInfo = await db.receiveMessage(messageId)
  

  const message = messageInfo.messages.map((data) => {
    return JSON.parse(data)
  })

  const updatedData ={
    messageid : messageInfo.messageid,
    companyid : messageInfo.companyid,
    date : messageInfo.date,
    messages : message,
    topic : messageInfo.topic,
    userid : messageInfo.userid
  }
  
  res.send(updatedData)

})


app.post("/collect-users", async(req,res) =>{
  
  const companyId = req.body.companyId

  const userInfo = db.findUsers(companyId);

  res.send(userInfo)


})

app.post("/add-user", async (req,res) => {
  const userInfo = {
    userName:req.body.userName,
    companyId:req.body.companyId,
    role:req.body.role,
    firebaseId:req.body.firebaseId
  }

  db.addUser(userInfo)

  res.send(100)

})

app.post("/update-user", async(req,res) =>{
  const userInfo = {
      userName:req.body.userName,
      companyId:req.body.companyId,
      role:req.body.role,
      avatar:req.body.avatar
  }
  console.log(userInfo)
  db.updateUser(userInfo)

})

app.get("/delete-message/:id",async (req,res) =>{
  const messageId = req.params.id
  
  await db.deleteMessage(messageId)

  res.json({"status":"done"})
})

app.post("/insert-whitelist" ,async (req,res) =>{

  const data = req.body.body


  await db.insertWhiteList(data)

  res.json({"status":"done"})
  
})


app.post("/user",async (req,res) => {
  const data = req.body.body.userId

  res.send(await db.findUser(data))


})

app.post("/insertId",async(req,res) => {
  const data = req.body.body

  await db.addFirebaseId(data)

  res.send("done")
})

app.post("/fİndUserwithEmail",async(req,res) =>{
  const data = req.body.body

  res.send(await db.findUserwithEmail(data))
})

app.post("/findUserwithUID", async (req,res) => {
  const uid = req.body.body.uid

  const user = await db.findUserUID(uid)

  res.json(user)

})

app.post("/getWhitelist", async (req,res) =>{
  const id = req.body.body.id

  const list = await db.getWhitelist(id)

  res.send(list.whitelist_email)
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})