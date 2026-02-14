import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/Forms.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const signupsCardsContainer = document.getElementById("js-signups-cards-result-screen");
const signupsCardsNoResults = document.getElementById("js-signups-cards-noresult-screen");
const searchInputContainer = document.getElementById("js-searchinput-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");

const failToast = document.getElementById("js-fail-toast");
const copiedToast = document.getElementById("js-copied-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');



//// NEW USER CHECK UPADTE
await updateDoc(doc(db, 'users', 'newUserCheck'), {
    newUser: false
});


async function fetchAndDisplaySignupData(){
    try{
        const snap = await getDocs(collection(db, 'users'));
        signupsCardsContainer.innerHTML = '';
        snap.forEach(doc=>{
            const user = doc.data();

            if(signupsCardsContainer && doc.id!=="newUserCheck"){
                signupsCardsContainer.innerHTML+=`
                    <div class="signup-card">
                        <div class="top">
                        ${user.profileImage? `
                            <div class="user-profile-container">
                            <img src="${user.profileImage}">
                            </div>`
                            :` <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="30px" fill="#121212"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                            `
                        }
                        ${user.name? `<div class="user-username-container">${user.name}</div>`
                            : `---`
                        }
                        
                        </div>
                        <div class="middle">
                            <div class="user-email-container">
                                ${user.email}
                            </div>
                        </div>
                        <div class="bottom">
                            <button class="copy-btn" id="copy-btn" data-email="${user.email}">Copy</button>
                            <button class="email-btn" id="email-btn" data-email="${user.email}">Email</button>
                        </div>
                    </div>
                `;
            }
        })

        if(signupsCardsContainer.innerHTML===''){
            signupsCardsContainer.style.display = 'none';
            signupsCardsNoResults.style.display = 'flex';
        }

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    }
    catch(err){
        console.error(err);

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast')
        }, 5000);
    }
}

// COPY EMAIL ADDRESS FUNCTION
document.addEventListener('click', element => {
    if (element.target.classList.contains('copy-btn')) {
        const emailText = element.target.dataset.email;
        
        navigator.clipboard.writeText(emailText)
            .then(() => {
                copiedToast.classList.add('show-toast');
                setTimeout(()=>{
                    copiedToast.classList.remove('show-toast')
                }, 5000);
            })
            .catch(err => {
                console.error('Failed to copy:', err)
                failToast.classList.add('show-toast');
                setTimeout(()=>{
                    failToast.classList.remove('show-toast')
                }, 5000);
            });
    }
});
// EMAIL COMPOSE FUNCTION 
document.addEventListener('click', element => {
    if (element.target.classList.contains('email-btn')) {
        const userEmail = element.target.dataset.email;
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}`, '_blank');
    }
});


document.getElementById("search-singups-input").addEventListener('input', async (e) => {
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    let user;

    const snap = await getDocs(collection(db, 'users'));
    snap.forEach(async doc=>{
        const currentEmail = doc.data().email;
        if(currentEmail.includes(e.target.value)) user = doc.data();

        if(signupsCardsContainer && user){
            signupsCardsNoResults.style.display = 'none';
            signupsCardsContainer.style.display = 'grid';

            signupsCardsContainer.innerHTML = '';
            signupsCardsContainer.innerHTML+=`
                <div class="signup-card">
                    <div class="top">
                    ${user.profileImage? `<div class="user-profile-container">${user.profileImage}</div>`
                        :` <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="30px" fill="#121212"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                        `
                    }
                    ${user.name? `<div class="user-username-container">${user.name}</div>`
                        : `---`
                    }
                    
                    </div>
                    <div class="middle">
                        <div class="user-email-container">
                            ${user.email}
                        </div>
                    </div>
                    <div class="bottom">
                        <button class="copy-btn" id="copy-btn" data-email="${user.email}">Copy</button>
                        <button class="email-btn" id="email-btn" data-email="${user.email}">Email</button>
                    </div>
                </div>
            `;
        }
        
    })

    if(e.target.value === '') await fetchAndDisplaySignupData()

    if(!user || signupsCardsContainer.innerHTML===''){
        signupsCardsContainer.style.display = 'none';
        signupsCardsNoResults.style.display = 'flex';
    }

    loader.classList.remove('show-loader');
    loadingScreen.classList.remove('show-loader');

});


onAuthStateChanged(auth, async (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminHeader.style.display = "flex";
        signupsCardsContainer.style.display = "grid";
        searchInputContainer.style.display = "flex";

        await fetchAndDisplaySignupData();
    } 
    else {
        adminHeader.style.display = "none";
        signupsCardsContainer.style.display = "none";
        window.location.href = `../index.html`
    }
});