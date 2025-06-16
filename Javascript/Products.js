//////////////////////////////POPUP FUNCTION////////////////////////////////////
const openPopupButtons = document.querySelectorAll(".js-open-popup");
const closePopup = document.querySelector(".js-close-button");
const popup = document.querySelector
(".popup");

openPopupButtons.forEach(button => {
    button.addEventListener("click", ()=>{
        popup.showModal();
        popup.classList.add('show');
    })
})

closePopup.addEventListener("click", ()=>{
    popup.classList.remove('show');
    popup.classList.add('closing');

    popup.addEventListener('animationend', () => {
        popup.classList.remove('closing');
        popup.close();
    }, { once: true })
})

