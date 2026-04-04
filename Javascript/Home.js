import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/auth.js";
import { showErrorPopup } from "./general.js";


//// NAVBAR BACKGROUND TOGGLE
const navdivisions = document.querySelectorAll(".nav-divisions")
const navSearchBars = document.querySelectorAll(".search")
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navdivisions.forEach(division=>division.classList.add('navbar-custom-background'));
        navSearchBars.forEach(navBar=>navBar.classList.remove('navbar-custom-background'));
    } else {
        navdivisions.forEach(division=>division.classList.remove('navbar-custom-background'));
        navSearchBars.forEach(navBar=>navBar.classList.add('navbar-custom-background'));
    }
});
// NAVBAR EXPANSION TOGGLE
document.getElementById("navbar-expand-btn").addEventListener('click', ()=>{
    document.getElementById("js-nav-expansion").classList.add("show");
    document.getElementById("js-nav-expansion").classList.add("expand");
})
document.getElementById("navbar-retract-btn").addEventListener('click', ()=>{
    document.getElementById("js-nav-expansion").classList.remove("expand");
    document.getElementById("js-nav-expansion").classList.remove("show");
})



//// SHOWCASE SECTION ANIMATION
gsap.registerPlugin(ScrollTrigger);
// PRODUCT 1
const tl1 = gsap.timeline({
    scrollTrigger: {
        trigger: '.product-showcase-1',
        start: 'top top',
        end: '+=400%',
        scrub: 1,
        pin: true,
        pinSpacing: true
    }
});
tl1.from('.product-image-1', { x: -100, opacity: 0, duration: 1 });
tl1.from('.product-description-1', { x: 100, opacity: 0, duration: 1 }, '<');
// TEXT FILL EFFECT
const lines1 = gsap.utils.toArray('.product-description-1 .line');
lines1.forEach((line, i) => {
    tl1.fromTo(line, {
        backgroundSize: '0% 100%'
    }, {
        backgroundSize: '100% 100%',
        duration: 0.8
    });
});
tl1.from('.product-section-link-1', { y: 30, opacity: 0, duration: 0.8 });
// FADE OUT
// tl1.to('.product-showcase-1 > *', { 
//     opacity: 0, 
//     duration: .5,
// }, '+=0.5');

// PRODUCT 2
const tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: '.product-showcase-2',
        start: 'top top',
        end: '+=450%',
        scrub: 1,
        pin: true,
        pinSpacing: true
    }
});
tl2.from('.product-image-2', { x: 100, opacity: 0, duration: 1 });
tl2.from('.product-description-2', { x: -100, opacity: 0, duration: 1 }, '<');
// TEXT FILL EFFECT
const lines2 = gsap.utils.toArray('.product-description-2 .line');
lines2.forEach((line, i) => {
    tl2.fromTo(line, {
        backgroundSize: '0% 100%'
    }, {
        backgroundSize: '100% 100%',
        duration: 0.8
    });
});
tl2.from('.product-section-link-2', { y: 30, opacity: 0, duration: 0.8 });
// FADE OUT
// tl2.to('.product-showcase-2 > *', { 
//     opacity: 0, 
//     duration: 1 
// }, '+=0.5');




//// PACKAGE SECTION
// HOMEPAGE DISPLAY
const packageOfferSection = document.getElementById("package-offer-section");
const packagesContainer = document.getElementById("packages-container");
const windowContainer = document.getElementById("js-window-container");
async function displayPackageSection(){
    try{
        const snap = await getDocs(collection(db, 'packages'));
        
        packagesContainer.innerHTML='';
        snap.forEach(doc=>{
            const package_ = doc.data();
            const packageId = doc.id;

            packagesContainer.innerHTML+=
            `
                <div class="swiper-slide package">
                    <h2 class="heading">${package_.packageName}</h2>
                    <div class="content" style="background-image: url(${package_.imageUrl});">
                        <div class="package-description">
                        ${package_.packageDescription}</div>
                        <button class="js-open-package-window" data-package-id="${packageId}">Get Started</button>
                    </div>
                </div>
            `
        })

        if(snap.empty) packageOfferSection.style.display='none';
    }
    catch(err){
        console.error(err);
    }

    // SLIDER
    if(document.querySelector(".packages-swiper")){
        const swiper = new Swiper('.packages-swiper', {
            // AUTOPLAY SETTINGS
            autoplay: {
                delay: 5000, // TIME BETWEEN SLIDES
                pauseOnMouseEnter: true, // PAUSE ON HOVER
                disableOnInteraction: false // CONTNUE AFTER MANUAL SWIPE
            },
            // ANIMATION SPEED
            speed: 800, // TRANSITION DURATION
            // PAGINATION
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            // EFFECTS
            effect: 'slide', // 'slide', 'fade', 'cube', 'coverflow', 'flip', 'cards'
            // DIRECTION
            direction: 'horizontal',
            // LOOP
            loop: true,
            // SLIDES PER VIEW
            slidesPerView: 1,
            // SPACE BETWEEN SLIDES
            spaceBetween: 30,
            // ENABLE SWIPE ON DESKTOP
            simulateTouch: true,
            // DISABLE IF ONLY 1 SLIDE
            watchOverflow: true,
            // KEYBOARD CONTROL
            keyboard: {
                enabled: true
            }
        });
    }
}
await displayPackageSection()
// WINDOW DISPLAY
async function displayPackageWindow(packageId){
    try{
        const packageSnap = await getDoc(doc(db, 'packages', packageId));
        const package_ = packageSnap.data();

        windowContainer.innerHTML=
        `
            <div class="package-window">
                <button class="close-button js-close-button">
                    <svg class="js-close-button" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                </button>
                <div class="header">
                    <span>${package_.packageName}</span>
                    <span>This package includes the following products</span>
                </div>
                <div class="grid" id="js-package-products-container"></div>
                <button class="package-checkout-btn" data-package-id="${packageId}">Proceed to Checkout</button>
            </div>
        `
        await displayPackageProducts(package_.finalProducts);
    }
    catch(err){
        console.error(err);
    }

    // RETURN TO PACKAGE WINDOW FROM INFO WINDOW
    document.addEventListener('click', element => {
        if (element.target.classList.contains('js-package-window-return-set-btn')) {
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelectorAll('.js-close-info-window');
                if (element) {
                    element.forEach(el=>el.classList.remove('js-close-button'))
                    element.forEach(el=>{
                        el.classList.add('js-open-package-window');
                        el.dataset.packageId = packageId;
                    })
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });
}
async function displayPackageProducts(arr){
    document.getElementById("js-package-products-container").innerHTML='';
    try{
        arr.forEach(async product=>{
            const productSnap = await getDoc(doc(db, 'products', product.sectionId, 'items', product.productId));
            const product_ = productSnap.data();
            document.getElementById("js-package-products-container").innerHTML+=
            `
                <div class="product-card">
                    <div class="left">
                        <img src="${product_.image}" alt="image of ${product_.name}">
                    </div>
                    <div class="right">
                        <p class="product-name">${product_.name}</p>
                        <p class="price">GHC <span>${product_.price}</span></p>
                        <div class="ctas">
                            <button class="open-product-info-window-btn js-open-product-info-window-btn js-package-window-return-set-btn" data-section-id="${product.sectionId}" data-product-id="${product.productId}">
                                <span class="js-open-product-info-window-btn js-package-window-return-set-btn" data-section-id="${product.sectionId}" data-product-id="${product.productId}">More Info</span>
                                <svg class="js-open-product-info-window-btn js-package-window-return-set-btn" data-section-id="${product.sectionId}" data-product-id="${product.productId}" xmlns="http://www.w3.org/2000/svg" height="19px" viewBox="0 -960 960 960" width="19px" fill="#e3e3e3">
                                    <path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `
        })
    }
    catch(err){
        console.error(err);
    }
}
function showPackageWindowLoader(){
    windowContainer.innerHTML=
    `
        <div class="package-skeleton-loading-screen">
            <div class="header">
                <div class="skeleton skeleton-title"></div>
            </div>
            <div class="bottom">
                <div class="skeleton skeleton-box"></div>
                <div class="skeleton skeleton-box"></div>
                <div class="skeleton skeleton-box"></div>
            </div>
        </div>
    `
}
document.addEventListener('click',async e=>{
    if(e.target.classList.contains("js-open-package-window")){
        windowContainer.classList.remove('close');
        windowContainer.classList.add('show');
        document.body.style.overflow = 'hidden';
        showPackageWindowLoader();

        const packageId = e.target.dataset.packageId;
        await displayPackageWindow(packageId);
    }
})


// CAROUSEL SLIDER
const track = document.getElementById('sliderTrack');
const originalContent = track.innerHTML;
track.innerHTML = originalContent + originalContent;



//// SEARCH REDIRECT
const searchContainer = document.querySelectorAll(".search-container");
searchContainer.forEach(container => {
    const searchBtn = container.querySelector(".search-btn");
    const search = container.querySelector(".search");

    if (!search || !searchBtn) return;

    searchBtn.addEventListener("click", () => {
        const query = search.value.trim().toLowerCase();
        searchRedirect(query)
    });

    search.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = search.value.trim().toLowerCase();
            searchRedirect(query)
        }
    });
});
function searchRedirect(query){
    if(!query) return;
    window.location.href = `../SearchResults.html?query=${encodeURIComponent(query)}`;
}



//// FAQS ACCORDIAN
async function fetchAndDisplayFaqs(){
    let allFaqs = [];
    try{
        const snap = await getDocs(collection(db, 'faqs'));
        snap.forEach(doc=>{
            const faq = doc.data();
            allFaqs.push(faq)
        });

        const shuffledFaqs = shuffleArray(allFaqs);
        const selectedFaqs = shuffledFaqs.slice(0, 5);

        selectedFaqs.forEach((faq, index) => {
            const q = document.getElementById(`q${index + 1}`);
            const a = document.getElementById(`a${index + 1}`);

            if (q && a) {
                q.innerHTML = `${faq.question} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>` ;
                a.textContent = faq.answer;
            }
        });
    }
    catch(err){
        console.error(err);
        showErrorPopup('Please check your Internet connection and try again');
    }
}
await fetchAndDisplayFaqs();
function shuffleArray(array){
    return array
    .map(value => ({value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}