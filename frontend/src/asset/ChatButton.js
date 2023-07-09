import './chatScreen.css'
import chatSVG from "./svg/chat.svg"


const ChatButton = ({topic}) =>{
   
   
    const ChatBT = () =>{
       const bt = topic.map((data) =>{
        return (
            <>
            <button className="chatsBT"><img src={chatSVG} className="chatSVG" /><text className="topicText">{data}</text></button>
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