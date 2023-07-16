import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DetailedMessage from "./detailedMessage"


const Messages = ({messages}) =>{
    
    console.log(messages)
    

    const ShowMessage = () =>{
        return messages.map((data) =>{
            if(data.role === "user"){
                return (
                    <>
                        <div className="userText" key={data.messageId}><p className="topicText">User: {data.content}</p></div>
                    </>
                )
            }

            if(data.role === "assistant"){
                return(
                    <>
                        <div className="systemText" key={data.messageId}><DetailedMessage text={data.content}/></div>
                    </>
                )
            }
        })
    }

    return(
        <>
        <ShowMessage/>
        </>
    )
}

export default Messages