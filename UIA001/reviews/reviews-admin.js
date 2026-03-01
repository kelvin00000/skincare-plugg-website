import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, doc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/Forms.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const adminReviewsMainScreen = document.getElementById("js-reviews-main-screen");
const productReviewsScreen = document.getElementById("js-product-reviews-screen");

//// POPUPS
const confirmDeletePopup = document.getElementById("js-confirm-delete-popup-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");
const popupScreen = document.getElementById("js-black-screen");

const failToast = document.getElementById("js-fail-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');


async function fetchAndDisplayAllReviews(){
    try{
        const reviewDocs = await getDocs(collection(db, 'reviews'));

        adminReviewsMainScreen.innerHTML='';
        reviewDocs.forEach(async reviewDoc=>{
            const productId = reviewDoc.id;
            const sectionId = reviewDoc.data().sectionId;

            const productSnap = await getDoc(doc(db, 'products', sectionId, 'items', productId));
            const product = productSnap.data();
            
            adminReviewsMainScreen.innerHTML+=
                `
                    <div class="product-card open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">
                        <div class="left open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">
                            <img src="${product.image}" class="open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">
                        </div>
                        <div class="right open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">
                            <div class="product-name open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">${product.name}</div>
                            <div class="review-dummy-txt open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">
                                <span class="open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">Reviews</span>
                                <span class="open-product-reviews" data-section-id="${sectionId}" data-product-id="${productId}">Click to open reviews for this product...</span>
                            </div>
                        </div>
                    </div>
                `

            if(adminReviewsMainScreen.innerHTML===''){
                adminReviewsMainScreen.innerHTML='No Results'
            }
        })
        
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    }
    catch(err){
        console.error(err);

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast')
        }, 5000);
    }
}

const reviewsContainer = document.getElementById("js-product-reviews-container")
async function fetchProductReviews(sectionId, productId){
    try{
        const productSnap = await getDoc(doc(db, 'products', sectionId, 'items', productId));
        document.getElementById("js-product-name").innerHTML = productSnap.data().name;
    }
    catch(err){
        console.error(err);
    }

    try{
        const snap = await getDocs(collection(db, 'reviews', productId, 'reviews'));

        reviewsContainer.innerHTML='';
        snap.forEach(doc=>{
            const review = doc.data();
            const reviewId = doc.id;
            reviewsContainer.innerHTML+=
            `
                <div class="review-card">
                    <div class="top">
                        <div class="user-image-container">
                            ${review.userImage? `<img src="${review.userImage}">`
                                : `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="30px" fill="#121212">
                                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/>
                            </svg>`
                            }
                        </div>
                        <div class="user-email-container">${review.userEmail}</div>
                        <button class="js-email-btn" data-user-email="${review.userEmail}">
                            <svg class="js-email-btn" data-user-email="${review.userEmail}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="mid">
                        <div class="mid-top-row">
                            <div class="username-container">username: <span>${review.userName}</span></div>
                            <div class="likes-conatiner">likes: <span>${review.likesCount}</span></div>
                        </div>

                        <div class="mid-bottom-row">
                            <div class="usercontact-conatiner">contact: <span>-----</span></div>
                            <button id="js-open-user-whatsapp-chat">
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="#e3e3e3" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99622 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07046 10.5335 4.06776 11.9246C4.06507 13.3158 4.42793 14.6832 5.12 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9001 16.124 19.0668 17.6222 17.5816C19.1205 16.0965 19.9715 14.0796 19.99 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37368C13.9853 5.4597 15.511 6.13441 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6006C15.441 17.8366 13.756 18.5301 12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.58 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.69817 8.26061 8.96191 8.14676 9.25343C8.03291 9.54495 7.98287 9.85749 8 10.17C8.0627 10.9181 8.34443 11.6311 8.81 12.22C9.6622 13.4958 10.8301 14.5293 12.2 15.22C12.9185 15.6394 13.7535 15.8148 14.58 15.72C14.8552 15.6654 15.1159 15.5535 15.345 15.3915C15.5742 15.2296 15.7667 15.0212 15.91 14.78C16.0428 14.4856 16.0846 14.1583 16.03 13.84C15.94 13.74 15.81 13.69 15.61 13.59Z" fill="#000000"/>
                                    </svg>
                                WhatsApp
                            </button>
                        </div>
                    </div>

                    <div class="message-container">${review.message}</div>

                    <div class="bottom">
                        <button id="js-confirm-review-delete" data-section-id="${sectionId}" data-product-id="${productId}" data-review-id="${reviewId}">
                            delete 
                            <svg class="js-confirm-review-delete" data-section-id="${sectionId}" data-product-id="${productId}" data-review-id="${reviewId}"
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `
        })

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    }
    catch(err){
        console.error(err);

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast')
        }, 5000);
    }
}
document.addEventListener('click', element => {
    if (element.target.classList.contains('open-product-reviews')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');

        productReviewsScreen.classList.add('screen-show')
        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;

        fetchProductReviews(sectionId, productId);
    }
});
document.getElementById("js-close-product-reviews-screen-btn").addEventListener('click', ()=>{
    productReviewsScreen.classList.remove('screen-show')
})

// EMAIL COMPOSE FUNCTION
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-email-btn')) {
        const userEmail = element.target.dataset.userEmail;
        if (window.innerWidth < 750) {
            window.location.href = `mailto:${userEmail}`;
        } else {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}`, '_blank');
        }
    }
});



//// CONFIRM DELETE POPUP
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-confirm-review-delete')) {
        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;
        const reviewId = element.target.dataset.reviewId;

        popupScreen.classList.add('show-loader');
        confirmDeletePopup.classList.add('screen-show');
        confirmDeletePopup.innerHTML=
        `
            <div class="padding">
                Are You sure You want to delete this?
                <div class="ctas">
                    <button class="js-close-confirmdelete-popup-btn">
                        No, Exit
                    </button>
                    <button class="js-delete-review-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-review-id="${reviewId}"
                    >
                        Continue
                        <svg class="js-delete-review-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-review-id="${reviewId}"
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `
    }
});
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-close-confirmdelete-popup-btn')) {
        popupScreen.classList.remove('show-loader');
        confirmDeletePopup.classList.remove('screen-show');
    }
});
//// DELETE FUNCTION
document.addEventListener('click', async element => {
    if (element.target.classList.contains('js-delete-review-btn')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');

        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;
        const reviewId = element.target.dataset.reviewId;

        try{
            await deleteDoc(doc(db, 'reviews', productId, 'reviews', reviewId));
            const snap = await getDocs(collection(db, 'reviews', productId, 'reviews'));

            if(snap.empty){
                await deleteDoc(doc(db, 'reviews', productId));
                productReviewsScreen.classList.remove('screen-show');
                await fetchAndDisplayAllReviews()
            }
            else await fetchProductReviews(sectionId, productId);

            popupScreen.classList.remove('show-loader');
            confirmDeletePopup.classList.remove('screen-show');

            loader.classList.remove('show-loader');
            loadingScreen.classList.remove('show-loader');
        }
        catch(err){
            console.error(err);

            loader.classList.remove('show-loader');
            loadingScreen.classList.remove('show-loader');

            failToast.classList.add('show-toast');
            setTimeout(()=>{
                failToast.classList.remove('show-toast')
            }, 5000);
        }
    }
});


onAuthStateChanged(auth, async (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminHeader.style.display = "flex";
        adminReviewsMainScreen.style.display = "grid";
        await fetchAndDisplayAllReviews();
    } 
    else {
        adminHeader.style.display = "none";
        adminReviewsMainScreen.style.display = "block";
        window.location.href = `../index.html`
    }
});