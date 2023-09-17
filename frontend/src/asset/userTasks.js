import { irBlack } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./chatScreen.css"
import {Collapse, ConfigProvider} from "antd"
import { useEffect, useState } from "react";
import axios from 'axios'

const UserTasks = ({tasks}) =>{
    
    
    
    const items= [
      {
        key: '1',
        label: 'This is panel header 1',
        children: tasks.map((data,key) =>{
            return (<div className="tasks">
                    <p>Task Name: {data.task_name}</p>
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
                <Collapse items={items} defaultActiveKey={['1']} />;
            </ConfigProvider>

        </div>
    )
}

export default UserTasks