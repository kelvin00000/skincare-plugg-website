import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, deleteUser, reauthenticateWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc, updateDoc, deleteDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { sendConfirmationEmail } from "./email.js";
import { showAccountManagementUI, showSignUpForm, showSignUpWindowUI,  } from "./authUI.js";
import { showErrorPopup } from "./general.js";


const firebaseConfig = {
    apiKey: "AIzaSyBVWbqdYPh7O3EhuXCdb3F0MLC4banlJt0",
    authDomain: "scincare-plugg.firebaseapp.com",
    databaseURL: "https://scincare-plugg-default-rtdb.firebaseio.com",
    projectId: "scincare-plugg",
    storageBucket: "scincare-plugg.firebasestorage.app",
    messagingSenderId: "53985591782",
    appId: "1:53985591782:web:e7febdbb98301cf5aad627"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
    console.warn('Persistence error:', err.code);
});
export { db };

const auth = getAuth(app);
let user = null;
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();



//// SIGN-UP FUNCTION
export async function signUpWithGoogle(phoneNumber){
    try{
        const result = await signInWithPopup(auth, provider);
        const uid = result.user.uid;

        await setDoc(doc(db, "users", uid), {
            profileImage: result.user.photoURL,
            email: result.user.email,
            name: result.user.displayName,
            phoneNumber
        });

        await updateDoc(doc(db, 'users', 'newUserCheck'), {
            newUser: true
        });

        //sendConfirmationEmail(user);
        showSignUpWindowUI();
        await showAccountManagementUI();
    }
    catch (err){
        console.error(err)
        showErrorPopup('Error ccured please Try again');
    }
}

//// REMOVE ACCOUNT FUNCTION
export async function removeAccount(){
    const uid = user.uid;
    
    try {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);

        await Promise.all([
            deleteDoc(doc(db, 'users', uid)),
            deleteDoc(doc(db, 'wishlist', uid)),
            deleteDoc(doc(db, 'analytics', 'userActivity', 'users', uid))
            // TODO DELETE CART TOO LATER
        ]);
        
        await deleteUser(user);
        showSignUpWindowUI();
        showSignUpForm();
    } 
    catch (error) {
        console.error(error);
        showErrorPopup('Error ccured please Try again');
    }
}

//////////////////////USER LOG
onAuthStateChanged(auth, (currentUser)=>{
    user = currentUser;
    
    if(currentUser && currentUser.email !== 'ua-xys-admin-001@gmail.com'){
        document.querySelectorAll(".nav-open-sign-up-window-btn").forEach(btn=>btn.style.display='none')
        document.querySelectorAll(".account-management-btn").forEach(btn=>btn.style.display='flex')
    }
    else if(!currentUser){
        document.querySelectorAll(".nav-open-sign-up-window-btn").forEach(btn=>btn.style.display='flex')
        document.querySelectorAll(".account-management-btn").forEach(btn=>btn.style.display='none')
    }
})

export{auth, user};