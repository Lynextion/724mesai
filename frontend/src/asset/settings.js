import { useEffect, useRef, useState } from 'react'
import './chatScreen.css'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { getAuth,updateEmail,onAuthStateChanged,reauthenticateWithCredential,EmailAuthProvider, updatePassword } from "firebase/auth";
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import robotWait from "./svg/robotWait.gif"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Settings = () =>{

    const navigate = useNavigate()
    const {name} = useParams()
    const auth = getAuth();


    const userName = useRef(null)
    const role = useRef(null)
    const userEmail = useRef(null)
    const userPassword = useRef(null)


    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [userId,setUserId] = useState('')
    const [userData,setUserData] = useState('')
    const [avatarName,setAvatarName] = useState('')
    const [userNameState,setUserNameState] = useState(0)
    const [passwordState,setPasswordState] = useState(0)
    const [roleState,setRoleState] = useState(0)
    const [emailState,setEmailState] = useState(0)
    const [userUID,setUserUID] = useState()

    const [wait,setWait] = useState(false)

    const notify = (note) => toast(note);

    const fetchAvatar = async (id) =>{
        const body = {
          id:id
        }
        await axiosInstance.post("/getAvatar",{body}).then((response) =>{

          setAvatarName(() => {return response.data.avatar_url})
        })
        
    }

    


    const checkSigned = () =>{
      onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const User = user
            console.log(user)
            
            if(!localStorage.getItem("userFirebaseData")){
              const encryptedData = encryptData(user,ENCRYPTION_KEY)
              localStorage.setItem("userFirebaseData",encryptedData)
            }

           
            
          } else {
            // User is signed out
            // ...
            console.log("user is logged out")
            navigate(`/${name}/`)
          }
        });
  }

    const axiosInstance = axios.create({
        baseURL:"http://localhost:4000",
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
          },
    })
    
      const ENCRYPTION_KEY = 'o7UZXkzXFp3iMbGpJqF3hbilW1tcwCxfBDDgVZXrmO4dLE62kYcawIVvS5EULxtE'

      const encryptData = (data, key) => {
        const encrypted = CryptoJS.AES.encrypt(data, key).toString();
        return encrypted;
      };
    
      const decryptData = (data,key) =>{
        const decryptedData = CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    }
    
    
      const getUserInfo = () =>{
          const encryptedData = localStorage.getItem("userData")
          const decryptedData = decryptData(encryptedData,ENCRYPTION_KEY)
          const parsed = JSON.parse(decryptedData)
          setUserData(() =>{return parsed[0]})
          console.log("buneymiş gardai",parsed[0])
          setUserId(() => {return parsed[0].id})
          setUserUID(() => {return parsed[0].uid})
          const id = parsed[0].id
          fetchAvatar(id)
      }

      const getUser = async (uid) =>{
        const body = {"uid":uid}
        axiosInstance.post("findUserwithUID",{body})
        .then((response) => {
            console.log("user response ",response.data)
            const JSONdata = JSON.stringify(response.data)
            const encrypted = encryptData(JSONdata,ENCRYPTION_KEY)
            localStorage.setItem("userData",encrypted)
        }).then(() =>{getUserInfo()})
    }

      const setState= (e) =>{
        console.log(e.target.value)
        if(e.target.value === "userName") {

          if(userNameState === 0){
            setUserNameState(() =>{return 1})
          }
          else{
              
            setUserNameState(() => {return 0})
          }

      }

      if(e.target.value === "role"){

        if(roleState === 0){
          setRoleState(() =>{return 1})
        }

        if(roleState === 1){
          setRoleState(() => {return 0})
        }

      }

      if(e.target.value === "email"){

        if(emailState === 0){
          setEmailState(() =>{return 1})
        }

        if(emailState === 1){
          setEmailState(() => {return 0})
        }

      }

      if(e.target.value === "password"){
        if(passwordState === 0){
          setPasswordState(() =>{return 1})
        }
        if(passwordState === 1){
          setPasswordState(() =>{return 0})
        }
      }

      }

    

      const updateValue = async (e) =>{
        if(e.target.value === "userName"){
          if(userName.current.value){
            setWait(true)
            const body = {
              func: 'userName',
              value:userName.current.value,
              id:userId
            }

        try{
          await axiosInstance.post("/updateUserData",{body}).then((result) =>{
              getUser(userUID)
              setWait(false)
              notify("Done")
            })
            getUserInfo()
            
          }
          catch(err){
            notify("Error try again please")
          }

          }

          else{
            console.log("input can't be empty")
          }
        }

        if(e.target.value === "role"){
          if(role.current.value){
            setWait(true)
            const body = {
              func: 'role',
              value:role.current.value,
              id:userId
            }

            try{
              await axiosInstance.post("/updateUserData",{body}).then((result) =>{
                  getUser(userUID)
                  setWait(false)
                  notify("Done")
                })
                getUserInfo()
                
              }
              catch(err){
                notify("Error try again please")
              }
    
          }

          else{
            console.log("input can't be empty")
          }
        }

        if(e.target.value === "email"){
          if(email){
            setWait(true)
            const body = {
              func: 'email',
              value:email,
              id:userId
            }

            const user = auth.currentUser;

            // TODO(you): prompt the user to re-provide their sign-in credentials
           
            const credential = EmailAuthProvider.credential(
              userEmail.current.value,
              userPassword.current.value
            )

            reauthenticateWithCredential(user, credential).then(() => {
              updateEmail(auth.currentUser, email).then(() => {
                // Email updated!
                axiosInstance.post("/updateUserData",{body}).then((result) =>{
                  getUser(userUID)
                  setEmailState(() =>{return(0)})
                  setWait(false)
                  notify("Done")
                })
              }).catch((error) => {
                
                console.log(error)
                notify("Error try again please")
              });
              // User re-authenticated.
            }).catch((error) => {
              // An error ocurred
              // ...
              console.log(error)
              notify("Error try again please")
            });

                        

          
            getUserInfo()
          }

          else{
            console.log("input can't be empty")
          }
        }

        if(e.target.value === "password"){
          if(password){
            setWait(true)
            const body = {
              func: 'password',
              value:password,
              id:userId
            }

            const user = auth.currentUser;

          
           
            const credential = EmailAuthProvider.credential(
              userEmail.current.value,
              userPassword.current.value
            )

            reauthenticateWithCredential(user, credential).then(() => {
              updatePassword(auth.currentUser, password).then(() => {
                // Password updated!
                axiosInstance.post("/updateUserData",{body}).then((result) =>{
                  getUser(userUID)
                  setPasswordState(() =>{return(0)})
                  setWait(false)
                  notify("Done")
                })
              }).catch((error) => {
                notify("Error try again please")
                console.log(error)
              });
              // User re-authenticated.
            }).catch((error) => {
              // An error ocurred
              // ...
              console.log(error)
              notify("Error try again please")
            });

                        

          
            getUserInfo()
          }

          else{
            console.log("input can't be empty")
          }
        }

        
      }

      const handleEmailChange = (e) =>{
        console.log(e.target.value)

        setEmail(e.target.value)
      }

      const handlePasswordChange = (e) =>{
        console.log(e.target.value)

        setPassword(e.target.value)
      }

      const userchangeState= () =>{
          if(userNameState === 1){
    
            return(
              <div className='userValue'>
                <input className='newValue' placeholder='Please Enter new user name' ref={userName}/>
                <div className="value-container">
                  {wait ?  <img className="robot" src={robotWait}/> : <button className="updateValue" onClick={updateValue} value="userName" ><span className='submitText'>Done</span></button>  }
                  <button className="updateValue" onClick={setState} value="userName"  ><span className='submitText'>İptal</span></button>
                  <ToastContainer/>
                </div>
              </div>
            )

          }

          if(userNameState === 0){
            return(
              <>
                <button className="updateValue" onClick={setState} value="userName"  ><span className='submitText' onClick={setState} value="userName" >Update UserName</span></button>
              </>
            )
          }

          
      }

      const rolechangeState = () =>{
        if(roleState === 1){
          return(
            <div className='userValue'>
            <input className='newValue' placeholder="Please enter new role" ref={role}/>
            <div className="value-container">
            {wait ?  <img className="robot" src={robotWait}/> : <button className='updateValue' onClick={updateValue} value="role" ><span className='submitText'>Done</span></button> }
              <button className="updateValue" onClick={setState}  value="role" ><span className='submitText'>İptal</span></button>
              <ToastContainer/>
            </div>
          </div>
          )
      }

      if(roleState === 0){

        return(
          <>
            <button className="updateValue" onClick={setState} value="role" ><span className='submitText'>Update Role</span></button>
          </>
        )
      }
      }

      const loginPop = (value) =>{

        
        if(email || password){
        return(
          <Popup trigger={<button className='updateValue' onClick={updateValue} value="email" ><span className='submitText'>Done</span></button>} position="right center" modal ne>
            {close => (
            <div className='loginPopUp'>
              <h1>Please re-login for email change</h1>
              <input className='newValue' ref={userEmail} placeholder='Email'/>
              <input className='newValue' type='password' ref={userPassword} placeholder='Password'/>
              {wait ?  <img className="robot" src={robotWait}/> : <button className='updateValue' value={value} onClick={updateValue}><span className='submitText'>Submit</span></button> }
            
           </div>
            )
            }             
            </Popup>
        )
          }
      }

      const emailChangeState = () =>{
        if(emailState === 1){
          return(
            <div className='userValue'>
            <input className='newValue' placeholder='Please enter new email' onChange={handleEmailChange} value={email}/>
            {loginPop('email')}
            <button className="updateValue" onClick={setState}  value="email" ><span className='submitText'>İptal</span></button>
            <ToastContainer/>
          </div>
          )
      }

      if(emailState === 0){

        return(
          <>
            <button className="updateValue" onClick={setState} value="email" ><span className='submitText'>Update Email</span></button>
          </>
        )
      }
      }

      const passwordChangeState = () =>{
        if(passwordState === 1) {
          return(
            <div className='userValue'>
            <input className='newValue' placeholder='Please enter new Password' onChange={handlePasswordChange} value={password}/>
            {loginPop('password')}
            <button className="updateValue" onClick={setState}  value="password" ><span className='submitText'>İptal</span></button>
            <ToastContainer/>
          </div>
          )
        }

        if(passwordState === 0){

          return(
            <>
              <button className="updateValue" onClick={setState} value="password" ><span className='submitText'>Update Password</span></button>
            </>
          )
        }

      }
    

    useEffect(() => {
        checkSigned()
        getUserInfo()
    },[])

    return(
        <div className='body'  style={{display:'flex',alignItems:'center',width:'100%',justifyContent:'center',height: "100vh",overflowY:"scroll"}}>
            <div className='settingsForm'>
              <div className='box'>
                  <img src={'https://res.cloudinary.com/dev724mesai/image/upload/f_auto,q_auto/'+avatarName}/>
                  <p>Update Profile İmage</p>
                  <input type='file' accept='image/*'/>
              </div>
              <div className='box'>
                <span className="boxProp">User Name</span>
                <hr style={{width:"90%"}}/>
                <span className="boxProp">{userData.name}</span>
                <hr style={{width:"90%"}}/>
               {userchangeState()}
              </div>
              <div className='box'>  
                <span className="boxProp">User Role</span>
                <hr style={{width:"90%"}}/>
                <span className="boxProp">{userData.role}</span>
                <hr style={{width:"90%"}}/>
                {rolechangeState()}
              </div>
              <div className='box'>
                <span className="boxProp">User Email</span> 
                <hr style={{width:"90%"}}/> 
                <span className="boxProp">{userData.email}</span>
                <hr style={{width:"90%"}}/>
                {emailChangeState()}
              </div>
              <div className='box'>
                <span className="boxProp">User Password</span>
                <hr style={{width:"90%"}}/>
                {passwordChangeState()}
                </div>                
            </div>
        </div>
    )
}


export default Settings