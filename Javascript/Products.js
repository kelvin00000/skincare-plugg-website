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
        const productId = element.target.dataset.id;
        passReview(reviewMessageContent, productId)
    }
});
function passReview(reviewMessageContent, productId){
    const submitBtnText = document.querySelector('.submit-btn-text');
    const reviewBtnLoader = document.getElementById('js-review-loader');

    submitBtnText.style.display = "none";
    reviewBtnLoader.style.display = "flex";

    publishReview(productId, reviewMessageContent);
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
const expandBtn = document.querySelector(".expand");
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
fetch("/Javascript/Data.json")
.then(response => response.json())
.then(data => {
    /////////////////////////////////SERUMS////////////////////////////////////
    const serumGrid = document.querySelector(".serum-grid-container");
    data.serumsSection.forEach(section => {
        section.product.forEach(product => {
            if(serumGrid){
                serumGrid.innerHTML+=`
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
            }
        })
    });


    ///////////////////////////////////////FACECREAMS//////////////////////////////
    const facecreamGrid = document.querySelector(".facecream-grid-container");
    data.facecreamSection.forEach(section => {
        section.product.forEach(product => {
            if(facecreamGrid){
                facecreamGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ////////////////////////////////////BODY OILS////////////////////////////
    const bodyoilGrid = document.querySelector(".bodyoil-grid-container");
    data.bodyoilSection.forEach(section => {
        section.product.forEach(product => {
            if(bodyoilGrid){
                bodyoilGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ///////////////////////////////////SUNSCREENS///////////////////////////////
    const sunscreenGrid = document.querySelector(".sunscreen-grid-container");
    data.sunscreenSection.forEach(section => {
        section.product.forEach(product => {
            if(sunscreenGrid){
                sunscreenGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ///////////////////////////////FACEWASHES//////////////////////////////////
    const facewashGrid = document.querySelector(".facewash-grid-container");
    data.facewashSection.forEach(section => {
        section.product.forEach(product => {
            if(facewashGrid){
                facewashGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ///////////////////////////////TONERS///////////////////////////////////
    const tonerGrid = document.querySelector(".toner-grid-container");
    data.tonerSection.forEach(section => {
        section.product.forEach(product => {
            if(tonerGrid){
                tonerGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ///////////////////////////////BODY LOTIONS//////////////////////////////
    const bodylotionGrid = document.querySelector(".bodylotion-grid-container");
    data.bodylotionSection.forEach(section => {
        section.product.forEach(product => {
            if(bodylotionGrid){
                bodylotionGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ///////////////////////////////FACE MOISTURISERS////////////////////////////
    const facemoisturiserGrid = document.querySelector(".facemoisturiser-grid-container");
    data.facemoisturiserSection.forEach(section => {
        section.product.forEach(product => {
            if(facemoisturiserGrid){
                facemoisturiserGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ////////////////////////////////CLEANSERS////////////////////////////////
    const cleanserGrid = document.querySelector(".cleanser-grid-container");
    data.cleanserSection.forEach(section => {
        section.product.forEach(product => {
            if(cleanserGrid){
                cleanserGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    /////////////////////////////////FACE MASKS/////////////////////////////
    const facemaskGrid = document.querySelector(".facemask-grid-container");
    data.facemaskSection.forEach(section => {
        section.product.forEach(product => {
            if(facemaskGrid){
                facemaskGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ////////////////////////////////BODY WASHES/////////////////////////////
    const bodywashGrid = document.querySelector(".bodywash-grid-container");
    data.bodywashSection.forEach(section => {
        section.product.forEach(product => {
            if(bodywashGrid){
                bodywashGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    /////////////////////////////////ESSENCE///////////////////////////////
    const essenceGrid = document.querySelector(".essence-grid-container");
    data.essenceSection.forEach(section => {
        section.product.forEach(product => {
            if(essenceGrid){
                essenceGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ////////////////////////////////TREATMENT CREAMS///////////////////////
    const treatmentcreamGrid = document.querySelector(".treatmentcream-grid-container");
    data.treatmentcreamSection.forEach(section => {
        section.product.forEach(product => {
            if(treatmentcreamGrid){
                treatmentcreamGrid.innerHTML+=`
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });


    ////////////////////////////////BODY SCRUBS////////////////////////////
    const bodyscrubGrid = document.querySelector(".bodyscrub-grid-container");
    data.bodyscrubSection.forEach(section => {
        section.product.forEach(product => {
            if(bodyscrubGrid){
                bodyscrubGrid.innerHTML+=
                `
                    <div class="product-card">
                        <img src="${product.image}" alt="image of ${product.name}">
                        <p class="name">${product.name}</p>
                        <div class="wishlist-container">
                            <button class="add-to-wishlist js-add-to-wishlist" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                            </button>
                            <p class="wishlist-tooltip">add to wishlist</p>
                        </div>
                        <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
                    </div>
                `;
            }
        })
    });
})
.catch(error => {
    console.error("Error loading products: ", error);
});