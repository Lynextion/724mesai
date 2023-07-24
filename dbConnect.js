require('dotenv').config()
const {Client} = require("cassandra-driver")
const { v4: uuidv4 } = require('uuid');

async function run() {
    
    const rs = await client.execute("SELECT * FROM companies.company");
  console.log(`Your cluster returned ${rs.first()["id"]} `);
    
  

}




const createMessage = async (userId,userMessage) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try {

        const message = JSON.stringify(userMessage)

        const id = uuidv4()

        await client.connect()

        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE id =${userId};`)
        const companyInfo = await client.execute(`SELECT * FROM companies.company WHERE workerid CONTAINS ${userId}`)
        
        const messageInfo = await client.execute(`INSERT INTO companies.message (messageId,companyId,date,messages,topic,userId) VALUES (${id},${companyInfo.first().id},toTimestamp(now()),['${message}'],'test',${userId});`)
        .then(() =>{
            return client.execute(`SELECT * FROM companies.message WHERE messageid = ${id}`)
        })
        .finally(() => {
            client.shutdown()
        })

        console.log(messageInfo.first())
        return messageInfo.first()


}

catch(err) {
    return err
}
   

}


const addMessage = async (message) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{

        await client.connect()
        
        const messages = message.messageInfo.message;

        async function updateMessages() {
          for (const data of messages) {
            const object = {
              role: data.role,
              content: data.content
            };
            const objectString = JSON.stringify(object);
            console.log("hmm")
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

          await client.shutdown()
        }

        // Call the function to update the messages
        updateMessages();
    }

    catch(err){
        return err
    }
}

const receiveMessage = async (message) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try {

        await client.connect()

        const getMessage = await client.execute(`SELECT * FROM companies.message WHERE messageid=${message};`)
    
        console.log(getMessage.first())

        await client.shutdown()

        return getMessage.first()
    }
    catch(err){
        return err
    }
}

const allMessage = async(userId) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{
        await client.connect()

        const messages = await client.execute(`SELECT * FROM companies.message WHERE userid=${userId}`)
        console.log(messages.rows)
        await client.shutdown()

        return messages.rows

    }

    catch(err){
        return err
    }
}


const findUser = async (userId) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{
        await client.connect()

        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE id=${userId};`)

        await client.shutdown()

        return userInfo.first()
    }
    catch(err){
        return err
    }
}

const findUsers = async (companyId) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{
        await client.connect()

        const userInfo = await client.execute(`SELECT * FROM companies.woker WHERE companyid=${companyId};`)

        await client.shutdown()

        return userInfo.first()
    }
    catch(err){
        return err
    }
}


const addUser = async(userInfo) => {
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{

        await client.connect()

        const id = uuidv4()
        

        await client.execute(`INSERT INTO companies.woker (id,name,role,companyid,firebaseId) VALUES (${id},'${userInfo.userName}','${userInfo.role}',${userInfo.companyId},${userInfo.firebaseId});`)

        await client.shutdown()
    }
    catch(err){
        return err
    }
}


const findCompany = async (userId) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{

        await client.connect()

        const companyInfo = await client.execute(`SELECT * FROM companies.company WHERE workerid CONTAINS ${userId};`)
        
        await client.shutdown()

        return companyInfo.first()
    }

    catch(err){
        return err
    }
}

const updateCompany = async(companyInfo) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })


    await client.connect()

    await client.execute(`UPDATE companies.company SET name`)
}

const updateUser = async(userInfo) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{

        await client.connect()

        await client.execute(`UPDATE companies.woker SET name=${userInfo.userName}, companyid=${userInfo.companyId},role=${userInfo.role}, avatar = ${userInfo.avatar} WHERE id=${userInfo.userId};`)

        await client.shutdown()
    }

    catch(err){
        return err
    }
}

const deleteMessage = async(messageInfo) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    try{

        await client.connect()

        await client.execute(`DELETE FROM companies.message WHERE messageid=${messageInfo};`)

        await client.shutdown()

    }
    catch(err){
        return err
    }
}


const insertWhiteList = async(data) =>{
    const client = new Client({
        cloud:{
            secureConnectBundle:"./secure-connect-724mesai.zip"
        },
        credentials:{
            username:process.env.CLIENT_ID,
            password:process.env.CLIENT_SECRET
        },
    })

    
    await client.connect()
    await client.execute(`UPDATE companies.company SET whitelist_email= whitelist_email + ['${data.email}'] WHERE id=${data.id}`)
    await client.shutdown() 

   
}
 

module.exports = {receiveMessage,addMessage,createMessage,findUser,findCompany,findUsers,addUser,updateUser,allMessage,deleteMessage,insertWhiteList}
