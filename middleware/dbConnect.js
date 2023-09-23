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


const getUserAvatar = async (userId) =>{

    const avatar = await client.execute(`SELECT avatar_url FROM companies.woker WHERE id=${userId}`)
    return avatar.first()

}


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


        return userInfo.rows
    }
    catch(err){
        return err
    }
}


const addUser = async(userInfo,id) => {
    

    try{

        

        
        

        await client.execute(`INSERT INTO companies.woker (id,name,role,companyid,email,verified,isAdmin) VALUES (${id},'${userInfo.Username}','${userInfo.role}',${userInfo.companyId},'${userInfo.email}',False,False);`)
       
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
   
   const userEmail =  await client.execute(`SELECT * FROM companies.woker WHERE email='${userInfo.email}';`)
   return userEmail.first()
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

const findCompanyByName = async (name) =>{

   
        const companyInfo = await client.execute(`SELECT * FROM companies.company WHERE name='${name}';`)
        return companyInfo.rows
            
   
}


const updateUser = async(userInfo) =>{
    

    try{

       

        await client.execute(`UPDATE companies.woker SET verified=True  WHERE id=${userInfo.userId};`)

    }

    catch(err){
        return err
    }
}

const verifyUser =  async (userInfo) =>{

    const id = await client.execute(`SELECT * FROM companies.woker WHERE email='${userInfo.email}';`)
    console.log(id.first().id)
    await client.execute(`UPDATE companies.woker SET  uid='${userInfo.uid}' WHERE id=${id.first().id}; `)
    await client.execute(`UPDATE companies.woker SET verified=True  WHERE id=${id.first().id}; `)

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

const getWhitelist = async (name) =>{
    const list = await client.execute(`SELECT whitelist_email FROM companies.company WHERE name='${name}'`)

    return list.first()
}

const addWorkerId = async (id,companyId) => {
    console.log('db id',id)
    await client.execute(`UPDATE companies.company SET workerid= workerid + [${id}] WHERE id=${companyId}`)
    
}

const updateEmail = async(data) =>{
    await client.execute(`UPDATE companies.woker SET email='${data.value}' WHERE id=${data.id};`)

}

const updateUserName = async(data) =>{
    await client.execute(`UPDATE companies.woker SET name='${data.value}' WHERE id=${data.id};`)

}

const updateRole = async(data) =>{
    await client.execute(`UPDATE companies.woker SET role='${data.value}' WHERE id=${data.id}`)
}

const updateCompany = async(companyInfo) =>{
    

    await client.execute(`UPDATE companies.company SET name='${companyInfo.name}'  WHERE ID=${companyInfo.id};`)
    await client.execute(`UPDATE companies.company SET sector='${companyInfo.sector}' WHERE ID=${companyInfo.id};`)
    await client.execute(`UPDATE companies.company SET companyinfo='${companyInfo.companyinfo}' WHERE ID=${companyInfo.id}`)
}

const createTask = async(task,userId) => {

   

    const id = uuidv4()
    if(JSON.stringify(task).includes("'")){
        console.log("bunlari kaldir")
        const objectString = JSON.stringify(task)
        const updated = objectString.replace(/'/g,"''")
        await client.execute(`INSERT INTO companies.Tasks (id,userid,tasks) VALUES (${id},${userId},'${updated}');`)
    
    }

    else{
        await client.execute(`INSERT INTO companies.Tasks (id,userid,tasks) VALUES (${id},${userId},'${JSON.stringify(task)}');`)
    }

    await client.execute(`UPDATE companies.woker SET  tasks=tasks + [${id}] WHERE id=${userId} ;`)
    
}

const showTasks = async(userId) => {


    const tasks = await client.execute(`SELECT * FROM companies.tasks WHERE userid=${userId};`)
    return tasks.rows

}


module.exports = {receiveMessage,addMessage,createMessage,findUser,findCompany,findUsers,addUser,updateUser,allMessage,deleteMessage,insertWhiteList,addFirebaseId,findUserwithEmail,findUserUID,getWhitelist,verifyUser,findCompanyByName,addWorkerId,getUserAvatar,updateUserName,updateEmail,updateRole,updateCompany,createTask,showTasks}
