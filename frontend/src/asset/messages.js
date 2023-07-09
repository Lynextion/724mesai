

const Messages = ({messages}) =>{
    
    console.log(messages)

    const ShowMessage = () =>{
        return messages.map((data) =>{
            if(data.role === "user"){
                return (
                    <>
                        <div className="userText"><text className="topicText">{data.content}</text></div>
                    </>
                )
            }

            if(data.role === "system"){
                return(
                    <>
                        <div className="systemText"><text className="topicText">{data.content}</text></div>
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