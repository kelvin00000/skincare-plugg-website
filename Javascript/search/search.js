import {collection, getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth } from "../auth.js";
import { trackSearch } from "./tracksearch.js";

const userId = auth.currentUser?.uid;

function showSearchPageUI(){
    document.getElementById("all-products").innerHTML=
    `
        <div class="product-section">
            <p class="search-results-text">Showing results for <span id="search-query"></span></p>
            <div class="grid-container" id="grid-container"></div>
            <div class="no-results-screen" id="no-results-screen">
                Sorry Couldn't find That Item
            </div>
        </div>
    `
}
function showProductPageLoader(){
    document.getElementById("all-products").innerHTML=
    `
        <div class="product-section">
            <div class="productpage-skeleton-loader">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton-grid">
                    <div class="skeleton skeleton-box"></div>
                    <div class="skeleton skeleton-box"></div>
                    <div class="skeleton skeleton-box"></div>
                    <div class="skeleton skeleton-box"></div>
                </div>
            </div>
        </div>
    `
}

async function filterProducts(query) {
    const queriedItem = query.toLowerCase();
    let sectionResults = [];

    try{
        const snap = await getDocs(collection(db, 'products'));

        for(const doc of snap.docs){
            const productSecId = doc.id;

            try{
                const snap = await getDocs(collection(db, 'products', productSecId, 'items'));
                snap.forEach(doc=>{
                    const allKeywords = doc.data().keywords.map(keywords =>
                        keywords.toLowerCase()
                    );
                    const match = allKeywords.some(keywords => keywords.includes(queriedItem));
                    if(match) {
                        let product = {};
                        product.sectionId = productSecId;
                        Object.entries(doc.data()).forEach(([key, value])=>{
                            product[key] = value;
                        })
                        sectionResults.push(product);
                    };
                })
            }
            catch(err){
                console.error(err);
                showErrorPopup(err);
            }
        }
    }
    catch(err){
        console.error(err);
        showErrorPopup(err);
    }

   return sectionResults;
}
function renderProducts(products){

    const productsContainer = document.getElementById("grid-container");
    const noResultsScreen = document.getElementById("no-results-screen");

    if (products.length === 0) {
        noResultsScreen.style.display = "flex";
        productsContainer.style.display = "none";
        return;
    }
    noResultsScreen.style.display = "none";
    productsContainer.style.display = "grid";

    productsContainer.innerHTML = "";
    products.forEach(product => {
        productsContainer.innerHTML += 
        `
            <div class="product-card" style="background-image: url('${product.image}');">
                <div class="top">
                    <div class="left">
                        <button class="add-to-wishlist-btn js-add-to-wishlist-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">
                            <span class="js-add-to-wishlist-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">Add to Wishlist</span>
                            <svg class="js-add-to-wishlist-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00000">
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
                        <button class="open-product-info-window-btn js-open-product-info-window-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">
                            <span class="js-open-product-info-window-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">More Info</span>
                            <svg class="js-open-product-info-window-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
                                <path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                            </svg>
                        </button>

                        <button class="add-to-cart-btn js-add-to-cart-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">
                            <span class="js-add-to-cart-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">Add to Cart</span>
                            <svg class="js-add-to-cart-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"/>
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
                        <button class="buy-now-btn js-buy-now-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">
                            <span class="js-buy-now-btn" data-section-id="${product.sectionId}" data-product-id="${product.id}">Buy Now</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    
}


async function runSearch(){
    showProductPageLoader();

    const params = new URLSearchParams(window.location.search);
    const query = params.get("query")?.toLowerCase() ;

    if(!query){
        console.warn("no query found!");
        return;
    }
    const results = await filterProducts(query);

    showSearchPageUI();
    document.getElementById("search-query").innerHTML=query;
    renderProducts(results);
    
    await trackSearch(userId, query, results)
}

document.addEventListener("DOMContentLoaded", runSearch);