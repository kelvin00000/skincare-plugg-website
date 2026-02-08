import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { sendConfirmationEmail } from "../Javascript/email.js";


  
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
export const auth = getAuth(app);
export const user = auth.currentUser;
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
export const siginPopup = document.querySelector(".signin-popup");
const navSigninButton = document.querySelector(".navbar-signinBtn");
const navDockSigninButton = document.querySelector(".navdock-signinBtn");

//GOOGLE
const GprofilePopup = document.querySelector('.g-profile-popup');
const GnavProfileButton = document.querySelector(".GnavbarProfileBtn");

//EMAIL
const EprofilePopup = document.querySelector('.e-profile-popup');
const EnavProfileButton = document.querySelector(".EnavbarProfileBtn");

//PAGE
const desktopMessage = document.querySelector('.desktop-p');
const mobileMessage = document.querySelector('.mobile-p');
const pageSignupBtn = document.querySelectorAll('.page-signup-btn');
const postSignupMessage = document.querySelector('.post-signup');


//FIFREBASE FIRESTORE DATATBASE
export const db = getFirestore(app);


/////////////GOOGLE SIGN FUNCTION
const googleLoginBtn = document.getElementById("google-login-btn");
if(googleLoginBtn){
    googleLoginBtn.addEventListener('click', ()=>{
        const googleBtnText = document.querySelector('.formBtnText-2');
        const googleBtnSvg = document.querySelector('.googleBtnsvg');
        const googleLoader = document.getElementById('loader-2');

        googleBtnText.style.display = 'none';
        googleBtnSvg.style.display = 'none';
        googleLoader.style.display = 'flex';

        setTimeout(async ()=>{
            await signInWithGoogle();
            googleBtnText.style.display = 'flex';
            googleBtnSvg.style.display = 'flex';
            googleLoader.style.display = 'none';
        }, 1500);
    })
}
async function signInWithGoogle(){
    try{
        let result = await signInWithPopup(auth, provider);
        const uid = result.user.uid;
        //sendConfirmationEmail(user);

        await setDoc(doc(db, "users", uid), {
            email: result.user.email,
            name: result.user.displayName || result.user.email
        });

        //SHOW SUCCESS TOAST HERE
        setTimeout(()=>{
            //REMOVE SUCCESS TOAST HERE
        }, 5000);


    }catch (error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        //SHOW ERROR TOAST HERE
        setTimeout(()=>{
            //REMOVE ERROR TOAST HERE
        }, 5000);
    }
}


////////////EMAIL SIGNIN FUNCTION
const emailLoginBtn = document.getElementById("email-signin-btn");
if(emailLoginBtn){
    emailLoginBtn.addEventListener('click', ()=>{
        const googleBtnText = document.querySelector('.formBtnText-1');
        const googleLoader = document.getElementById('loader-1');

        googleBtnText.style.display = 'none';
        googleLoader.style.display = 'flex';

        setTimeout(async ()=>{
            await signInWithEmail();
            googleBtnText.style.display = 'flex';
            googleLoader.style.display = 'none';
        }, 1500);
    })
}
async function signInWithEmail(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("passkey").value;

    if (!email || !password) {
        //SHOW ERROR TOAST HERE
        setTimeout(()=>{
            //REMOVE ERROR TOAST HERE
        }, 5000);
        return;
    }

    try {
        ////AUTH LOGIC
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        ////USER PROFILE DATA WRITE
        await setDoc(doc(db, "users", uid), {
            email,
            createdAt: new Date()
        });

        //SHOW SUCCESS TOAST HERE
        setTimeout(()=>{
            //REMOVE SUCCESS TOAST HERE
        }, 5000);

    }
    catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        //SHOW ERROR TOAST HERE
        setTimeout(()=>{
            //REMOVE ERROR TOAST HERE
        }, 5000);

        //REMOVE THIS LATER
        alert('Email or Passsword is incorrect or User is already signed in with google')
    }
}


///////////////LOG OUT FUNCTION
const logOutBtn = document.querySelector(".logout-btn")
if(logOutBtn){
    logOutBtn.addEventListener('click', ()=>{
        const logOutBtnText = document.querySelectorAll('.logOutBtnText');
        const logOutLoader = document.querySelectorAll('.loader-3');

        logOutBtnText.forEach(text=>{
            text.style.display = 'none';
        })
        logOutLoader.forEach(loader=>{
            loader.style.display = 'flex';
        })

        setTimeout(()=>{
            signUserOut();
            logOutLoader.forEach(loader=>{
                loader.style.display = 'none';
            })
            logOutBtnText.forEach(text=>{
                text.style.display = 'flex';
            })
        }, 1500);
    })
}

function signUserOut(){
    signOut(auth).then(()=>{
        GprofilePopup.style.display = 'none';
        EprofilePopup.style.display = 'none';
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
    });

    deleteUser(user).then(()=>{
        console.log(user)
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}



////////////////////////////////PAGE UPDATES
function updateNavbarForGoogle(){
    //GprofilePopup.classList.toggle('profile-hide')
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');

    navSigninButton.style.display = 'none';
    GnavProfileButton.style.display = 'flex';
}

function updateNavbarForEmail(){
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');

    navSigninButton.style.display = 'none';
    EnavProfileButton.style.display = 'flex';
}
function postSigupPageUpdate(){
    if(desktopMessage && mobileMessage && pageSignupBtn && postSignupMessage){
        desktopMessage.style.display = 'none';
        mobileMessage.style.display = 'none';
        pageSignupBtn.forEach(button => {
            button.style.display = 'none';
        })
        postSignupMessage.style.display = 'flex';
    }
}

function updateUserProfile(user){
    //email user
    const E_userEmail = user.email;
    document.querySelector(".e-profile-email").textContent = E_userEmail;


    //google user
    const G_userName = user.displayName;
    const G_userEmail = user.email;
    const G_userProfilePhoto = user.photoURL;

    document.querySelector(".g-profile-email").textContent = G_userEmail;
    if(G_userName){
        document.querySelector(".g-profile-name").textContent = G_userName;
    }
    if(G_userProfilePhoto){
        document.querySelectorAll(".g-profile-photo").forEach(photo =>{
            photo.src = G_userProfilePhoto;
        })
    }
}

///////////////////////////////


//////////////////////USER LOG
onAuthStateChanged(auth, (user)=>{
    if(user){
        postSigupPageUpdate();
        user.providerData.forEach((profile) => {

            if (profile.providerId === "google.com") {
                updateNavbarForGoogle();
                updateUserProfile(user);
            } else if (profile.providerId === "password") {
                updateNavbarForEmail();
                updateUserProfile(user);
            }
        });
    }
    
    else if(!user){
        if(window.innerWidth < 900){
            navSigninButton.style.display = 'none';
            navDockSigninButton.style.display = 'flex';
        }
        else{
            navSigninButton.style.display = 'flex';
        }
        GnavProfileButton.style.display = 'none';
        EnavProfileButton.style.display = 'none';
    }
})