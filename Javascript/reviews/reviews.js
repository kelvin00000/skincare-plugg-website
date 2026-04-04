import {collection, setDoc, addDoc, deleteDoc, runTransaction, doc ,getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth, user } from "../auth.js";
import { showErrorPopup } from "../general.js";


function showReviewSectionLoader(){
    const reviewsContainer = document.querySelector(".review-cards-container");
    reviewsContainer.style.display = "block";
    reviewsContainer.innerHTML=
    `
    <div class="skeleton-loading-screen">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
    </div>
    `;
}
/////////////////////////REVIEW PUBLISH FUNCTION/////////////////////////
export async function publishReview(sectionId, productId, message){
    if (!user) {
        showErrorPopup({errorMsg:'Sign Up before you can perform this action', classList:'open-sign-up-window-btn'});
        return;
    }

    showReviewSectionLoader()
    try{
        const reviewDocData = {
            sectionId
        };
        await setDoc(doc(db, "reviews", productId), reviewDocData);
    }
    catch(err){
        console.error(err);
    }

    try {
        const reviewData = {
            userId: user.uid,
            userEmail: user.email, 
            userName: user.displayName,
            userImage: user.photoURL,
            userContact: user.phoneNumber,
            message,
            likesCount: 0,
            productId,
            timestamp: Date.now()
        };

        const reviewRef = collection(db, 'reviews', productId, 'reviews');
        await addDoc(reviewRef, reviewData);

        await fetchReviewData(productId);
    } 
    catch (err) {
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}

/////////////////////////REVIEW DATA FETCH FUNCTION/////////////////////////
export async function fetchReviewData(productId){
    showReviewSectionLoader();
    const reviewsContainer = document.querySelector(".review-cards-container");
    const noReviewsMessage = document.querySelector(".review-noResults-message");

    try{
        const snap = await getDocs(collection(db, 'reviews', productId, 'reviews'));
        if (snap.empty){
            reviewsContainer.style.display = "none";
            noReviewsMessage.style.display = "flex";
            return;
        }
        noReviewsMessage.style.display = "none";
        reviewsContainer.style.display = "block";

        reviewsContainer.innerHTML="";
        let html="";
        snap.forEach(docSnap => {
            const review = docSnap.data();
            const reviewId = docSnap.id;
            html +=  renderReviewUI(productId, reviewId, review)
        });
        reviewsContainer.insertAdjacentHTML("beforeend", html);
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}



/////////////////////////RENDER REVIEW UI FUNCTION/////////////////////////
function renderReviewUI(productId, reviewId, review){
    const canDelete = review.userId === auth.currentUser?.uid;

    return  `
            <div class="review-card" data-product-id="${productId}" data-review-id="${reviewId}">
                <div class="user-image">
                    <img src="${review.userImage}">
                </div> 
                <div class="review">
                    <span class="user-name">
                        ${review.userName}
                    </span>  
                    <span class="user-message">
                        ${review.message}
                    </span>

                    ${canDelete ? `<button class="delete-review js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">
                        <p class="js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">Remove</p>
                    </button>`: ""}
                </div>
                <div class="review-like-button">
                    <button class="liked-review" data-product-id="${productId}" data-review-id="${reviewId}">
                        <svg class="liked-review" data-product-id="${productId}" data-review-id="${reviewId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                    </button>
                    <span class="js-liked-review-counter" data-review-id="${reviewId}">
                        ${review.likesCount}
                    </span>
                </div>                       
            </div>
        `;
}



//////////////////////REVIEW CARD EVENT LISTENERS//////////////
document.addEventListener("click", element => {
    // LIKE BUTTON
    if (element.target.classList.contains("liked-review")) {
        if (!user) {
            showErrorPopup({errorMsg:'Sign Up before you can perform this action', classList:'open-sign-up-window-btn'});
            return;
        }

        const reviewId = element.target.dataset.reviewId;
        const productId = element.target.dataset.productId;
        reactToReview(productId, reviewId);
    }
    // DELETE BUTTON
    if (element.target.classList.contains('js-delete-review')) {
        showReviewSectionLoader();
        const reviewId = element.target.dataset.reviewId;
        const productId = element.target.dataset.productId;
    
        deleteReview(productId, reviewId);
    }
});

// REACTION FUNCTION
let isReacting = false;
async function reactToReview(productId, reviewId) {
    if (!user || isReacting) return;
    
    isReacting = true;
    
    try {
        const reactionRef = doc(db, 'reviewReactions', reviewId, 'reactions', user.uid);
        const reviewRef = doc(db, 'reviews', productId, 'reviews', reviewId);

        let newLikesCount;

        await runTransaction(db, async (transaction) => {
            const reviewSnap = await transaction.get(reviewRef);
            const reactionSnap = await transaction.get(reactionRef);
            
            if (!reviewSnap.exists()) return;

            const review = reviewSnap.data();
            let likesCount = review.likesCount || 0;
            const hasLiked = reactionSnap.exists();

            if (hasLiked) {
                transaction.delete(reactionRef);
                likesCount = Math.max(0, likesCount - 1);
            } else {
                transaction.set(reactionRef, { liked: true, timestamp: Date.now() });
                likesCount += 1;
            }

            newLikesCount = likesCount;
            transaction.update(reviewRef, { likesCount });
        });

        const likeCountContainer = document.querySelector(`.js-liked-review-counter[data-review-id="${reviewId}"]`);
        likeCountContainer.innerHTML = newLikesCount;

    } finally {
        isReacting = false;
    }
}
// DELETE FUNCTION
export async function deleteReview(productId, reviewId){
    try{
        await deleteDoc(doc(db, 'reviews', productId, 'reviews', reviewId));
        await fetchReviewData(productId);
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}