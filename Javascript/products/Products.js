import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../auth.js";
import  displayProductInfoWindow  from "./productsinfo.js";
import { showErrorPopup } from "../general.js";


////POPUP TOGGLE
const windowContainer = document.getElementById('js-window-container');
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-open-product-info-window-btn')) {
        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;

        windowContainer.classList.remove('close');
        windowContainer.classList.add('show');

        showInfoWindowLoader()
        displayProductInfoWindow(sectionId, productId);
        document.body.style.overflow = "hidden";
    }
});
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-close-button')) {
        windowContainer.classList.remove('show');
        windowContainer.classList.add('close');
        document.body.style.overflow = "auto";
    }
});
function showInfoWindowLoader(){
    windowContainer.innerHTML=
    `
    <div class="skeleton-loading-screen">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
    </div>
    `
}


////PRODUCT GRID
const productsPage = document.getElementById('js-all-products');
async function FetchAndDisplayGridItems(){
    try{
        const snap = await getDocs(collection(db, 'products'));
        
        if(productsPage){
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
                            <div class="product-card" style="background-image: url('${product.image}');">
                                
                                <div class="top">
                                    <div class="left">
                                        <button class="add-to-wishlist-btn js-add-to-wishlist-btn" data-section-id="${productSecId}" data-product-id="${product.id}">
                                            <span class="js-add-to-wishlist-btn" data-section-id="${productSecId}" data-product-id="${product.id}">Add to Wishlist</span>
                                            <svg class="js-add-to-wishlist-btn" data-section-id="${productSecId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00000">
                                                <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="right">
                                        <span class="product-name">${product.name}</span>
                                        <div class="product-price"><span>GHC</span> ${product.price}</div>
                                    </div>
                                </div>
                                <div class="bottom">
                                    <div class="left">
                                        <button class="open-product-info-window-btn js-open-product-info-window-btn" data-section-id="${productSecId}" data-product-id="${product.id}">
                                            <span class="js-open-product-info-window-btn" data-section-id="${productSecId}" data-product-id="${product.id}">More Info</span>
                                            <svg class="js-open-product-info-window-btn" data-section-id="${productSecId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
                                                <path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                            </svg>
                                        </button>

                                        <button class="add-to-cart-btn js-add-to-cart-btn" data-section-id="${productSecId}" data-product-id="${product.id}">
                                           <span class="js-add-to-cart-btn" data-section-id="${productSecId}" data-product-id="${product.id}">Add to Cart</span>
                                            <svg class="js-add-to-cart-btn" data-section-id="${productSecId}" data-product-id="${product.id}" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                                <g id="SVGRepo_iconCarrier"> 
                                                <g clip-path="url(#clip0_15_35)"> 
                                                <rect width="24" height="24" fill="none"/> 
                                                <path d="M5.33331 6H19.8672C20.4687 6 20.9341 6.52718 20.8595 7.12403L20.1095 13.124C20.0469 13.6245 19.6215 14 19.1172 14H16.5555H9.44442H7.99998" stroke="#F7F6F3" stroke-linejoin="round"/> 
                                                <path d="M2 4H4.23362C4.68578 4 5.08169 4.30341 5.19924 4.74003L8.30076 16.26C8.41831 16.6966 8.81422 17 9.26638 17H19" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round"/> 
                                                <circle cx="10" cy="20" r="1" stroke="#F7F6F3" stroke-linejoin="round"/> 
                                                <circle cx="17.5" cy="20" r="1" stroke="#F7F6F3" stroke-linejoin="round"/> 
                                                </g> 
                                                <defs> 
                                                    <clipPath id="clip0_15_35"> 
                                                        <rect width="24" height="24" fill="white"/> 
                                                    </clipPath> 
                                                </defs> 
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="right">
                                        <button class="buy-now-btn js-buy-now-btn" data-section-id="${productSecId}" data-product-id="${product.id}">
                                            <span class="js-buy-now-btn" data-section-id="${productSecId}" data-product-id="${product.id}">Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })

                }catch(err){
                    console.error(err);
                }
            })
        }
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}
FetchAndDisplayGridItems().then(() => {
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
    }
});