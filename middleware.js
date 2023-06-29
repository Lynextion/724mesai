const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { spawn } = require('child_process');
const fs = require("fs")

const app = express()
const port = 6000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cors())

app.get("/",(req,res) =>{
    res.json("Hellooo")
})


app.post("/message", async (req,res)=>{
    let result = ''; // Store the result from the Python script

    // Capture the output of the Python process
    pythonProcess.stdout.on('data', (data) => {
      // Append the received data to the result variable
      result += data.toString();
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
  

} ) 


app.post("/create-message", async (req,res) =>{
    

    const pythonProcess = spawn("python3",["./main.py","./messages.json"])

    let result = ''; // Store the result from the Python script

  // Capture the output of the Python process
  pythonProcess.stdout.on('data', (data) => {
    // Append the received data to the result variable
    result += data.toString();
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


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})