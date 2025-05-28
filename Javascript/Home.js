
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