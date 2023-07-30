require('dotenv').config()
const {Client} = require("cassandra-driver")
const { v4: uuidv4 } = require('uuid');

async function run() {
    
    const rs = await client.execute("SELECT * FROM companies.company");
  console.log(`Your cluster returned ${rs.first()["id"]} `);
    
  

}

const client = new Client({
    cloud:{
        secureConnectBundle:"./secure-connect-724mesai.zip"
    },
    credentials:{
        username:process.env.CLIENT_ID,
        password:process.env.CLIENT_SECRET
    },
})


client.connect()


const createMessage = async (userId,userMessage) =>{

    try {

        const message = JSON.stringify(userMessage)

        const id = uuidv4()


        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE id =${userId};`)
        const companyInfo = await client.execute(`SELECT * FROM companies.company WHERE workerid CONTAINS ${userId}`)
        
        const messageInfo = await client.execute(`INSERT INTO companies.message (messageId,companyId,date,messages,topic,userId) VALUES (${id},${companyInfo.first().id},toTimestamp(now()),['${message}'],'test',${userId});`)
        .then(() =>{
            return client.execute(`SELECT * FROM companies.message WHERE messageid = ${id}`)
        })
        

        console.log(messageInfo.first())
        return messageInfo.first()


}

catch(err) {
    return err
}
   

}


const addMessage = async (message) =>{
  

    try{

      
        
        const messages = message.messageInfo.message;

        async function updateMessages() {
          for (const data of messages) {
            const object = {
              role: data.role,
              content: data.content
            };
            const objectString = JSON.stringify(object);
            console.log("hmm  ",objectString)
            if(objectString.includes("'")){
                console.log("bunlari kaldir")
                const updated = objectString.replace(/'/g,"''")
                await client.execute(`UPDATE companies.message SET messages = messages + ['${updated}'] WHERE messageid = ${message.messageInfo.messageId} ;`);
            }

            else{
                console.log("tamam kaldırma be")
                await client.execute(`UPDATE companies.message SET messages = messages + ['${objectString}'] WHERE messageid = ${message.messageInfo.messageId} ;`);
          }
            }

        }

        // Call the function to update the messages
        updateMessages();
    }

    catch(err){
        return err
    }
}

const receiveMessage = async (message) =>{
   

    try {


        const getMessage = await client.execute(`SELECT * FROM companies.message WHERE messageid=${message};`)
    
        console.log("get message func ",getMessage.first())

        return getMessage.first()
    }
    catch(err){
        return err
    }
}

const allMessage = async(userId) =>{

    try{
    

        const messages = await client.execute(`SELECT * FROM companies.message WHERE userid=${userId}`)
       
    
        return messages.rows

    }

    catch(err){
        return err
    }
}


const findUser = async (userId) =>{
    

    try{
   

        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE id=${userId};`)

   

        return userInfo.first()
    }
    catch(err){
        return err
    }
}

const findUsers = async (companyId) =>{
    

    try{
    

        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE companyid=${companyId};`)


        return userInfo.first()
    }
    catch(err){
        return err
    }
}


const addUser = async(userInfo) => {
    

    try{

        

        const id = uuidv4()
        

        await client.execute(`INSERT INTO companies.woker (id,name,role,companyid) VALUES (${id},'${userInfo.userName}','${userInfo.role}',${userInfo.companyId});`)

    
    }
    catch(err){
        return err
    }
}

const addFirebaseId = async(userInfo) =>{
    

    try{
      
        await client.execute(`UPDATE companies.woker SET firebaseId=${userInfo} WHERE email='${userInfo.email}';`)

      
    }

    catch(err){
        console.log(err)
    }
}

const findUserwithEmail = async (userInfo) =>{
   
    await client.execute(`SELECT * FROM companies.woker WHERE email='${userInfo.email}';`)
}

const findCompany = async (userId) =>{
   

    try{



        const companyInfo = await client.execute(`SELECT * FROM companies.company WHERE workerid CONTAINS ${userId};`)
        
       

        return companyInfo.first()
    }

    catch(err){
        return err
    }
}

const updateCompany = async(companyInfo) =>{
    

    await client.execute(`UPDATE companies.company SET name`)
}

const updateUser = async(userInfo) =>{
    

    try{

       

        await client.execute(`UPDATE companies.woker SET name=${userInfo.userName}, companyid=${userInfo.companyId},role=${userInfo.role}  WHERE id=${userInfo.userId};`)

    }

    catch(err){
        return err
    }
}

const deleteMessage = async(messageInfo) =>{
    
    try{

        

        await client.execute(`DELETE FROM companies.message WHERE messageid=${messageInfo};`)

        

    }
    catch(err){
        return err
    }
}


const insertWhiteList = async(data) =>{
    
    
 
    await client.execute(`UPDATE companies.company SET whitelist_email= whitelist_email + ['${data.email}'] WHERE id=${data.id}`)
    

   
}

const findUserUID = async(uid) => {
    const user = await client.execute(`SELECT * FROM companies.woker WHERE uid='${uid}';`)

    return user.rows
}

const getWhitelist = async (id) =>{
    const list = await client.execute(`SELECT whitelist_email FROM companies.company WHERE id=${id}`)

    return list.first()
}

module.exports = {receiveMessage,addMessage,createMessage,findUser,findCompany,findUsers,addUser,updateUser,allMessage,deleteMessage,insertWhiteList,addFirebaseId,findUserwithEmail,findUserUID,getWhitelist}
