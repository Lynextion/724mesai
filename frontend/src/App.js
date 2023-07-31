import logo from './logo.svg';
import './App.css';
import ChatScreen from "./asset/chatScreen"
import Firebase from "./firebase"
import LoginScreen from "./asset/loginScreen"
import RegisterScreen from "./asset/registerScreen"
import Panel from "./asset/adminPanel"
import { useEffect } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";


function App() {


  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
      
        <Route path="/:name/" element={<LoginScreen/>}></Route>
        <Route path="/:name/register" element={<RegisterScreen/>}></Route>
        <Route path="/:name/chat/" element={<ChatScreen/>}></Route>
        <Route path="/:name/admin" element={<Panel/>}></Route>
        <Route path='*' element={<>404 Not Found</>}></Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
