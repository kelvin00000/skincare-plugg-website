import { getDoc, doc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, user } from "../auth.js";
import { fetchReviewData } from "../reviews/reviews.js";
import { trackProductView } from "./trackproducts.js";
import { showErrorPopup } from "../general.js";


//////////////////////////////////////////PRODUCT INFO  WWINDOW//////////////////////////////////////////
const windowsContainer = document.getElementById("js-window-container");
export default async function displayProductInfoWindow(sectionId, productId){
    try{
        const productSnap = await getDoc(doc(db, 'products', sectionId, 'items', productId));
        const product = productSnap.data();

        windowsContainer.innerHTML=
        `
            <div class="product-info">
                <button class="js-close-button js-close-info-window">
                    <svg class="js-close-button js-close-info-window" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                </button>
                <div class="image-container">
                    <img class="product-image" src="${product.image}" alt="image of ${product.name}">
                </div>

                <div class="basic-info">
                    <div class="name">${product.name}</div>
                    <div class="second-row">
                        <div class="category-container">
                            <span>Category</span>
                            <span class="value">${product.category}</span>
                        </div>
                        <div class="price-container">
                            <span>Price</span>
                            <div>
                               <span>GHC </span>
                                <span class="value">
                                    ${product.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-details">
                <div class="left">
                    <div class="detail usage">
                        <p class="header">Description</p>
                        <p class="content description-content">${product.description}</p>
                    </div>
                    <div class="detail dossage">
                        <p class="header">Benefits</p>
                        <p class="content benefits-content">${product.usage}</p>
                    </div>
                </div>

                <div class="right">
                    <div class="detail prescription">
                        <p class="header">Prescription</p>
                        <p class="content prescription-content">${product.prescription}</p>
                    </div>
                    <div class="detail disclaimer">
                        <p class="header">Disclaimer</p>
                        <p class="content disclaimer-content">${product.disclaimer}</p>
                    </div>
                </div>
            </div>

            <div class="product-ctas">
                <div class="ask-a-question-link-container">
                    <span>Want to make an enquiry about this product?</span>
                    <button class="js-ask-about-product" data-product-name="${product.name}">Ask</button>
                </div>

                <div class="bottom">
                    <button class="add-to-wishlist-btn js-add-to-wishlist-btn" data-section-id="${sectionId}" data-product-id="${product.id}">
                        <span class="add-to-wishlist-btn js-add-to-wishlist-btn" data-section-id="${sectionId}" data-product-id="${product.id}">Add to Wishlist</span>
                        <svg class="add-to-wishlist-btn js-add-to-wishlist-btn" data-section-id="${sectionId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00000">
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
                        </svg>
                    </button>

                    <button class="add-to-cart-btn js-add-to-cart-btn" data-section-id="${sectionId}" data-product-id="${product.id}">
                        <span class="add-to-cart-btn js-add-to-cart-btn" data-section-id="${sectionId}" data-product-id="${product.id}">Add to Cart</span>
                        <svg class="add-to-cart-btn js-add-to-cart-btn" data-section-id="${sectionId}" data-product-id="${product.id}" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"/>
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
            </div>

            <div class="product-review">
                <div class="review-header">
                    Would you like to leave a review?
                </div>
                <div class="review-actions">
                    <input type="text" class="user-review-message" id="user-review-message">
                    <button class="submit-review js-submit-review" data-section-id="${sectionId}" data-product-id="${product.id}">
                        <span class="js-submit-review" data-section-id="${sectionId}" data-product-id="${product.id}">Post</span>
                    </button>
                </div>

                <div class="reviews">
                    <p class="header">What others think about this product</p>
                    <p class="review-noResults-message">
                        <span>No Reviews For This Product Yet</span>
                        <svg width="40px" height="40px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="_x3C_Layer_x3E_" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g id="page_x2C__document_x2C__emoji_x2C__No_results_x2C__empty_page"><g id="XMLID_1521_"><path d="M21.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S21.09,14.75,21.5,14.75z" fill="#F7F6F3" id="XMLID_1887_"/><path d="M10.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S10.09,14.75,10.5,14.75z" fill="#F7F6F3" id="XMLID_1885_"/></g><g id="XMLID_1337_"><g id="XMLID_4010_"><polyline fill="none" id="XMLID_4073_" points="21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><polyline fill="none" id="XMLID_4072_" points="21.5,1.5 27.479,7.5 21.5,7.5 21.5,4    " stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5" fill="none" id="XMLID_4071_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><g id="XMLID_4068_"><path d="M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z" fill="none" id="XMLID_4070_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z" fill="none" id="XMLID_4069_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/></g></g><g id="XMLID_2974_"></polyline fill="none" id="XMLID_4009_" points="21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><polyline fill="none" id="XMLID_4008_" points="21.5,1.5 27.479,7.5 21.5,7.5 21.5,4" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5" fill="none" id="XMLID_4007_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><g id="XMLID_4004_"><path d="M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z" fill="none" id="XMLID_4006_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z" fill="none" id="XMLID_4005_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/></g></g></g></g>
                        </svg>
                    </p>
                    <div class="review-cards-container"></div>
                </div>
            </div>
        `;

        // FETCH REVIEW DATA PLACED HERE BECAUSE OF UI DEPENDENCIES - 
        // REVIEW MESSAGES CONTAINER
        await fetchReviewData(productId);

        const userId = user.uid;
        await trackProductView(userId, sectionId, productId);
    }
    catch(err){
        console.error(err);
       showErrorPopup('Please check your Internet connection and try again');
    }
}

document.addEventListener('click', e=>{
    if(e.target.classList.contains("js-ask-about-product")){
        const productName = e.target.dataset.productName;

        const hourOfDay = new Date().getUTCHours();
        let greeting='';
        if(hourOfDay<11) greeting='Morning'
        else if(hourOfDay>11&&hourOfDay<17) greeting='Afternoon'
        else greeting='Evening';

        const msg = `Hello Good ${greeting}, I would like to make an enquiry about your ${productName} product, `;
        window.open(`https://wa.me/+233505869086?text=${encodeURIComponent(msg)}`, '_blank');
    }
})