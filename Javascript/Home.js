
/*const counters = document.querySelectorAll(".counter");
const container = document.querySelector(".js-counter");

let activated = false;

window.addEventListener("scroll", ()=>{
    if(pageXOffset > container.offsetTop - container.offsetHeight - 200 && activated === false){
        
        counters.forEach(counter => {
            counter.innerText = 0;
            let count = 0;

            function updateCount(){
                const target = parseInt(counter.dataset.count);

                if(count < target){
                    count++;
                    count.innerText = count;
                    setTimeout(updateCount, 10);
                }
                else{
                    counter.innerText = target;
                }
            }
            updateCount();
            activated = true;
        });
    }
    else if(pageYOffset < container.offsetTop - container.offsetHeight - 500 || pageYOffset === 0 && activated === true){
            counters.forEach(counter => {
            counter.innerText = 0;
        })

        activated = false;
    }
});
*/

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