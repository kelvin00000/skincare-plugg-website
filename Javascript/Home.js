/////////////////////////////////CAROUSEL///////////////////////////////////

const carousels = document.querySelectorAll('.carousel');
carousels.forEach(carousel => {
    const clone = carousel.innerHTML;
    carousel.innerHTML += clone;
})


///////////////////////////BACK TO TOP LINK FUNCTION//////////////////////////
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