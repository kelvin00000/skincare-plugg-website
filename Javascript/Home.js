import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/auth.js";


////NAVBAR BACKGROUND TOGGLE
const navdivisions = document.querySelectorAll(".nav-divisions")
const navSearchBars = document.querySelectorAll(".search")

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navdivisions.forEach(division=>division.classList.add('navbar-custom-background'));
        navSearchBars.forEach(navBar=>navBar.classList.remove('navbar-custom-background'));
    } else {
        navdivisions.forEach(division=>division.classList.remove('navbar-custom-background'));
        navSearchBars.forEach(navBar=>navBar.classList.add('navbar-custom-background'));
    }
});


////MAVBAR EXPANSION TOGGLE
document.getElementById("navbar-expand-btn").addEventListener('click', ()=>{
    document.getElementById("js-nav-expansion").classList.add("show");
    document.getElementById("js-nav-expansion").classList.add("expand");
})
document.getElementById("navbar-retract-btn").addEventListener('click', ()=>{
    document.getElementById("js-nav-expansion").classList.remove("expand");
    document.getElementById("js-nav-expansion").classList.remove("show");
})



/////////////////////////////////CAROUSEL///////////////////////////////////
const carousels = document.querySelectorAll('.carousel');
carousels.forEach(carousel => {
    const clone = carousel.innerHTML;
    carousel.innerHTML += clone;
})


//////////////////////////BACK TO TOP LINK FUNCTION//////////////////////////
const backToTopButton = document.querySelector(".js-back-to-top-btn");

window.addEventListener("scroll", ()=> {
    const scrollY = window.scrollY;
    const midway = document.body.scrollHeight / 3;

    if(backToTopButton){
        if (scrollY > midway) {
            backToTopButton.style.display = "flex";
        } else {
            backToTopButton.style.display = "none";
        }
    }
})


///////////////////////////SIGNIN POPUP TOGGLE////////////////////////////////////
const siginPopup = document.querySelector(".signin-popup");
const signinPopupOpenBtn = document.querySelectorAll(".sign-up-btn");
const signinPopupcloseBtn = document.querySelector(".close-signin");

signinPopupOpenBtn.forEach(button => {
    button.addEventListener('click', ()=>{
        if(window.innerWidth < 1001){
            contactUsSection.classList.add('hide-left');
            signUpSection.classList.remove('hide-right');
        }
        siginPopup.classList.remove('signin-hide');
        siginPopup.classList.add('signin-show');
        // navDockOverlay.style.visibility = "visible";
        document.body.style.overflow = "hidden";
    })
});
signinPopupcloseBtn.addEventListener('click', ()=>{
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');
    // navDockOverlay.style.visibility = "hidden";
    document.body.style.overflow = "auto";
})



///////LEFT AND RIGHT TOGGLES
const leftToggle = document.querySelectorAll(".sign-in");
const rightToggle = document.querySelectorAll(".contact-us");
export const imageSection = document.querySelector(".image-section");
export const signUpSection = document.querySelector(".sigup-section");
export const contactUsSection = document.querySelector(".contactus-section");

leftToggle.forEach(button =>{
    button.addEventListener('click', ()=>{
        if(window.innerWidth < 1001){
            contactUsSection.classList.add('hide-left');
            signUpSection.classList.remove('hide-right');
        }
        else{
            imageSection.classList.remove('slide-right');
            imageSection.classList.add('slide-left');
        }
    })
})
rightToggle.forEach(button =>{
    button.addEventListener('click', ()=>{
        if(window.innerWidth < 1001){
            signUpSection.classList.add('hide-right');
            contactUsSection.classList.remove('hide-left');
        }
        else{
            imageSection.classList.remove('slide-left');
            imageSection.classList.add('slide-right');
        }
    })
})


///////////////////////////////////SEARCH REDIRECT//////////////////////////////
const searchContainer = document.querySelectorAll(".search-container");

searchContainer.forEach(container => {
    const searchBtn = container.querySelector(".search-btn");
    const search = container.querySelector(".search");

    if (!search || !searchBtn) return;

    searchBtn.addEventListener("click", () => {
        const query = search.value.trim().toLowerCase();
        searchRedirect(query)
    });

    search.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = search.value.trim().toLowerCase();
            searchRedirect(query)
        }
    });
});

function searchRedirect(query){
    if(!query) return;
    window.location.href = `../SearchResults.html?query=${encodeURIComponent(query)}`;
}



////////////////////////////////NAVBAR PROFILE POPUP///////////////////////////////////
//google
// const Gprofile = document.querySelector(".g-profile");
// const GprofilePopup = document.querySelector('.g-profile-popup');

// Gprofile.addEventListener('click', ()=>{
//     GprofilePopup.classList.toggle('profile-hide')
// });

// //email
// const Eprofile = document.querySelector(".e-profile");
// const EprofilePopup = document.querySelector('.e-profile-popup');

// Eprofile.addEventListener('click', ()=>{
//     EprofilePopup.classList.toggle('profile-hide')
// });




////FAQS ACCORDIAN
async function fetchAndDisplayFaqs(){
    let allFaqs = [];
    try{
        const snap = await getDocs(collection(db, 'faqs'));
        snap.forEach(doc=>{
            const faq = doc.data();
            allFaqs.push(faq)
        });

        const shuffledFaqs = shuffleArray(allFaqs);
        const selectedFaqs = shuffledFaqs.slice(0, 5);

        selectedFaqs.forEach((faq, index) => {
            const q = document.getElementById(`q${index + 1}`);
            const a = document.getElementById(`a${index + 1}`);

            if (q && a) {
                q.innerHTML = `${faq.question} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>` ;
                a.textContent = faq.answer;
            }
        });
    }
    catch(err){
        console.error(err);
    }
}
await fetchAndDisplayFaqs();

function shuffleArray(array){
    return array
    .map(value => ({value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}