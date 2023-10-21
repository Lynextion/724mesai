
import {useEffect, useState} from 'react';
import {  UserOutlined } from '@ant-design/icons';
import { Dropdown, message, ConfigProvider ,theme} from 'antd';
import settings from "./svg/settings.png"
import axios from "axios"
import CryptoJS from 'crypto-js';
import { useNavigate, useParams } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {HamburgerMenuIcon} from "@radix-ui/react-icons"
import "./radix.css"

const UserScreen = ({signOut}) =>{

  const {name} = useParams()
  const navigate = useNavigate()
  
  const [userId,setUserId] = useState('')
  const [avatarName,setAvatarName] = useState('')
  const [userName,setUserName] = useState('')
  const [isAdmin,setIsAdmin] = useState(false)
  
  const axiosInstance = axios.create({
    baseURL:"http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
      },
})

  const ENCRYPTION_KEY = 'o7UZXkzXFp3iMbGpJqF3hbilW1tcwCxfBDDgVZXrmO4dLE62kYcawIVvS5EULxtE'

  const decryptData = (data,key) =>{
    const decryptedData = CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
    return decryptedData
}


  const getUserInfo = () =>{
      const encryptedData = localStorage.getItem("userData")
      const decryptedData = decryptData(encryptedData,ENCRYPTION_KEY)
      const parsed = JSON.parse(decryptedData)
      console.log("buneymiş gardai",parsed[0].id)
      setUserId(() => {return parsed[0].id})
      const id = parsed[0].id
      setIsAdmin(parsed[0].isadmin)
      setUserName(parsed[0].name)
      console.log(parsed[0])
      fetchAvatar(id)
  }


  const btSettings = () =>{
    navigate(`/${name}/settings`)
    return "Settings"
  }

    const handleButtonClick = (e) => {
      
      console.log('click left button', e);
    };
    const handleMenuClick = (e) => {
      message.info('Click on menu item.');
      console.log('click', e);
    };
    const items = [
      {
        label: <button className='signOut' onClick={signOut}>Sign Out</button>,
        key: '1',
        icon: <UserOutlined />,
      },
      {
        label: <button className='signOut' onClick={btSettings}>Settings</button> ,
        key: '2',
        icon: <img src={settings} width='16px' height='16px'/>,
      },
    ];

    if(isAdmin){
      items.push({
        label: <button className='signOut' onClick={() => {navigate(`/${name}/admin`)}}>Admin Settings</button>,
        key: '3',
        icon: <UserOutlined />,
      })
    }

    const menuProps = {
      items,
      onClick: handleMenuClick,
    };

    const fetchAvatar = async (id) =>{
        const body = {
          id:id
        }
        await axiosInstance.post("/getAvatar",{body}).then((response) =>{

          setAvatarName(() => {return response.data.avatar_url})
        })
        
    }

    useEffect(() =>{
      getUserInfo()
      

    },[])

    return (
        <div className="userScreen">
          <img className='avatar' src={'https://res.cloudinary.com/dev724mesai/image/upload/f_auto,q_auto/'+"Standart-avatar"} width='64px' height='64px' />
           <p className='userName'>{userName}</p>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='IconButton' aria-label="Options">
                <HamburgerMenuIcon/>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                <DropdownMenu.Item onClick={signOut} className="DropdownMenuItem">
                  Sign Out <div className="RightSlot"> <UserOutlined/> </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={btSettings} className='DropdownMenuItem'>
                  Settings <div className="RightSlot"><img src={settings} width="16px" height="16px" /></div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => {navigate(`/${name}/admin`)}}  className='DropdownMenuItem'>
                  Admin Settings <div className="RightSlot"> <UserOutlined/> </div>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>

          </DropdownMenu.Root> 
         
        </div>
    )
}

export default UserScreen