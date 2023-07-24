import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Register = ({email,password}) =>{
    const firebaseConfig = {
        apiKey: "AIzaSyBpDHhB7gN8Wef2Le5DkKNvuYCw4nTNS0A",
        authDomain: "mesai-7c105.firebaseapp.com",
        projectId: "mesai-7c105",
        storageBucket: "mesai-7c105.appspot.com",
        messagingSenderId: "722096350300",
        appId: "1:722096350300:web:f046012ccf2ff700ac7299",
        measurementId: "G-Y0P9FFR0DF"
      };
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
        const user = userCredential.user;
        console.log(user)
    // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    // ..
  });

}


export default Register