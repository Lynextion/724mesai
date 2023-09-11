const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { spawn } = require('child_process');
const fs = require("fs")
const db = require("./dbConnect")
const { execFile } = require('child_process');
const path = require('path');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');

const API_KEY = process.env.API_KEY

const app = express()
const port = 4000

const allowedOrigins = ["http://localhost:3000"]


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(origin)
      callback(null, true);
    } else {
      callback(new Error(origin));
    }
  }
};

const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply the API key validation middleware to all routes

app.use(cors(corsOptions))
app.options('*',cors(corsOptions))

app.use(validateApiKey)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))


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
      "sector":companyInfo.sector,
      "companyInfo":companyInfo.companyinfo
    }

  }

  console.log("companyinfo",messages.companyInfo)


 //Python için arguments eklenecek
  
  const pythonScriptPath = path.join("main.py")

  let result = ''; // Store the result from the Python script

// Capture the output of the Python process
execFile('python3', [pythonScriptPath, JSON.stringify(messages)], async (error,stdout,stderr) => {
  // Append the received data to the result variable

  if(error){
    console.log(error)
    return
  }

  result += stdout;
  console.log("resil;t",result)
  tempData = JSON.parse(result)
  data = {
    "role":tempData.role,
    "content":tempData.content
  }

  if(tempData.taskCreated === "yes"){
    await db.createTask(tempData.task,userId)
  }

  if(tempData.taskCalled === "yes"){
    const tasks = await db.showTasks(userId)
    const messagedata = JSON.parse(tasks.tasks)
    const message = {"role":"assistant","content":`The current task are ${messagedata.task_name} `} 
    data.content = messagedata.task_name
    result = message
  }
  

  const updatedMessages = {
    "userInfo":{

      "userId":userId,
      "userName":userInfo.name,
      "role":userInfo.role,
      "companyId":companyInfo.id

    },

    "messageInfo":{
      "messageId":messageInfo.messageid,
      "message":[userMessaage,data],
      "topic":messageInfo.topic,
      "date":messageInfo.date
      
    },

    "companyInfo":{
      "companyName":companyInfo.name,
      "companyId":companyInfo.id,
      "sector":companyInfo.sector,
      "companyInfo":companyInfo.companyinfo
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
        "sector":companyInfo.sector,
        "companyInfo":companyInfo.companyinfo
      }

    }

   

   

  
   //Python için arguments eklenecek
   const pythonScriptPath = path.join("main.py")

   let result = ''; // Store the result from the Python script
 
 // Capture the output of the Python process
 execFile('python3', [pythonScriptPath, JSON.stringify(messages)],async (error,stdout,stderr) => {
   // Append the received data to the result variable

   if(!error){

   result += stdout;
   console.log("stdd ",result)
   tempData = JSON.parse(result)
   data = {
     "role":tempData.role,
     "content":tempData.content
   }

   if(tempData.taskCreated === "yes"){
    await db.createTask(tempData.task,userId)
  }

  if(tempData.taskCalled === "yes"){
    const tasks = await db.showTasks(userId)
    const messagedata = JSON.parse(tasks.tasks)
    const message = {"role":"assistant","content":`The current task are ${messagedata.task_name} `} 
    data.content = messagedata.task_name
    result = message
  }


   const updatedMessages = {
     "userInfo":{
 
       "userId":userId,
       "userName":userInfo.name,
       "role":userInfo.role,
       "companyId":companyInfo.id
 
     },
 
     "messageInfo":{
       "messageId":messageInfo.messageid,
       "message":[data],
       "topic":messageInfo.topic,
       "date":messageInfo.date
       
     },
 
     "companyInfo":{
       "companyName":companyInfo.name,
       "companyId":companyInfo.id,
       "sector":companyInfo.sector,
       "companyInfo":companyInfo.companyinfo
     }
 
   }
   console.log("i call",updatedMessages)
   db.addMessage(updatedMessages)
   const sendedData = {
    result:result,
    messageId:updatedMessages.messageInfo.messageId
   }
   res.send(sendedData); 
  }
  else(
    console.log(error)
  )
   
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
        userid : userId
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
    userName:req.body.body.userName,
    companyId:req.body.body.companyId,
    role:req.body.body.role,
    email:req.body.body.email
  }

  const id = uuidv4()

  db.addUser(userInfo,id)
  console.log('id id id ',id)
  res.send(id)

})

app.post("/update-user", async(req,res) =>{
  const userInfo = {
      userName:req.body.body.UserName,
      userId:req.body.body.userId,
      companyId:req.body.body.companyId,
      role:req.body.body.role,
  }
  console.log(userInfo)
  db.updateUser(userInfo)

})

app.post("/verifiy-user",async(req,res) =>{
  console.log(req.body.body)
  const userInfo = {
    email:req.body.body.email,
    uid:req.body.body.uid
  }

  await db.verifyUser(userInfo)

  res.json({"status":"done"})
    
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
  const name = req.body.body.name

  const list = await db.getWhitelist(name)

  res.send(list.whitelist_email)
})


app.post("/findCompanyByName", async (req,res) => {
  const name = req.body.body.name

  const info = await db.findCompanyByName(name)
  console.log(info)

  if(info.length !== 0){
    res.send(info)
  }

  else{
    res.send("No Company Found")
  }

})

app.post("/addWorkerId", async (req,res) => {
  const id = req.body.body.workerId
  const companyId = req.body.body.companyId
  console.log("iddddd",id)

  await db.addWorkerId(id,companyId)
  res.sendStatus(200)
})

app.post("/getAvatar",async (req,res) =>{
  const id = req.body.body.id
  const avatar = await db.getUserAvatar(id)

  res.send(avatar)
  
})

app.post("/updateUserData",async (req,res) =>{
  const func = req.body.body.func

  if(func === 'userName'){
    await db.updateUserName(req.body.body)
    res.send("Done")
  }

  if(func === 'role'){
    await db.updateRole(req.body.body)
    res.send("Done")
  }

  if(func === 'email'){
    await db.updateEmail(req.body.body)
    res.send("Done")
  }

})

app.post("/updateCompany", async (req,res) =>{
  console.log(req.body.body)
  await db.updateCompany(req.body.body)
  res.send("Done")
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})