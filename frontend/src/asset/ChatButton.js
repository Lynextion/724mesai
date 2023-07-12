import './chatScreen.css'
import chatSVG from "./svg/chat.svg"


const ChatButton = ({topic,handleClick}) =>{
    
    
   
    const ChatBT = () =>{
       const bt = topic.map((data) =>{
        console.log("button mesaj id",data.messageId)
        return (
            <>
            <button className="chatsBT" value={data.messageId} key={data.messageId} onClick={() => handleClick(data.messageId)}><img src={chatSVG} className="chatSVG" /><text className="topicText">{data.topic}</text></button>
            </>
        )
        })

        return bt
    }

    return (
        <>
           <ChatBT/>
        </>
    )
}


export default ChatButton