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
            userName: user.displayName || user.email,
            userImage: user.photoURL,
            // userContact, pass this after sign in logic is remodeled
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
                    ${review.userImage
                        ?` <img src="${review.userImage}">` 
                        : ` <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#212121">
                            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/>
                        </svg>
                        `
                    }
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