import { getDoc, doc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth } from "../auth.js";
import { fetchReviewData } from "../reviews/reviews.js";
import { trackProductView } from "./trackproducts.js";


const userId = auth.currentUser?.uid;

//////////////////////////////////////////PRODUCT INFO  WWINDOW//////////////////////////////////////////
const productPopupContainer = document.querySelector(".popup-padding");
export default async function displayProductInfoWindow(sectionId, productId){
    try{
        const productSnap = await getDoc(doc(db, 'products', sectionId, 'items', productId));
        const product = productSnap.data();
        productPopupContainer.innerHTML=
        `
        <div class="product-info">
            <div class="image"><img src="${product.image}" alt="image of ${product.name}">
            </div>
            <div class="basic-info">
                <div class="name">
                    <p>${product.name}</p>
                    <button class="js-close-button">
                        <svg class="js-close-button" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        <p class="js-close-button">Close</p>
                    </button>
                </div>
                <p class="category">category: <span class="category-content">${product.category}</span></p>
                <p class="price-container"><span class="price">price: </span>GhC <span class="price-content">${product.price.toLocaleString()}</span></p>
            </div>
        </div>
        <div class="product-details">
            <div class="left">
                <div class="usage">
                    <p class="header">Description</p>
                    <p class="content usage-content">${product.description}</p>
                </div>
                <div class="dossage">
                    <p class="header">Benefits</p>
                    <p class="content dosage-content">${product.usage}</p>
                </div>
            </div>

            <div class="right">
                <div class="condition">
                    <p class="header">Prescription</p>
                    <p class="content condition-content">${product.prescription}</p>
                </div>
                <div class="disclaimer">
                    <p class="header">Disclaimer</p>
                    <p class="content disclaimer-content">${product.disclaimer}</p>
                </div>
            </div>
        </div>

        <div class="product-review">
            <div class="review-header">
                Would you like to leave a review?
            </div>
            <div class="review-actions">
                <div class="input">
                    <input type="text" id="user-review-message" required>
                    <button class="submit-review js-submit-review" data-section-id="${sectionId}" data-product-id="${product.id}">
                        <p class="submit-btn-text js-submit-review" data-section-id="${sectionId}" data-product-id="${product.id}">Post</p>
                        <p class="success-text">Success!</p>
                        <p class="failed-text">try again!</p>
                        <div id="js-review-loader" class="review-loader"></div>
                    </button>
                </div>
            </div>
            <div class="Popup-reviews-container">
                <p class="Popup-review-header">What others think about this product</p>
                <p class="Popup-review-noResults-screen">No Reviews For This Product Yet</p>
                <div class="Popup-review-cards-container"></div>
            </div>
        </div>
        `;

        // PLACED HERE BECAUSE OF UI DEPENDENCIES - 
        // REVIEW MESSAGES CONTAINER
        await fetchReviewData(productId);

        await trackProductView(userId, sectionId, productId);
    }
    catch(err){
        console.error(err);
    }
}