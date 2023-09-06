
import {useEffect, useState} from 'react';
import {  UserOutlined } from '@ant-design/icons';
import { Dropdown, message, ConfigProvider ,theme} from 'antd';
import settings from "./svg/settings.png"
import axios from "axios"
import CryptoJS from 'crypto-js';
import { useNavigate, useParams } from 'react-router-dom';

const UserScreen = ({signOut}) =>{

  const {name} = useParams()
  const navigate = useNavigate()
  
  const [userId,setUserId] = useState('')
  const [avatarName,setAvatarName] = useState('')
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
      console.log(parsed[0].isadmin)
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
          <img className='avatar' src={'https://res.cloudinary.com/dev724mesai/image/upload/f_auto,q_auto/'+avatarName} width='64px' height='64px' />
            <ConfigProvider
              theme={{
                token: {
                  algorithm: theme.darkAlgorithm,
                  screenLG:112,
                },
              }}
            >
              <Dropdown.Button style={{width:'45%'}} menu={menuProps} onClick={handleButtonClick}>
                  <span>Settings</span>
              </Dropdown.Button>
            </ConfigProvider>
         
        </div>
    )
}

export default UserScreen