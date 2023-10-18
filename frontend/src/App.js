import './App.css';
import ChatScreen from "./asset/chatScreen"
import LoginScreen from "./asset/loginScreen"
import RegisterScreen from "./asset/registerScreen"
import Panel from "./asset/adminPanel"
import Settings from "./asset/settings"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Logo from "./asset/svg/altin-logo-w-1.png"

function App() {


  return (
    <BrowserRouter>
        <div className="App" style={{background:'#444654'}}>
      <Routes>
      
        <Route path="/:name/" element={<LoginScreen/>}></Route>
        <Route path="/:name/register" element={<RegisterScreen/>}></Route>
        <Route path="/:name/chat/" element={<ChatScreen/>}></Route>
        <Route path='/:name/settings/' element={<Settings/>}></Route>
        <Route path="/:name/admin" element={<Panel/>}></Route>
        <Route path='*' element={<>404 Not Found</>}></Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
