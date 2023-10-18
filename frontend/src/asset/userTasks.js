import "./chatScreen.css"
import {Collapse, ConfigProvider} from "antd"
import { useEffect, useState } from "react";


const UserTasks = ({tasks}) =>{
    
    const task = [...tasks]
    
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
        console.log(tasks)
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