////////////////////////////////NAVDOCK TOGGLE FUNCTIONS/////////////////////////
const navDockOpenBtn = document.querySelector(".open-navdock");
const navDockCloseBtn = document.querySelector(".close-navdock");
const navDock = document.querySelector(".nav-dock");
const navDockOverlay = document.querySelector(".dock-overlay");

let startY = 0;
let endY = 0;

navDock.addEventListener('touchstart', event=>{
    startY = event.changedTouches[0].screenY;
})
navDock.addEventListener('touchend', event=>{
    endY = event.changedTouches[0].screenY;
    swipeDown();
})
function swipeDown(){
    const distance = endY - startY;
    if(distance>100){
        navDock.classList.remove('navdock-show');
        navDock.classList.add('navdock-hide');
        navDockOverlay.style.visibility = "hidden";
        navDockCloseBtn.style.visibility = "hidden";
        navDockOpenBtn.style.visibility = "visible";
    }
}
navDockOpenBtn.addEventListener('click', ()=>{
    navDock.classList.remove('navdock-hide');
    navDock.classList.add('navdock-show');
    navDockOverlay.style.visibility = "visible";
    navDockCloseBtn.style.visibility = "visible";
    navDockOpenBtn.style.visibility = "hidden";
});
navDockCloseBtn.addEventListener('click', ()=>{
    navDock.classList.remove('navdock-show');
    navDock.classList.add('navdock-hide');
    navDockOverlay.style.visibility = "hidden";
    navDockCloseBtn.style.visibility = "hidden";
    navDockOpenBtn.style.visibility = "visible";
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
const signinPopupOpenBtn = document.querySelectorAll(".signup-toggle");
const signinPopupcloseBtn = document.querySelector(".close-signin");

signinPopupOpenBtn.forEach(button => {
    button.addEventListener('click', ()=>{
        if(window.innerWidth < 1001){
            contactUsSection.classList.add('hide-left');
            signUpSection.classList.remove('hide-right');
        }
        siginPopup.classList.remove('signin-hide');
        siginPopup.classList.add('signin-show');
        navDockOverlay.style.visibility = "visible";
        document.body.style.overflow = "hidden";
    })
});
signinPopupcloseBtn.addEventListener('click', ()=>{
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');
    navDockOverlay.style.visibility = "hidden";
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
const searchBar = document.querySelectorAll(".search-bar");

searchBar.forEach(bar => {
    const searchBtn = bar.querySelector(".search-btn");
    const search = bar.querySelector(".search");

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
const Gprofile = document.querySelector(".g-profile");
const GprofilePopup = document.querySelector('.g-profile-popup');

Gprofile.addEventListener('click', ()=>{
    GprofilePopup.classList.toggle('profile-hide')
});

//email
const Eprofile = document.querySelector(".e-profile");
const EprofilePopup = document.querySelector('.e-profile-popup');

Eprofile.addEventListener('click', ()=>{
    EprofilePopup.classList.toggle('profile-hide')
});






//////////////////////////////FAQS FUNCTIONS/////////////////////////////////////

fetch("/Javascript/FAQs.json")
.then(response => response.json())
.then(faqs => {
    const shuffledFaqs = shuffleArray(faqs);
    const selectedFaqs = shuffledFaqs.slice(0, 5);

    selectedFaqs.forEach((faq, index) => {
        const q = document.getElementById(`q${index + 1}`);
        const a = document.getElementById(`a${index + 1}`);

        if (q && a) {
            q.innerHTML = `${faq.question} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>` ;
            a.textContent = faq.answer;
        }
    });
})

function shuffleArray(array){
    return array
    .map(value => ({value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}