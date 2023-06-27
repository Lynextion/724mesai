const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

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


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})