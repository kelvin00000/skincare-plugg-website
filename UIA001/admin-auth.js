import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth } from "../Javascript/Forms.js";

////INTERFACES
const adminSigninInterface = document.getElementById("js-admin-signin-interface");
const adminMainInterface = document.getElementById("js-admin-cms-homepage");
const adminHeader = document.getElementById("js-header-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");

const failToast = document.getElementById("js-fail-toast");
const emptyFieldToast = document.getElementById("js-empty-field-toast");


document.getElementById("js-admin-signin-btn").addEventListener("click",async () => {
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');
    await adminSignIn();
});

async function adminSignIn(){
    const username = document.getElementById("js-admin-username-input").value.trim();
    const password = document.getElementById("js-admin-password-input").value.trim();

    if (!username || !password) {
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
        emptyFieldToast.classList.add('show-toast');

        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, username, password);
        //ONAUTHSTATECHANGED WILL FIRE AFTER THIS
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    } catch (err) {
        console.error("Login failed:", err);
        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast');
        }, 5000);
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    }
}

////SIGN OUT
//signOut(auth);

onAuthStateChanged(auth, (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminSigninInterface.style.display = "none";
        adminMainInterface.style.display = "flex";
        adminHeader.style.display = "flex";
    } 
    else {
        adminHeader.style.display = "none";
        adminMainInterface.style.display = "none";
        adminSigninInterface.style.display = "flex";
    }
});
