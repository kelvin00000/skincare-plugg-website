import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, getDocs, limit, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/auth.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const allDashContainer = document.getElementById("js-dash-conatainer");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");

const failToast = document.getElementById("js-fail-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');


const trendingProductsDash = document.getElementById("js-trending-products-dash");
async function loadTrendingProducts(){
    try{
        const snap = await getDocs(collection(db, 'analytics', 'productStats', 'items'));
        
        const allProducts = snap.docs.map(doc => {
            const data = doc.data();
            const totalEngagement = (data.viewCount || 0) + (data.wishlistCount || 0) + (data.searchCount || 0);
            
            return {
                id: doc.id,
                ...data,
                totalEngagement
            };
        });
        
        const trendingProducts = allProducts
            .sort((a, b) => b.totalEngagement - a.totalEngagement)
            .slice(0, 3);
        
        
        let positionCount = 0;
        trendingProductsDash.innerHTML='';
        trendingProducts.forEach(async product=>{
            try{
                const productData = await getDoc(doc(db, 'products', product.sectionId, 'items', product.id));

                trendingProductsDash.innerHTML+=
                `
                    <div class="product-stat-container">
                        <div class="image-container">
                            <img src="${productData.data().image}">
                            <div class="position">${++positionCount}</div>
                            <div class="product-name">${productData.data().name}</div>
                        </div>
                        <div class="stats-container">
                            <div>Views</div>
                            <div>Searches</div>
                            <div>Wishlists</div>
                            <div>Orders</div>
                        </div>
                        <div class="stat-values-container">
                            <div class="views-value">${product.viewCount?  product.viewCount: `---`}</div>
                            <div class="searches-value">${product.searchCount?  product.searchCount: `---`}</div>
                            <div class="wishlists-value">${product.wishlistCount?  product.wishlistCount: `---`}</div>
                            <div class="orders-value">${product.orderCount?  product.orderCount: `---`}</div>
                        </div>
                    </div>
                `
            }
            catch(err){
                console.error(err);
            }
        })
    }
    catch(err){
        console.error(err);
    }
}


const mostSearchedDash = document.getElementById("js-most-searched-dash");
async function loadMostSearchedProducts(){
    try{
        const searchSnap = await getDocs(
            query(
                collection(db, 'analytics', 'productStats', 'items'),
                orderBy('searchCount', 'desc'),
                limit(5)
            )
        );

        let maxCount = 0;
        mostSearchedDash.innerHTML='';

        searchSnap.forEach(async snap=>{
            const productStats = snap.data();
            const productId = snap.id;

            const count = productStats.searchCount || 0;
            if (count > maxCount) maxCount = count;
            const percentage = Math.min((productStats.searchCount / maxCount) * 100, 100);

            try{
                const productData = await getDoc(doc(db, 'products', productStats.sectionId, 'items', productId));

                mostSearchedDash.innerHTML+=
                `
                    <div class="product-stat-container">
                        <div class="top">
                            <img src="${productData.data().image}">
                            <div class="product-name">${productData.data().name}</div>
                        </div>
                        <div class="stats">
                            <div class="stat-bar-container">
                                <div class="bar" style="
                                    width: ${percentage}px"></div>
                            </div>
                            <div>${productStats.searchCount}</div>
                        </div>
                    </div>
                `
            }
            catch(err){
                console.error(err)
            }
        })
    }
    catch(err){
        console.error(err);
    }
}


const mostViewedDashTop = document.getElementById("js-most-viewed-dash-top");
const mostViewedDashBottom = document.getElementById("js-most-viewed-dash-bottom");
async function loadMostViewedProducts(){
    try{
        const firstViewSnap = await getDocs(
            query(
                collection(db, 'analytics', 'productStats', 'items'),
                orderBy('viewCount', 'desc'),
                limit(1)
            )
        );

        const snap = await getDocs(
            query(
                collection(db, 'analytics', 'productStats', 'items'),
                orderBy('viewCount', 'desc'),
                limit(3)
            )
        );
        const productsSnap = snap.docs.map(doc => ({ Id: doc.id, ...doc.data() }));
        const secondViewSnap = productsSnap.slice(1, 3);
        let maxCount = 0;

        mostViewedDashTop.innerHTML='';
        firstViewSnap.forEach(async snap=>{
            const productStats = snap.data();
            const productId = snap.id;

            const count = productStats.viewCount || 0;
            if (count > maxCount) maxCount = count;
            const percentage = Math.min((productStats.viewCount / maxCount) * 10, 100);

            try{
                const productData = await getDoc(doc(db, 'products', productStats.sectionId, 'items', productId));

                mostViewedDashTop.innerHTML+=
                `
                    <div class="product-stat-container" style="--percentage: ${percentage}">
                        <div class="view-count">${productStats.viewCount}</div>
                        <div class="product-name">${productData.data().name}</div>
                        <img src="${productData.data().image}" alt="">
                    </div>
                `
            }
            catch(err){
                console.error(err)
            }
        })

        mostViewedDashBottom.innerHTML='';
        secondViewSnap.forEach(async product=>{

            const count = product.viewCount || 0;
            if (count > maxCount) maxCount = count;
            const percentage = Math.min((product.viewCount / maxCount) * 10, 100);

            try{
                const productData = await getDoc(doc(db, 'products', product.sectionId, 'items', product.Id));

                mostViewedDashBottom.innerHTML+=
                `
                    <div class="product-stat-container" style="--percentage: ${percentage}">
                        <div class="view-count">${product.viewCount}</div>
                        <div class="product-name">${productData.data().name}</div>
                        <img src="${productData.data().image}" alt="">
                    </div>
                `
            }
            catch(err){
                console.error(err)
            }
        })
    }
    catch(err){
        console.error(err);
    }
}


const mostOrderedDash = document.getElementById("js-most-ordered-dash");
async function loadMostOrderedProducts(){
    try{
        const orderSnap = await getDocs(
            query(
                collection(db, 'analytics', 'productStats', 'items'),
                orderBy('orderCount', 'desc'),
                limit(5)
            )
        );

        let maxCount = 0;
        mostOrderedDash.innerHTML='';

        orderSnap.forEach(async snap=>{
            const productStats = snap.data();
            const productId = snap.id;
z
            const count = productStats.searchCount || 0;
            if (count > maxCount) maxCount = count;
            const percentage = Math.min((productStats.searchCount / maxCount) * 100, 100);

            try{
                const productData = await getDoc(doc(db, 'products', productStats.sectionId, 'items', productId));

                mostOrderedDash.innerHTML+=
                `
                    <div class="product-stat-container">
                        <div class="stats">
                            <div>300</div>
                            <div class="stat-bar-container">
                                <div class="bar" style="
                                    heigth: ${percentage}px"></div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="product-name">${productData.data().name}</div>
                            <img src="${productData.data().image}">
                        </div>
                        
                    </div>
                `
            }
            catch(err){
                console.error(err)
            }
        })
    }
    catch(err){
        console.error(err);
    }
}


const failedQueriesDash = document.getElementById("js-failed-queries-dash");
async function loadFailedQueries(){
    try{
        const snap = await getDocs(collection(db, 'analytics', 'failedSearchStats', 'logs'));

        failedQueriesDash.innerHTML='';
        snap.forEach(async snap=>{
            failedQueriesDash.innerHTML+=
            `
                <div class="query">${snap.data().query}</div>
            ` 
        })
    }
    catch(err){
        console.error(err);
    }
}



async function loadAllDashboards(){
    try{
        await Promise.all([
            await loadTrendingProducts(),
            await loadMostSearchedProducts(),
            await loadMostViewedProducts(),
            await loadMostOrderedProducts(),
            await loadFailedQueries()
        ]);

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

onAuthStateChanged(auth, async (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminHeader.style.display = "flex";
        allDashContainer.style.display = "grid";
        await loadAllDashboards();
    } 
    else {
        adminHeader.style.display = "none";
        allDashContainer.style.display = "none";
        window.location.href = `../index.html`
    }
});