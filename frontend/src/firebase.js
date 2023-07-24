// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional




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
  const analytics = getAnalytics(app);
  console.log(analytics)
  export const auth = getAuth(app)



export default app