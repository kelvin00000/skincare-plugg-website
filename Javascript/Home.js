/////////////////////////////////CAROUSEL///////////////////////////////////

const carousels = document.querySelectorAll('.carousel');
carousels.forEach(carousel => {
    const clone = carousel.innerHTML;
    carousel.innerHTML += clone;
})


/////////////////////REVIEW SECTION SEE MORE TOGGLE/////////////////////
const reviewSection = document.querySelector(".js-review-cards-container");
const seeMoreToggle = document.querySelector(".js-see-more");
const seeMoreText = document.querySelector(".js-see-more-text");


if(seeMoreText.innerHTML = `See more`){
    seeMoreToggle.addEventListener("click", ()=>{
    reviewSection.style.overflow = ('auto');
    seeMoreText.innerHTML = `See less`;
})
}
else if(seeMoreText.innerHTML = `See less`){
    seeMoreToggle.addEventListener("click", ()=>{
        reviewSection.style.overflow = ('hidden');
        seeMoreText.innerHTML = `See more`;
    })
}