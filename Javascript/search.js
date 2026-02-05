import {collection, getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../Javascript/Forms.js";

async function filterProducts(query) {
    const queriedItem = query.toLowerCase();

    const sections = ['serumsSection', 'facecreamSection', 'bodyoilSection', 'sunscreenSection', 'facewashSection', 'tonerSection', 'bodylotionSection', 'facemoisturiserSection', 'cleanserSection', 'facemaskSection', 'bodywashSection', 'essenceSection', 'treatmentcreamSection', 'bodyscrubSection'];

    const promises = sections.map(async section=>{
        const snap = await getDocs(collection(db, 'products', section, 'items'));
        let sectionResults = [];

        snap.forEach(doc=> {
            const allKeywords = doc.data().keywords.map(keywords =>
                keywords.toLowerCase()
            );
            const match = allKeywords.some(keywords => keywords.includes(queriedItem));
            if(match) sectionResults.push(doc.data());
        });

        return sectionResults;
    }) 

    const results = await Promise.all(promises)
    return results.flat();
}

function renderProducts(products){
    const productsContainer = document.querySelector(".grid-container");
    const noResultsScreen = document.querySelector(".no-results-screen");

    if (!productsContainer || !noResultsScreen) {
        console.error("Missing .grid-container or .no-results-screen in HTML");
        return;
    }

    productsContainer.innerHTML = "";

    if (products.length === 0) {
        noResultsScreen.style.display = "flex";
        productsContainer.style.display = "none";
        return;
    }

    noResultsScreen.style.display = "none";
    productsContainer.style.display = "grid";

    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="image of ${product.name}">
                <p class="name">${product.name}</p>
                <div class="wishlist-container">
                    <button data-id="${product.id}" class="add-to-wishlist js-add-to-wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"       fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                    </svg>
                    </button>
                    <p class="wishlist-tooltip">add to wishlist</p>
                </div>
                <button class="open-popup js-open-popup" data-id="${product.id}">more info</button>
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

    const results = await filterProducts(query);
    renderProducts(results);
}

document.addEventListener("DOMContentLoaded", runSearch);