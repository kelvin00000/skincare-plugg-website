import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { ref, set, get, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db, auth, siginPopup } from "../Javascript/Forms.js";
import { showSavedToWishlistPopup } from "../Javascript/Products.js";
import { signUpSection, contactUsSection, imageSection } from "../Javascript/Home.js";


//VARIABLES
const res = await fetch("/Javascript/Data.json");
const data = await res.json();
export const allProducts = [
    ...data.serumsSection.flatMap(section => section.product),
    ...data.facecreamSection.flatMap(section => section.product),
    ...data.bodyoilSection.flatMap(section => section.product),
    ...data.sunscreenSection.flatMap(section => section.product),
    ...data.facewashSection.flatMap(section => section.product),
    ...data.tonerSection.flatMap(section => section.product),
    ...data.bodylotionSection.flatMap(section => section.product),
    ...data.facemoisturiserSection.flatMap(section => section.product),
    ...data.cleanserSection.flatMap(section => section.product),
    ...data.facemaskSection.flatMap(section => section.product),
    ...data.bodywashSection.flatMap(section => section.product),
    ...data.essenceSection.flatMap(section => section.product),
    ...data.treatmentcreamSection.flatMap(section => section.product),
    ...data.bodyscrubSection.flatMap(section => section.product)
];



//////////////////////////POST PRODUCT ID TO DB
export async function postWishlistItemID(productId){
    const user = auth.currentUser;

    if(!user){
        if(window.innerWidth < 1001){
            contactUsSection.classList.add('hide-left');
            signUpSection.classList.remove('hide-right');
        }
        imageSection.classList.remove('slide-right');
        imageSection.classList.add('slide-left');

        siginPopup.classList.remove('signin-hide');
        siginPopup.classList.add('signin-show');
        return;
    }
    const wishlistRef = ref(db, `wishlist/${user.uid}/${productId}`);

    set(wishlistRef, true)
        .then(()=> {
            showSavedToWishlistPopup();
        })
        .catch(error=> console.error(error))

    const wishlistItems = await fetchWishlistItemData(allProducts);
    renderWishlistUI(wishlistItems);
}

////////////////////////FETCH PRODUCT ID AND RETURN PRODUCT DATA FUNCTION
async function fetchWishlistItemData(allProducts){
    const wishlistCounter = document.querySelectorAll(".js-wishlist-counter");
    const wishlistNoResultsScreen = document.querySelector(".wishlist-noresults-screen");
    const wishlistResultsScreen = document.querySelector(".wishlist-results-screen");
    const user = auth.currentUser;
    if(!user){return[];}

    const wishlistRef = ref(db, `wishlist/${user.uid}`);
    const snapshot = await get(wishlistRef);

    if (!snapshot.exists()){
        wishlistNoResultsScreen.style.display = 'flex';
        wishlistResultsScreen.style.display = 'none';
        wishlistCounter.forEach(counter=> {counter.innerHTML = 0})
        return [];
    }

    wishlistNoResultsScreen.style.display = 'none';
    wishlistResultsScreen.style.display = 'flex';

    const productIds = Object.keys(snapshot.val());
    wishlistCounter.forEach(counter=> {counter.innerHTML = productIds.length})

    //MATCHES FETCHED IDS TO LOCAL JSON DATA
    return allProducts.filter(product => productIds.includes(product.id));
}

///////////////////////REMOVE PRODUCT ID FROM DB FUNCTION
export async function removeWishlistItemID(productId){
    const user = auth.currentUser;

    const wishlistRef = ref(db, `wishlist/${user.uid}/${productId}`);
    await remove(wishlistRef)

    const wishlistItems = await fetchWishlistItemData(allProducts);
    renderWishlistUI(wishlistItems);
}

///////////////////////RENDER WISHLIST UI FUNCTION
async function renderWishlistUI(){
    const wishlistResultsScreen = document.querySelector(".wishlist-results-screen");
    const wishlistItems = await fetchWishlistItemData(allProducts);

    wishlistResultsScreen.innerHTML = wishlistItems.map(item => 
        `
            <div class="w-product-card">
                <div class="left">
                    <img src="${item.image}" alt="image of ${item.name}">
                </div>
                <div class="right">
                    <p class="w-product-name">${item.name}</p>
                    <p class="w-description">${item.description}</p>
                    <div class="buttons">
                        <button class="remove-from-wishlist js-remove-from-wishlist" data-id="${item.id}">
                        <p class="js-remove-from-wishlist" data-id="${item.id}">remove</p>
                        </button>
                        <button class="open-popup js-open-popup" data-id="${item.id}">
                        <p class="js-open-popup" data-id="${item.id}">more info</p>
                        </button>
                    </div>
                </div>
            </div>
        `
    )
}

const wishlistCounterContainer = document.querySelectorAll(".wishlist-counter-container");
const wishlistNoUserScreen = document.querySelector(".wishlist-noUser-screen");

onAuthStateChanged(auth, user=>{
    if(user){
        wishlistCounterContainer.forEach(container=>{
            container.style.display = 'flex';
        })
        wishlistNoUserScreen.style.display = 'none';
        fetchWishlistItemData(allProducts);
        renderWishlistUI()
    }else{
        wishlistCounterContainer.forEach(container=>{
            container.style.display = 'none';
        })
        wishlistNoUserScreen.style.display = 'flex';
    }
})