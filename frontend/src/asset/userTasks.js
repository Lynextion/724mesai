import "./chatScreen.css"
import {Collapse, ConfigProvider} from "antd"
import { useEffect, useState } from "react";


const UserTasks = ({tasks}) =>{
    
    
    
    const items= [
      {
        key: '1',
        label: <p style={{color:'white'}}>Tasklar</p>,
        children: tasks.map((data,key) =>{
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
                <Collapse items={items}  ghost showArrow={false} />;
            </ConfigProvider>

        </div>
    )
}

export default UserTasks