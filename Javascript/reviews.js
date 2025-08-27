import { ref, set, push, get, onValue, off, remove, runTransaction } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db, auth, siginPopup } from "../Javascript/Forms.js";
import { signUpSection, contactUsSection, imageSection } from "../Javascript/Home.js";
import { reviewFailureResponse, reviewSuccessResponse } from "../Javascript/Products.js";


/////////////////////////REVIEW PUBLISH FUNCTION/////////////////////////
export async function publishReview(productId, message){
    const user = auth.currentUser;
    if (!user) {
        if(window.innerWidth < 1001){
            contactUsSection.classList.add('hide-left');
            signUpSection.classList.remove('hide-right');
        }
        imageSection.classList.remove('slide-right');
        imageSection.classList.add('slide-left');

        siginPopup.classList.remove('signin-hide');
        siginPopup.classList.add('signin-show');
        alert("Sign up to leave a review");
        return;
    }
    if(!message){
        reviewFailureResponse();
        return;
    }

    const reviewRef = push(ref(db, `reviews/${productId}`));
    await set(reviewRef, {
        userId: user.uid,
        username: user.displayName || user.email,
        userImage: user.photoURL,
        message,
        likesCount: 0,
        timestamp: Date.now()
    })
    .then(()=> {
        message = ""
        reviewSuccessResponse();
    })
    .catch(error=> {
        message = ""
        reviewFailureResponse();
        console.error(error);
    })
}

/////////////////////////REVIEW DATA FETCH FUNCTION/////////////////////////
let activeReviewRef = null;
export function fetchReviewData(productId){
    const popupReviewscontainer = document.querySelector(".Popup-review-cards-container");
    const noReviewsScreen = document.querySelector(".Popup-review-noResults-screen");

    if (activeReviewRef) off(activeReviewRef); 
    const reviewRef = ref(db, `reviews/${productId}`);
    activeReviewRef = reviewRef;

    onValue(reviewRef, (snapshot) => {
        popupReviewscontainer.innerHTML = "";

        if (!snapshot.exists()) {
            popupReviewscontainer.style.display = "none";
            noReviewsScreen.style.display = "flex";
            return;
        }
        popupReviewscontainer.style.display = "block";
        noReviewsScreen.style.display = "none";

        const reviews = snapshot.val();
        let reviewCardhtml = "";
        for (let reviewId in reviews) {
            const review = reviews[reviewId];
            reviewCardhtml += renderReviewUI(productId, reviewId, review);
        }
        popupReviewscontainer.innerHTML = reviewCardhtml;
        attachReviewActions(productId)
    });
}

/////////////////////////REVIEW DELETE FUNCTION/////////////////////////
export async function deleteReview(productId, reviewId){
    await remove(ref(db, `reviews/${productId}/${reviewId}`));
}


///////////////////////REACTION BUTTONS FUNCTIONS/////////////////////
async function reactToReview(productId, reviewId, reaction) {
    const user = auth.currentUser;
    if (!user) return;

    const reactionRef = ref(db, `reviewReactions/${reviewId}/${user.uid}`);
    const reviewRef   = ref(db, `reviews/${productId}/${reviewId}`);

    const prevSnap = await get(reactionRef);
    const prev = prevSnap.exists();

    if (prev) {
        await remove(reactionRef);
    } else {
        await set(reactionRef, true);
    }

    await runTransaction(reviewRef, (review) => {
        if (review == null) return review;

        review.likesCount = review.likesCount || 0;

        if (prev) {
            review.likesCount = Math.max(0, review.likesCount - 1);
        } else {
            review.likesCount += 1;
        }

        return review;
    });
}






/////////////////////////RENDER REVIEW UI FUNCTION/////////////////////////
function renderReviewUI(productId, reviewId, review){
    const canDelete = review.userId === auth.currentUser?.uid;

    return  `
            <div class="Popup-review-card">
                <div class="user-image">
                    ${review.userImage
                        ?` <img src="${review.userImage}" alt="profile-photo" class="user-profile-photo">` 
                        : ` <svg class="user-profile-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="none">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="10%" stop-color="#4f5bd5" />
                            <stop offset="20%" stop-color="#962fbf" />
                            <stop offset="70%" stop-color="#d055e7" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#gradient)" d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                    </svg>
                    `
                    }
                </div> 
                <div class="review">
                    <div class="user-info">
                        <p class="user-name js-user-name">${review.username}</p>
                    </div>  
                    <div class="user-message-container">
                        <p class="user-message js-user-message">${review.message}</p>
                    </div>
                    <div class="review-reaction-buttons">
                        <div class="liked-review-container">
                            <button>
                                <svg class="liked-review" data-product-id="${productId}" data-review-id="${reviewId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                            </button>
                            <p class="js-liked-review-counter">${review.likesCount}</p>
                        </div>
                        ${canDelete ? `<button class="delete-review js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">
                        <p class="js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">Remove</p>
                        </button>`: ""}
                    </div>
                </div>                            
            </div>
        `;
    attachReviewActions(productId)
}



//////////////////////REVIEW CARD BUTTON EVENT LISTENERS//////////////
function attachReviewActions(productId) {
    const popupReviewscontainer = document.querySelector(".Popup-review-cards-container");

    popupReviewscontainer.addEventListener("click", element => {
        // DELETE BUTTON
        if (element.target.classList.contains('js-delete-review')) {
            const reviewId = element.target.dataset.reviewId;
            const productId = element.target.dataset.productId;
            deleteReview(productId, reviewId);
        }
        // LIKE BUTTON
        if (element.target.classList.contains("liked-review")) {
            const reviewId = element.target.dataset.reviewId;
            const productId = element.target.dataset.productId;
            reactToReview(productId, reviewId, "like");
        }
        // DISLIKE BUTTON
        if (element.target.classList.contains("disliked-review")) {
            const reviewId = element.target.dataset.reviewId;
            const productId = element.target.dataset.productId;
            reactToReview(productId, reviewId, "dislike");
        }
    });
}
