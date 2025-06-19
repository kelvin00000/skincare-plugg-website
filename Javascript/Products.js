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
window.addEventListener('scroll', ()=>{
    popup.classList.remove('show');
    popup.classList.add('closing');

    popup.classList.remove('closing');
    popup.close();
})



/////////////////////////////////////WHISHLIST///////////////////////////////////////

////////////WISHLIST POPUP/////////
const wishlistPopup = document.querySelector(".wishlist-poup");
const openWishlistBtn = document.querySelectorAll(".js-open-wishlist");
const overlay = document.querySelector(".wishlist-popup-overlay");

openWishlistBtn.forEach(button=>{
    button.addEventListener('click', ()=>{
        wishlistPopup.classList.remove('wishlist-hide');
        wishlistPopup.classList.add('wishlist-show')

        overlay.classList.remove('overlay-hide');
        overlay.classList.add('overlay-show');

        savedPopup.classList.remove('show-popup');
        savedPopup.classList.add('hide-popup');
    })
})
overlay.addEventListener('click', ()=>{
    wishlistPopup.classList.remove('wishlist-show');
    wishlistPopup.classList.add('wishlist-hide');

    overlay.classList.remove('overlay-show');
    overlay.classList.add('overlay-hide')
})
window.addEventListener('scroll', ()=>{
    wishlistPopup.classList.remove('wishlist-show');
    wishlistPopup.classList.add('wishlist-hide');

    overlay.classList.remove('overlay-show');
    overlay.classList.add('overlay-hide')
})



///////////SAVED POPUP////////////
const addToWishlistBtn = document.querySelectorAll(".js-add-to-wishlist");
const savedPopup = document.querySelector(".js-saved-popup");

addToWishlistBtn.forEach(button => {
    button.addEventListener('click', ()=>{
        savedPopup.classList.remove('hide-popup');
        savedPopup.classList.add('show-popup');
        
        if(savedPopup.classList.contains('show-popup')){
            setTimeout(() => {
                savedPopup.classList.remove('show-popup');
                savedPopup.classList.add('hide-popup');
            }, 5000)
        }
    })
})



