

const Messages = ({messages}) =>{
    
    console.log(messages)

    const ShowMessage = () =>{
        return messages.map((data) =>{
            if(data.role === "user"){
                return (
                    <>
                        <div className="userText" key={data.messageId}><text className="topicText">User: {data.content}</text></div>
                    </>
                )
            }

            if(data.role === "assistant"){
                return(
                    <>
                        <div className="systemText" key={data.messageId}><text className="topicText">Assistant: {data.content}</text></div>
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