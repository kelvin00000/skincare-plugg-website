import { user } from "../auth.js";
import { showErrorPopup } from "../general.js";
import { removeWishlistItemID, postWishlistItemID, fetchWishlistItemData } from "./wishlist.js";


export function showWishlistLoader(){
    document.getElementById("js-wishlist-results-screen").innerHTML=
    `
        <div class="wishlist-skeleton-loading-screen">
            <div class="skeleton skeleton-box"></div>
            <div class="skeleton skeleton-box"></div>
            <div class="skeleton skeleton-box"></div>
        </div>
    `
}
function showWishlistUI(){
    document.getElementById("js-window-container").innerHTML=
    `
        <div class="wishlist">
            <button class="close-button js-close-button">
                <svg class="js-close-button" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>

            <div class="left">
                <h2>Your Wishlist</h2>
                <div class="text">Feel beautiful, feel confident, feel like your best self.</div>
            </div>

            <div class="right" id="js-wishlist-right">
                <div class="wishlist-results-screen" id="js-wishlist-results-screen"></div>

                <div class="wishlist-no-user-screen" id="js-wishlist-no-user-screen"> 
                    <p>You need to sign up to use the wishlist</p>
                    <button class="Sign-up-btn js-close-wishlist-window">Sign up</button>
                </div>

                <div class="empty-wishlist-screen" id="js-empty-wishlist-screen"> 
                    <svg width="100px" height="100px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="_x3C_Layer_x3E_" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="page_x2C__document_x2C__emoji_x2C__No_results_x2C__empty_page"><g id="XMLID_1521_"><path d="M21.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S21.09,14.75,21.5,14.75z" fill="#F7F6F3" id="XMLID_1887_"/><path d="M10.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S10.09,14.75,10.5,14.75z" fill="#F7F6F3" id="XMLID_1885_"/></g><g id="XMLID_1337_"><g id="XMLID_4010_"><polyline fill="none" id="XMLID_4073_" points="21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><polyline fill="none" id="XMLID_4072_" points="21.5,1.5 27.479,7.5 21.5,7.5 21.5,4    " stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5" fill="none" id="XMLID_4071_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><g id="XMLID_4068_"><path d="M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z" fill="none" id="XMLID_4070_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z" fill="none" id="XMLID_4069_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/></g></g><g id="XMLID_2974_"></polyline fill="none" id="XMLID_4009_" points="21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><polyline fill="none" id="XMLID_4008_" points="21.5,1.5 27.479,7.5 21.5,7.5 21.5,4" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5" fill="none" id="XMLID_4007_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><g id="XMLID_4004_"><path d="M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z" fill="none" id="XMLID_4006_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path d="M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z" fill="none" id="XMLID_4005_" stroke="#F7F6F3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/></g></g></g></g>
                    </svg>
                    <p>Looks like there's nothing here</p>
                    <p>add a product</p>
                    <a href="Products.html" class="js-close-wishlist-popup">
                        products
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/></svg>
                    </a>
                </div>
            </div>
        </div>
    `
}

//// WISHLIST WINDOW
const windowContainer = document.getElementById('js-window-container');

async function openWishlist() {
    if (!user) {
        showErrorPopup({errorMsg:'Sign Up before you can perform this action', classList:'open-sign-up-window-btn'});
        return;
    }

    windowContainer.classList.remove('close');
    windowContainer.classList.add('show');
    document.body.style.overflow = 'hidden';

    showWishlistUI();
    showWishlistLoader();
    await fetchWishlistItemData()
}
document.addEventListener('click', async element => {
    if (element.target.classList.contains('js-open-wishlist')) {
        await openWishlist();
    }
});

// RETURN TO WISHLIST FROM INFO WINDOW CLASSLIST SET
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-wishlist-return-set-btn')) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelectorAll('.js-close-info-window');
            if (element) {
                element.forEach(el=>el.classList.remove('js-close-button'))
                element.forEach(el=>el.classList.add('js-open-wishlist'))
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});


//// ADD TO WISHLIST
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-add-to-wishlist-btn')) {
        if (!user) {
            showErrorPopup({errorMsg:'Sign Up before you can perform this action', classList:'open-sign-up-window-btn'});
            return;
        }

        const productId = element.target.dataset.productId;
        const sectionId = element.target.dataset.sectionId;

        postWishlistItemID(productId, sectionId);
    }
});
//// REMOVE FROM WISHLIST
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-remove-from-wishlist')) {
        const productId = element.target.dataset.productId;
        const sectionId = element.target.dataset.sectionId;
        showWishlistLoader();
        removeWishlistItemID(productId, sectionId);
    }
});