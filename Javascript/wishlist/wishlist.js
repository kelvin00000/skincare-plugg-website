import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {collection, deleteDoc, setDoc, doc ,getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth, siginPopup } from "../auth.js";
import { showSavedToWishlistPopup } from "../wishlist/wishlistUI.js";
import { signUpSection, contactUsSection, imageSection } from "../Home.js";
import { trackWishlistAction } from "./trackWishlist.js";


const wishlistCounter = document.querySelectorAll(".js-wishlist-counter");

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

        showSavedToWishlistPopup();
        await trackWishlistAction(uid, productId, sectionId, 'added');

        const wishlistSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));
        wishlistCounter.forEach(counter=>{
            counter.innerHTML = wishlistSnap.docs.length;
        })
    }
    catch(err){
        console.error(err);
        //FAILURE TOAST HERE
    }
}

const wishlistNoResultsScreen = document.querySelector(".wishlist-noresults-screen");
const wishlistResultsScreen = document.querySelector(".wishlist-results-screen");
export async function fetchWishlistItemData(){
    const user = auth.currentUser;
    const uid = user.uid;
    if(!user) return[];

    try{
        const productIdSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));

        if (productIdSnap.empty){
            wishlistNoResultsScreen.style.display = 'flex';
            wishlistResultsScreen.style.display = 'none';
            wishlistCounter.forEach(counter=> {counter.innerHTML = 0})
            return [];
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
                                            <div class="buttons">
                                                <button class="remove-from-wishlist js-remove-from-wishlist" data-wishlist-item-id="${item.id}">
                                                <p class="js-remove-from-wishlist" data-wishlist-item-id="${item.id}">remove</p>
                                                </button>
                                                <button class="open-popup js-open-popup" data-section-id="${SectionId}" data-product-id="${item.id}">
                                                <p class="js-open-popup" data-section-id="${SectionId}" data-product-id="${item.id}">more info</p>
                                                </button>
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
        console.errror(err);
    }
}

export async function removeWishlistItemID(productId){
    const user = auth.currentUser;
    const uid = user.uid;

    const wishlistCard = document.querySelector(`.w-product-card[data-wishlist-item-id="${productId}"]`);

    try{
        wishlistCard.classList.add('card-slide-out');
        wishlistCard.remove();
        await deleteDoc(doc(db, 'wishlist', uid, 'products', productId));

        const wishlistSnap = await getDocs(collection(db, 'wishlist', uid, 'products'));
        wishlistCounter.forEach(counter=>{
            counter.innerHTML = wishlistSnap.docs.length;
        })
        if(wishlistSnap.docs.length===0) wishlistNoResultsScreen.style.display = 'flex';

        await trackWishlistAction(uid, productId, 'removed');
    }
    catch(err){
        console.error(err)
        // FAILURE TAOST GOES HERE
    }
}



const wishlistCounterContainer = document.querySelectorAll(".wishlist-counter-container");
const wishlistNoUserScreen = document.querySelector(".wishlist-noUser-screen");

onAuthStateChanged(auth, async user=>{
    if(user){
        const user = auth.currentUser;
        const uid = user.uid;

        wishlistCounterContainer.forEach(container=>{
            container.style.display = 'flex';
        })
        wishlistNoUserScreen.style.display = 'none';

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