import {collection, getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db, auth } from "../auth.js";
import { trackSearch } from "./tracksearch.js";

const userId = auth.currentUser?.uid;

async function filterProducts(query) {
    const queriedItem = query.toLowerCase();
    let sectionResults = [];

    try{
        const snap = await getDocs(collection(db, 'products'));

        for(const doc of snap.docs){
            const productSecId = doc.id;

            try{
                const snap = await getDocs(collection(db, 'products', productSecId, 'items'));
                snap.forEach(doc=>{
                    const allKeywords = doc.data().keywords.map(keywords =>
                        keywords.toLowerCase()
                    );
                    const match = allKeywords.some(keywords => keywords.includes(queriedItem));
                    if(match) {
                        let product = {};
                        product.sectionId = productSecId;
                        Object.entries(doc.data()).forEach(([key, value])=>{
                            product[key] = value;
                        })
                        sectionResults.push(product);
                    };
                })
            }
            catch(err){
                console.error(err);
            }
        }
    }
    catch(err){
        console.error(err);
    }

   return sectionResults;
}


function renderProducts(products){
    const productsContainer = document.getElementById("grid-container");
    const noResultsScreen = document.getElementById("no-results-screen");

    if (products.length === 0) {
        noResultsScreen.style.display = "flex";
        productsContainer.style.display = "none";
        return;
    }
    noResultsScreen.style.display = "none";
    productsContainer.style.display = "grid";

    productsContainer.innerHTML = "";
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="image of ${product.name}">
                <p class="name">${product.name}</p>
                <div class="wishlist-container">
                    <button class="add-to-wishlist js-add-to-wishlist" data-section-id="${product.sectionId}" data-product-id="${product.id}">
                        <svg class="js-add-to-wishlist" data-section-id="${product.sectionId}" data-product-id="${product.id}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                    </svg>
                    </button>
                    <p class="wishlist-tooltip">add to wishlist</p>
                </div>
                <button class="open-popup js-open-popup" data-section-id="${product.sectionId}" data-product-id="${product.id}">more info</button>
            </div>
        `;
    });

    
}


async function runSearch(){
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query")?.toLowerCase() ;

    if(!query){
        console.warn("no query found!");
        return;
    }

    document.getElementById("search-query").innerHTML=query;
    const results = await filterProducts(query);
    renderProducts(results);
    await trackSearch(userId, query, results)
}

document.addEventListener("DOMContentLoaded", runSearch);