import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  
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
const auth = getAuth(app);
const user = auth.currentUser;
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const siginPopup = document.querySelector(".signin-popup");
const navSigninButton = document.querySelector(".navbar-signinBtn");

//GOOGLE
const GprofilePopup = document.querySelector('.g-profile-popup');
const GnavProfileButton = document.querySelector(".GnavbarProfileBtn");

//EMAIL
const EprofilePopup = document.querySelector('.e-profile-popup');
const EnavProfileButton = document.querySelector(".EnavbarProfileBtn");



const googleLoginBtn = document.getElementById("google-login-btn");
googleLoginBtn.addEventListener('click', ()=>{
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
})

const emailLoginBtn = document.getElementById("email-signin-btn");
emailLoginBtn.addEventListener('click', ()=>{
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
})

document.querySelectorAll(".logout-btn")
.forEach(button =>{
    button.addEventListener('click', ()=>{
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
    })
})




function updateNavbarForGoogle(){
    GprofilePopup.classList.toggle('profile-hide')
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');
    siginPopup.close();

    navSigninButton.style.display = 'none';
    GnavProfileButton.style.display = 'flex';
}

function updateNavbarForEmail(){
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');
    siginPopup.close();

    navSigninButton.style.display = 'none';
    EnavProfileButton.style.display = 'flex';
    EprofilePopup.classList.toggle('profile-hide')
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


onAuthStateChanged(auth, (user)=>{
    if(user){
        user.providerData.forEach((profile) => {
            //console.log("Signed in with:", profile.providerId);

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
        navSigninButton.style.display = 'flex';
        GnavProfileButton.style.display = 'none';
        EnavProfileButton.style.display = 'none';
    }
})
