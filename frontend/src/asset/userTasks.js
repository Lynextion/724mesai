import "./chatScreen.css"
import {Collapse, ConfigProvider} from "antd"
import { useEffect, useState } from "react";
import axios from "axios"


const axiosInstance = axios.create({
    baseURL:"http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
      },
})

const UserTasks = ({userId}) =>{
    
    const [task,setTask] = useState([])
    
    const getTask = async () =>{
        const body = {
            userId:userId
        }
        await axiosInstance.post("/showTasks",{body}).then((result) =>{setTask(result.data)})
    }

    const items= [
      {
        key: '1',
        label: <p style={{color:'white',margin:'0px'}}>Tasklar</p>,
        children: task.map((data,key) =>{
            return (<div key={key} className="tasks">
                    <p >Task Name: {data.task_name}</p>
                    <p>Task Description:{data.task_description}</p>
                    <p>Task Date:{data.task_date}</p>
                   
            </div>)
        })
      },


    ];

    useEffect(() => {
        getTask()
    },[])

    return(
        <div className="TaskBody">
            <ConfigProvider
                theme={{
                    token:{ 
                        colorBorder:'#ffffff'
                    },
                   
                }}      
            >
                <Collapse items={items} size="small" accordion={true} bordered={true}/>;
            </ConfigProvider>

        </div>
    )
}

export default UserTasks