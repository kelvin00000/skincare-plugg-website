import { removeWishlistItemID, postWishlistItemID, fetchWishlistItemData } from "./wishlist.js";


////////////WISHLIST POPUP /////////////////////
const wishlistPopup = document.querySelector(".wishlist-popup");
const openWishlistBtn = document.querySelectorAll(".js-open-wishlist");
const overlay = document.querySelector(".wishlist-popup-overlay");
const wishlistRedirectlink = document.querySelectorAll(".js-close-wishlist-popup");

let startY = 0;
const distance = 200; 

wishlistPopup.addEventListener('touchstart', event=>{
    startY = event.touches[0].clientY;
})
wishlistPopup.addEventListener('touchend', event=>{
    const endY = event.changedTouches[0].clientY;
    const difference = startY - endY;
    if((Math.abs(difference)) > distance){
        if(difference>0){
            swipeUp();
        }else{
            swipeDown();
        }
    }
})
function swipeDown(){
    if(window.innerWidth < 605){
        wishlistPopup.classList.remove('wishlist-expand');
        wishlistPopup.classList.remove('wishlist-show');
        wishlistPopup.classList.add('wishlist-hide');

        overlay.classList.remove('overlay-show');
        overlay.classList.add('overlay-hide')

        document.body.style.overflow = "auto";
    }
}
function swipeUp(){
    if(window.innerWidth < 605){
        wishlistPopup.classList.add('wishlist-expand');
    }
}


openWishlistBtn.forEach(button => {
    button.addEventListener('click', async ()=>{
        await fetchWishlistItemData()
        wishlistPopup.classList.remove('wishlist-hide');
        wishlistPopup.classList.add('wishlist-show');

        overlay.classList.remove('overlay-hide');
        overlay.classList.add('overlay-show');

        savedPopup.classList.remove('show-popup');
        savedPopup.classList.add('hide-popup');

        document.body.style.overflow = "hidden";
    })
})
overlay.addEventListener('click', ()=>{
    wishlistPopup.classList.remove('wishlist-show');
    wishlistPopup.classList.add('wishlist-hide');

    overlay.classList.remove('overlay-show');
    overlay.classList.add('overlay-hide')

    document.body.style.overflow = "auto";
})
wishlistRedirectlink.forEach(link=>{
    link.addEventListener('click', ()=>{
        wishlistPopup.classList.remove('wishlist-show');
        wishlistPopup.classList.add('wishlist-hide');

        overlay.classList.remove('overlay-show');
        overlay.classList.add('overlay-hide')

        document.body.style.overflow = "auto";
    })
})



/////////////SAVED POPUP/////////////
const savedPopup = document.querySelector(".js-saved-popup");

document.addEventListener('click', element => {
    if (element.target.classList.contains('js-add-to-wishlist')) {
        const productId = element.target.dataset.productId;

        postWishlistItemID(productId);
    }
});
export function showSavedToWishlistPopup(){
    savedPopup.classList.remove('hide-popup');
    savedPopup.classList.add('show-popup');
    
    if(savedPopup.classList.contains('show-popup')){
        setTimeout(() => {
            savedPopup.classList.remove('show-popup');
            savedPopup.classList.add('hide-popup');
        }, 5000)
    }
}


////////////////REMOVE FROM WISHLIST FUNCTION/////////////
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-remove-from-wishlist')) {
        const itemId = element.target.dataset.wishlistItemId;
        removeWishlistItemID(itemId);
    }
});