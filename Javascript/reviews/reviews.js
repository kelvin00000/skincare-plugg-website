import {collection, setDoc, addDoc, deleteDoc, runTransaction, doc ,getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth, siginPopup } from "../auth.js";
import { signUpSection, contactUsSection, imageSection } from "../Home.js";


/////////////////////////REVIEW PUBLISH FUNCTION/////////////////////////
export async function publishReview(sectionId, productId, message){
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

    try{
        const reviewDocData = {
            sectionId
        };
        await setDoc(doc(db, "reviews", productId), reviewDocData);
    }
    catch(err){
        console.error(err);
        // SHOW FAILURE TOAST
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

        //TODO
        // REPLACE THIS BELOW WITH LOADING SCREEN WHEN REDESIGNING UI
        document.querySelector(".Popup-review-cards-container").innerHTML='';
        
        await fetchReviewData(productId);
    } 
    catch (err) {
        console.error(err);

        //FAILURE TOAST HERE
        setTimeout(()=>{

        }, 5000);
    }
}

/////////////////////////REVIEW DATA FETCH FUNCTION/////////////////////////
export async function fetchReviewData(productId){
    const popupReviewscontainer = document.querySelector(".Popup-review-cards-container");
    const noReviewsScreen = document.querySelector(".Popup-review-noResults-screen");

    const snap = await getDocs(collection(db, 'reviews', productId, 'reviews'));
    if (snap.empty){
        popupReviewscontainer.style.display = "none";
        noReviewsScreen.style.display = "flex";
        return;
    }
    noReviewsScreen.style.display = "none";
    popupReviewscontainer.style.display = "block";

    let html="";
    snap.forEach(docSnap => {
        const review = docSnap.data();
        const reviewId = docSnap.id;
        html +=  renderReviewUI(productId, reviewId, review)
    });
    popupReviewscontainer.insertAdjacentHTML("beforeend", html);
}



/////////////////////////RENDER REVIEW UI FUNCTION/////////////////////////
function renderReviewUI(productId, reviewId, review){
    const canDelete = review.userId === auth.currentUser?.uid;

    return  `
            <div class="Popup-review-card" data-product-id="${productId}" data-review-id="${reviewId}">
                <div class="user-image">
                    ${review.userImage
                        ?` <img src="${review.userImage}" alt="profile-photo" class="user-profile-photo">` 
                        : ` <svg class="user-profile-icon" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#212121">
                            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/>
                        </svg>
                        `
                    }
                </div> 
                <div class="review">
                    <div class="user-info">
                        <p class="user-name js-user-name">${review.userName}</p>
                    </div>  
                    <div class="user-message-container">
                        <p class="user-message js-user-message">${review.message}</p>
                    </div>
                    <div class="review-reaction-buttons">
                        <div class="liked-review-container">
                            <button>
                                <svg class="liked-review" data-product-id="${productId}" data-review-id="${reviewId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                            </button>
                            <p class="js-liked-review-counter" data-review-id="${reviewId}">${review.likesCount}</p>
                        </div>
                        ${canDelete ? `<button class="delete-review js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">
                        <p class="js-delete-review" data-product-id="${productId}" data-review-id="${reviewId}">Remove</p>
                        </button>`: ""}
                    </div>
                </div>                            
            </div>
        `;
}



//////////////////////REVIEW CARD EVENT LISTENERS//////////////
document.addEventListener("click", element => {
    // LIKE BUTTON
    if (element.target.classList.contains("liked-review")) {
        const reviewId = element.target.dataset.reviewId;
        const productId = element.target.dataset.productId;
        reactToReview(productId, reviewId);
    }
    // DELETE BUTTON
    if (element.target.classList.contains('js-delete-review')) {
        const reviewId = element.target.dataset.reviewId;
        const productId = element.target.dataset.productId;
        const reviewCard = document.querySelector(`.Popup-review-card[data-review-id="${element.target.dataset.reviewId}"]`);
        deleteReview(productId, reviewId, reviewCard);
    }
});

// REACTION FUNCTION
let isReacting = false;
async function reactToReview(productId, reviewId) {
    const user = auth.currentUser;
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
export async function deleteReview(productId, reviewId, reviewCard){
    reviewCard.classList.add('review-card-slide-out')
    await deleteDoc(doc(db, 'reviews', productId, 'reviews', reviewId));
    reviewCard.remove();

    await fetchReviewData(productId);
}