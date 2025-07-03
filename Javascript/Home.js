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
const closeBtn = document.querySelector(".close-signin");

signinPopupOpenBtn.forEach(button => {
    button.addEventListener('click', ()=>{
        siginPopup.classList.remove('signin-hide');
        siginPopup.showModal();
        siginPopup.classList.add('signin-show');
    })
});
closeBtn.addEventListener('click', ()=>{
    siginPopup.classList.remove('signin-show');
    siginPopup.classList.add('signin-hide');
    siginPopup.close();
    
})



///////LEFT AND RIGHT TOGGLES
const leftToggle = document.querySelectorAll(".sign-in");
const rightToggle = document.querySelectorAll(".contact-us");
const imageSection = document.querySelector(".image-section");

leftToggle.forEach(button =>{
    button.addEventListener('click', ()=>{
        imageSection.classList.remove('slide-right');
        imageSection.classList.add('slide-left');
    })
})
rightToggle.forEach(button =>{
    button.addEventListener('click', ()=>{
        imageSection.classList.remove('slide-left');
        imageSection.classList.add('slide-right');
    })
})


///////////////////////////////////SEARCH REDIRECT//////////////////////////////
const searchBtn = document.querySelectorAll(".search-btn");
const search = document.querySelectorAll(".search");
const searchInput = search.value;

searchBtn.forEach(button => {
    button.addEventListener('click', ()=>{
        searchRedirect();
    })
})
search.forEach(Input => {
    Input.addEventListener('keydown', (e)=>{
        if(e.key == 'Enter'){
            searchRedirect();
        }
    })
})

function searchRedirect(){
    if (searchInput !== "") {
        window.location.href = `SearchResults.html?q=${encodeURIComponent(searchInput)}`;
        
        searchInput = '';
    }
}



////////////////////////////////PROFILE POPUP///////////////////////////////////
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