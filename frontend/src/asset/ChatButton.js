import './chatScreen.css'
import chatSVG from "./svg/chat.svg"
import deleteSVG from "./svg/DeleteOutlined.svg"


const ChatButton = ({topic,handleClick,deleteChat}) =>{
    

  console.log("topicc",topic)

  const sortedTopic= () => {


      function compareByDate(a, b) {
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000; 
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
    
        const aDiff = Math.floor((today - aDate) / oneDay);
        const bDiff = Math.floor((today - bDate) / oneDay);
    
        if (aDiff === 0) {
          // a is today
          return bDiff === 0 ? 0 : -1; // Sort b after a if b is not today
        } else if (aDiff <= 1) {
          // a is in the previous 1 day
          return bDiff <= 1 ? 0 : 1; // Sort b before a if b is not in the previous 1 day
        } else if (aDiff <= 7) {
          // a is in the previous 7 days
          return bDiff <= 7 ? 0 : 1; // Sort b before a if b is not in the previous 7 days
        } else {
          // a is older than 7 days
          return bDiff > 7 ? 0 : -1; // Sort b after a if b is older than 7 days
        }
      }

      topic.sort(compareByDate);


      const result = {
        Today: [],
        'Previous 1 Day': [],
        'Previous 7 Days': [],
        'Previous 30 Days': [],
      };

      // Categorize the objects based on the date
      const today = new Date();
      topic.forEach(obj => {
        const diffTime = today - new Date(obj.date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
        if (diffDays === 0) {
          result.Today.push(obj);
        } else if (diffDays <= 1) {
          result['Previous 1 Day'].push(obj);
        } else if (diffDays <= 7) {
          result['Previous 7 Days'].push(obj);
        } else if (diffDays <= 30) {
          result['Previous 30 Days'].push(obj);
        }
      });
      return result
    }
      console.log(sortedTopic());
    
    const sortedItems = sortedTopic()
   
    const ChatBT = () =>{
        const bt = []
        if(sortedItems['Previous 1 Day'].length !== 0){
            bt.push(<span className='sortName'>Previous 1 Day</span>)
           bt.push(sortedItems.Today.map((data,key) =>{
                return(
                    <>
                    <div className="chatsBTdiv">
                        <button className="chatBT" value={data.messageId} key={data.messageId} onClick={() => handleClick(data.messageId)}><img src={chatSVG} className="chatSVG" /><text className="topicText">{data.topic}</text></button>
                        <button className="deleteChat" onClick={() => deleteChat(data.messageId)} ><img src={deleteSVG}/></button>
                    </div>
                    </>
                )
            }))
        }

        if(sortedItems['Previous 7 Days'].length !== 0){
            bt.push(<span className='sortName' >Previous 7 Days</span>)
            bt.push(sortedItems['Previous 7 Days'].map((data,key) =>{
                return(
                    <>
                    <div className="chatsBTdiv">
                        <button className="chatBT" value={data.messageId} key={data.messageId} onClick={() => handleClick(data.messageId)}><img src={chatSVG} className="chatSVG" /><text className="topicText">{data.topic}</text></button>
                        <button className="deleteChat" onClick={() => deleteChat(data.messageId)} ><img src={deleteSVG}/></button>
                    </div>
                    </>
                )
            }))
        }

        if(sortedItems['Previous 30 Days'.length !== 0]){
            bt.push(<span className='sortName'>Previous 30 Days</span>)
            bt.push(sortedItems['Previous 30 Days'].map((data,key) =>{
                return(
                    <div className="chatsBTdiv">
                    <button className="chatBT" value={data.messageId} key={data.messageId} onClick={() => handleClick(data.messageId)}><img src={chatSVG} className="chatSVG" /><text className="topicText">{data.topic}</text></button>
                    <button className="deleteChat" onClick={() => deleteChat(data.messageId)} ><img src={deleteSVG}/></button>
                </div>
                )
            }))
        }

        return bt
    }

  
    return (
        <>
           <ChatBT/>
        </>
    )
}


export default ChatButton