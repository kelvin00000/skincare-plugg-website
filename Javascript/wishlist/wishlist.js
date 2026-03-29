import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {collection, deleteDoc, setDoc, doc ,getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth, siginPopup } from "../auth.js";
import { signUpSection, contactUsSection, imageSection } from "../Home.js";
import { trackWishlistAction } from "./trackWishlist.js";
import { showErrorPopup, showToasttip } from "../general.js";


const wishlistCounter = document.querySelectorAll(".wishlist-counter");
const wishlistCounterContainer = document.querySelectorAll(".wishlist-counter-container");

export async function postWishlistItemID(productId, sectionId){
    const user = auth.currentUser;
    const uid = user.uid;

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

    try{
        const wishlistRef = doc(db, 'wishlist', uid, 'products', productId);
        await setDoc(wishlistRef, {added: true});

        showToasttip('Added to Wishlist', 'js-open-wishlist');
        await trackWishlistAction(uid, productId, sectionId, 'added');

        const wishlistSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));
        wishlistCounter.forEach(counter=>{
            counter.innerHTML = wishlistSnap.docs.length;
        })
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}

export async function fetchWishlistItemData(){
    const wishlistNoResultsScreen = document.getElementById("js-empty-wishlist-screen");
    const wishlistResultsScreen = document.getElementById("js-wishlist-results-screen");

    const user = auth.currentUser;
    const uid = user.uid;
    if(!user) return[];

    try{
        const productIdSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));

        if (productIdSnap.empty){
            wishlistNoResultsScreen.style.display = 'flex';
            wishlistResultsScreen.style.display = 'none';
            wishlistCounter.forEach(counter=> {counter.innerHTML = 0})
            return;
        }
        wishlistNoResultsScreen.style.display = 'none';
        wishlistResultsScreen.style.display = 'flex';

        wishlistResultsScreen.innerHTML = '';
        productIdSnap.forEach(async productId=>{
            try{
                const sectionSnap = await getDocs(collection(db, 'products'));
                sectionSnap.forEach(async section=>{
                    const SectionId = section.id;

                    try{
                        const productSnap = await getDocs(collection(db, 'products', SectionId, 'items'));
                        productSnap.forEach(product => {
                            const prodId = product.id;

                            if(productId.id===prodId){
                                const item = product.data();

                                wishlistResultsScreen.innerHTML +=
                                `
                                    <div class="w-product-card" data-wishlist-item-id="${item.id}">
                                        <div class="left">
                                            <img src="${item.image}" alt="image of ${item.name}">
                                        </div>
                                        <div class="right">
                                            <p class="w-product-name">${item.name}</p>
                                            <p class="w-description">${item.description}</p>
                                            <div class="ctas">
                                                <button class="open-product-info-window-btn js-open-product-info-window-btn js-wishlist-return-set-btn" data-section-id="${SectionId}" data-product-id="${item.id}">
                                                    <span class="js-open-product-info-window-btn js-wishlist-return-set-btn" data-section-id="${SectionId}" data-product-id="${item.id}">More Info</span>
                                                    <svg class="js-open-product-info-window-btn js-wishlist-return-set-btn" data-section-id="${SectionId}" data-product-id="${item.id}" xmlns="http://www.w3.org/2000/svg" height="19px" viewBox="0 -960 960 960" width="19px" fill="#e3e3e3">
                                                        <path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                                    </svg>
                                                </button>

                                                <div class="right">
                                                    <button class="remove-from-wishlist js-remove-from-wishlist" data-product-id="${item.id}" data-section-id="${SectionId}">
                                                    <span class="js-remove-from-wishlist" data-product-id="${item.id}" data-section-id="${SectionId}">Remove</span>
                                                    </button>

                                                    <button class="buy-now-btn js-buy-now-btn" data-section-id="${SectionId}" data-product-id="${item.id}">
                                                        <span class="js-buy-now-btn" data-section-id="${SectionId}" data-product-id="${item.id}">Buy Now</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `
                            }
                        });
                    }
                    catch(err){
                        console.error(err);
                    }
                });
            }
            catch(err){
                console.error(err);
            }
        });
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}

export async function removeWishlistItemID(productId, sectionId){
    const user = auth.currentUser;
    const uid = user.uid;

    try{
        await deleteDoc(doc(db, 'wishlist', uid, 'products', productId));

        const wishlistSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));
        wishlistCounter.forEach(counter=>{
            counter.innerHTML = wishlistSnap.docs.length;
        })
        if(wishlistSnap.docs.length===0) {
            document.getElementById('js-wishlist-results-screen').style.display = 'none';
            document.getElementById('js-empty-wishlist-screen').style.display = 'flex';
        }

        await trackWishlistAction(uid, productId, sectionId, 'removed');
        await fetchWishlistItemData();
    }
    catch(err){
        console.error(err)
        showErrorPopup('Please check your Internet connection and try again');
    }
}



onAuthStateChanged(auth, async user=>{
    if(user){
        const user = auth.currentUser;
        const uid = user.uid;

        wishlistCounterContainer.forEach(container=>{
            container.style.display = 'flex';
        })

        const wishlistSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));
        wishlistCounter.forEach(counter=>{
            counter.innerHTML = wishlistSnap.docs.length;
        })
    }else{
        wishlistCounterContainer.forEach(container=>{
            container.style.display = 'none';
        })
        wishlistNoUserScreen.style.display = 'flex';
    }
})