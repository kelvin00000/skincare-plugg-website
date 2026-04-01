import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { user, db, removeAccount} from "./auth.js";
import { signUpWithGoogle } from "./auth.js"
import { showErrorPopup } from "./general.js";

export function showSignUpWindowUI(){
    document.getElementById("js-window-container").innerHTML=
    `
        <div class="sign-up-window">
            <button class="close-button js-close-button">
                <svg class="js-close-button" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>

            <div class="content" id="js-auth-content"></div>
        </div>
    `
}
export function showSignUpForm(){
    document.getElementById("js-auth-content").innerHTML=
    `
        <div class="form-container">
            <div class="message">
                <p>We're happy Your're Here</p>
                <p>Enter Your Phone Number And Click Continue</p>
            </div>
            <div class="form">
                <input class="user-contact-input" type="tel" id="email" placeholder="Phone Number" maxlength="10" required>
                <div>
                    <svg class="googleBtnsvg" width="20px" height="20px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        
                            <title>Google-color</title>
                            <desc>Created with Sketch.</desc>
                            <defs>
                        </defs>
                            <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                    <g id="Google" transform="translate(401.000000, 860.000000)">
                                        <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05">

                        </path>
                                        <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335">

                        </path>
                                        <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853">

                        </path>
                                        <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4">

                        </path>
                                    </g>
                                </g>
                            </g>
                    </svg>
                    Authentication by Google
                </div>
            </div>
            <button class="sign-up-btn">Continue</button>
        </div>
    `
}
// TODO CHANGE THE PRODUCT INTEREST TO MOST PURCHSED AFTER ECOMMERCE BUILD
export async function showAccountManagementUI(){
    showSignUpWindowLoader();
    let userInfo, userActivity, productData , productsViewed;

    try{
        // const user = auth.currentUser;
        const uid = user.uid;
        const userSnap = await getDoc(doc(db, 'users', uid));
        userInfo = userSnap.data();

        const userActivitySnap = await getDoc(doc(db, 'analytics', 'userActivity', 'users', uid));
        userActivity = userActivitySnap.data();
        if(userActivity){
            productsViewed = Object.keys(userActivity.viewedProducts).length;

            const mostViewed = Object.entries(userActivity.viewedProducts).sort((a, b) => b[1].count - a[1].count)[0];
            if (mostViewed) {
                const [productId, data] = mostViewed;
                const sectionId = data.sectionId;
                
                const productDoc = await getDoc(doc(db, 'products', sectionId, 'items', productId));
                productData = productDoc.data();
            }
        }
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }

    showSignUpWindowUI();
    document.getElementById("js-auth-content").innerHTML=
    `
        <div class="account-management">
            <p>Your Account</p>
            
            <div class="profile">
                <img src="${userInfo.profileImage}">
                <span>${userInfo.email}</span>
            </div>
            
            <div class="activity">
                <div class="user-product-stats">
                    <div class="stat">
                        <span>${productsViewed||0}</span>
                        Products Viewed
                    </div>
                    <div class="stat">
                        <span>${userActivity?`${userActivity.recentPurchases? userActivity.recentPurchases.length:0}`:0}</span>
                        Products Purchased
                    </div>
                    <div class="stat">
                        <span>${userActivity?userActivity.recentSearches?.length:0}</span>
                        Products Searched
                    </div>
                </div>
                <div class="product-interest-info">
                    <span>General Product Interest</span>
                    <span>${productData?productData.name:`---`}</span>
                </div>
                <button class="see-recommendations-btn">View Reccomended for You</button>
            </div>

            <button class="remove-account-btn">Remove Account</button>
        </div>
    `

    document.addEventListener('click', e=>{
        if(e.target.classList.contains("see-recommendations-btn")){
            showErrorPopup({errorMsg:'Coming soon'})
        }
    })
    document.addEventListener('click', async e=>{
        if(e.target.classList.contains("remove-account-btn")){
            showSignUpWindowLoader();
            await removeAccount();
        }
    })
}
function showSignUpWindowLoader(){
    document.getElementById("js-window-container").innerHTML=
    `
        <div class="sign-up-window-skeleton-loader">  
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-circle"></div>
            <div class="skeleton skeleton-box"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
    `
}
export function showInputError(classList){
    const inputBox = document.querySelector(`.${classList}`)
    inputBox.focus();
    inputBox.style.borderColor='#FC6767';
    inputBox.value = 'Invalid Input';
    inputBox.style.color='#FC6767';

    inputBox.addEventListener('click', ()=>{
        inputBox.style.borderColor='';
        inputBox.value = '';
        inputBox.style.color='';
    })
}


// EVENT LISTENERS
const windowContainer = document.getElementById("js-window-container");
document.addEventListener('click', async e=>{
    if(e.target.classList.contains("open-sign-up-window-btn")){
        // CLOSES THE ERROR POPUP TOGGLED BY UNSIGNED USERS
        const popup = document.querySelector(".error-popup")
        if(popup){
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }

        windowContainer.classList.remove('close');
        windowContainer.classList.add('show');
        document.body.style.overflow = 'hidden';

        showSignUpWindowLoader();
        showSignUpWindowUI();

        if (!user){
            showSignUpForm();
            return;
        };
        await showAccountManagementUI();
    }
})
document.addEventListener('click', async e=>{
    if(e.target.classList.contains("sign-up-btn")){
        const contactValue_ = document.querySelector(".user-contact-input").value;
        const contactValue = Number(contactValue_)

        if(!contactValue||typeof(contactValue)!=="number"){
            showInputError('user-contact-input');
            return;
        }

        showSignUpWindowLoader();
        await signUpWithGoogle(contactValue);
    }
})