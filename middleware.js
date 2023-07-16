const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { spawn } = require('child_process');
const fs = require("fs")
const db = require("./dbConnect")

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
  console.log(JSONmessage)

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

  fs.writeFile("./messages.json",JSON.stringify(messages),err =>{
    if(err && !messages)
        console.log("err")
  })


 //Python için arguments eklenecek
  const pythonProcess = spawn("python3",["./main.py"])

  let result = ''; // Store the result from the Python script

// Capture the output of the Python process
pythonProcess.stdout.on('data', (data) => {
  // Append the received data to the result variable
  result += data;
  data = JSON.parse(result)
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
      "sector":companyInfo.sector
    }

  }
  console.log("i call")
  db.addMessage(updatedMessages)
 
  
});

// Handle the completion of the Python process
pythonProcess.on('close', (code) => {
  if (code === 0) {
    // Python script executed successfully


    res.send(result); // Send the result back to the client
  } else {
    // Python script encountered an error
    console.error(`Python process exited with code ${code}`);
    res.status(500).send('Internal Server Error');
  }
});

// Handle any errors that occur during the Python process
pythonProcess.on('error', (error) => {
  console.error(`Python process error: ${error.message}`);
  res.status(500).send('Internal Server Error');
});


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

   

    fs.writeFile("./messages.json",JSON.stringify(messages),err =>{
      if(err && !messages)
          console.log("err")
    })

  
   //Python için arguments eklenecek
    const pythonProcess = spawn("python3",["./main.py"])

    let result = ''; // Store the result from the Python script

  // Capture the output of the Python process
  pythonProcess.stdout.on('data', (data) => {
    // Append the received data to the result variable
    result += data;
    data = JSON.parse(result)
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
        "sector":companyInfo.sector
      }
  
    }
    
    db.addMessage(updatedMessages)
   
    
  });

  // Handle the completion of the Python process
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      // Python script executed successfully


      res.send(result); // Send the result back to the client
    } else {
      // Python script encountered an error
      console.error(`Python process exited with code ${code}`);
      res.status(500).send('Internal Server Error');
    }
  });

  // Handle any errors that occur during the Python process
  pythonProcess.on('error', (error) => {
    console.error(`Python process error: ${error.message}`);
    res.status(500).send('Internal Server Error');
  });

  
})

app.post("/all-message", async (req,res) => {
  
  console.log(req)
  const userId = req.body.data.userId

  const messageData = await db.allMessage(userId)

  try {
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

    res.send(data)
  }
  catch(err){
    res.send(err)
    console.log(messageData)
  }

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
    role:req.body.role
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


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})