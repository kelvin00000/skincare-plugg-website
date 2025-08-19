import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-functions.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";


  
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


//CLOUD FUNCTIONS INITIALIZATION
const functions = getFunctions(app);
const sendToZapier = httpsCallable(functions, "sendToZapier");


//WISHLIST FUNCTION INITIALIZATION
export const db = getDatabase(app);


/////////////GOOGLE SIGIN FUNCTION
const googleLoginBtn = document.getElementById("google-login-btn");
googleLoginBtn.addEventListener('click', ()=>{
    const googleBtnText = document.querySelector('.formBtnText-2');
    const googleBtnSvg = document.querySelector('.googleBtnsvg');
    const googleLoader = document.getElementById('loader-2');

    googleBtnText.style.display = 'none';
    googleBtnSvg.style.display = 'none';
    googleLoader.style.display = 'flex';

    setTimeout(()=>{
        signInWithGoogle();
        googleBtnText.style.display = 'flex';
        googleBtnSvg.style.display = 'flex';
        googleLoader.style.display = 'none';
    }, 3000);
})
function signInWithGoogle(){
    signInWithPopup(auth, provider).then(
        (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
        }
    ).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Please check your internet connection')
        }
    );
}


////////////EMAIL SIGNIN FUNCTION
const emailLoginBtn = document.getElementById("email-signin-btn");
emailLoginBtn.addEventListener('click', ()=>{
    const googleBtnText = document.querySelector('.formBtnText-1');
    const googleLoader = document.getElementById('loader-1');

    googleBtnText.style.display = 'none';
    googleLoader.style.display = 'flex';

    setTimeout(()=>{
        signInWithEmail();
        googleBtnText.style.display = 'flex';
        googleLoader.style.display = 'none';
    }, 2500);
})
function signInWithEmail(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("passkey").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user = userCredential.user;
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Email or Passsword is incorrect or User is already signed in with google')
    })
}


///////////////LOG OUT FUNCTION
document.querySelector(".logout-btn").addEventListener('click', ()=>{
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
    }, 2500);
})
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
    GprofilePopup.classList.toggle('profile-hide')
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');

    navSigninButton.style.display = 'none';
    GnavProfileButton.style.display = 'flex';

    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
    }
}

function updateNavbarForEmail(){
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');

    navSigninButton.style.display = 'none';
    EnavProfileButton.style.display = 'flex';
    EprofilePopup.classList.toggle('profile-hide')

    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
    }
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

    document.querySelector(".g-profile-name").textContent = G_userName;
    document.querySelector(".g-profile-email").textContent = G_userEmail;
    document.querySelectorAll(".g-profile-photo").forEach(photo =>{
        photo.src = G_userProfilePhoto;
    })
}

///////////////////////////////ZAPPIER FUNCTION
const sendEmailToZapier = async (email) => {
  const result = await sendToZapier({ email });
  try {
    const result = await sendToZapier({ email });
    console.log("Success:", result.data);
  } catch (error) {
    console.error("Failed to send to Zapier:", error.message);
  }
};


//////////////////////USER LOG
onAuthStateChanged(auth, (user)=>{
    if(user){
        //sendEmailToZapier(user.email);
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