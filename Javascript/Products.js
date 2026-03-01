import {collection, deleteDoc, setDoc, doc ,getDocs, getDoc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../Javascript/Forms.js";
import  displayProductInfoWindow  from "../Javascript/productsinfo.js";
import {postWishlistItemID, removeWishlistItemID } from "../Javascript/wishlist.js";
import { publishReview } from "../Javascript/reviews.js";

////////////////////////////////////////POPUP FEATURE///////////////////////////////////////////////
///////////////////////////POPUP TOGGLE//////////////////////////////
export const popup = document.querySelector
(".popup");
const productSections = document.querySelectorAll(".product-section")

document.addEventListener('click', element => {
    if (element.target.classList.contains('js-open-popup')) {
        const productId = element.target.dataset.id;
        displayProductInfoWindow(productId);

        popup.classList.remove('closing');
        popup.classList.add('show');
        document.body.style.overflow = "hidden";
    }
});
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-close-button')) {
        const popup = document.querySelector('.popup');
        popup.classList.remove('show');
        popup.classList.add('closing');
        document.body.style.overflow = "auto";
    }
});

///////////////////////////REVIEW FUNCTIONS//////////////////////////////
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-submit-review')) {
        let reviewMessageContent = document.getElementById('user-review-message').value;
        if(reviewMessageContent==='') return;
        const productId = element.target.dataset.productId;
        const sectionId = element.target.dataset.sectionId;
        passReview(reviewMessageContent, sectionId, productId)
        reviewMessageContent='';
    }
});

function passReview(reviewMessageContent, sectionId, productId){
    const submitBtnText = document.querySelector('.submit-btn-text');
    const reviewBtnLoader = document.getElementById('js-review-loader');

    submitBtnText.style.display = "none";
    reviewBtnLoader.style.display = "flex";

    setTimeout(()=>{
        submitBtnText.style.display = "flex";
        reviewBtnLoader.style.display = "none";
    }, 2000)

    publishReview(sectionId, productId, reviewMessageContent);
}
export function reviewSuccessResponse(){
    const submitBtnText = document.querySelector('.submit-btn-text');
    const successText = document.querySelector('.success-text');
    const reviewBtnLoader = document.getElementById('js-review-loader');

    setTimeout(()=>{
        reviewBtnLoader.style.display = "none";
        successText.style.display = "flex";
    }, 500)

    setTimeout(()=>{
        successText.style.display = "none";
        submitBtnText.style.display = "flex";
    }, 1500)
}
export function reviewFailureResponse(){
    const submitBtnText = document.querySelector('.submit-btn-text');
    const failedText = document.querySelector('.failed-text');
    const reviewBtnLoader = document.getElementById('js-review-loader');

    setTimeout(()=>{
        reviewBtnLoader.style.display = "none";
        failedText.style.display = "flex";
    }, 500)

    setTimeout(()=>{
        failedText.style.display = "none";
        //reviewMessageContent = " ";
        submitBtnText.style.display = "flex";
    }, 1500)
}



/////////////////////////////////////////////////WHISHLIST///////////////////////////////////////////

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
    button.addEventListener('click', ()=>{
        wishlistPopup.classList.remove('wishlist-hide');
        wishlistPopup.classList.add('wishlist-show')

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

productSections.forEach(section => {
    section.addEventListener("click", productCard=>{
        if (productCard.target.closest(".js-add-to-wishlist")) {

            const addToWishlistBtn = productCard.target.closest(".js-add-to-wishlist");
            if (addToWishlistBtn) { 
                postWishlistItemID(addToWishlistBtn.dataset.id);
            }
        }
    });
})
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
        const productId = element.target.dataset.id;
        removeWishlistItemID(productId);
    }
});


//////////////////////////////////////////////PRODUCT GRIDS////////////////////////////////////////////////////

const productsPage = document.getElementById('js-all-products');
async function FetchAndDisplayGridItems(){
    try{
        const snap = await getDocs(collection(db, 'products'));
        
        productsPage.innerHTML='';
        snap.forEach(async doc=>{
            const productSec = doc.data().title;
            const productSecId = doc.id;
            productsPage.innerHTML+=
            `
                <section class="product-section">
                    <div class="title">${productSec}</div>
                    <div class="grid-container" id="${productSecId}-grid-container"></div>
                </section>

            `

            try{
                const snap = await getDocs(collection(db, 'products', productSecId, 'items'));
                snap.forEach(doc=>{
                    const product = doc.data();

                    document.getElementById(`${productSecId}-grid-container`).innerHTML+=`
                        <div class="product-card">
                            <img src="${product.image}" alt="image of ${product.name}">
                            <p class="name">${product.name}</p>
                            <div class="wishlist-container">
                                <button data-id="${product.id}" class="add-to-wishlist js-add-to-wishlist">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                                </svg>
                                </button>
                                <p class="wishlist-tooltip">add to wishlist</p>
                            </div>
                            <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                        </div>
                    `;
                })

            }catch(err){
                console.error(err);
            }
        })
    }catch(err){
        console.error(err);
    }
}
FetchAndDisplayGridItems()