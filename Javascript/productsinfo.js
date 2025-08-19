//////////////////////////////////////////PRODUCT INFO  WWINDOW//////////////////////////////////////////
const productPopupContainer = document.querySelector(".popup-padding");
export default function displayProductInfoWindow(productId){
    //PRODUCTS FETCH
    fetch("/Javascript/Data.json")
    .then(response => response.json())
    .then(data => {
        const allSections = [
            ...data.serumsSection,
            ...data.facecreamSection,
            ...data.bodyoilSection,
            ...data.sunscreenSection,
            ...data.facewashSection,
            ...data.tonerSection,
            ...data.bodylotionSection,
            ...data.facemoisturiserSection,
            ...data.cleanserSection,
            ...data.facemaskSection,
            ...data.bodywashSection,
            ...data.essenceSection,
            ...data.treatmentcreamSection,
            ...data.bodyscrubSection
        ];

        //VARIABLES
        let matchingProduct;

        //ALGORITHM
        allSections.forEach(section=>{
            section.product.forEach(product=>{
                if(productId === product.id){
                    matchingProduct = product;

                    if(matchingProduct){
                        productPopupContainer.innerHTML=
                        `
                        <div class="product-info">
                            <div class="image"><img src="${matchingProduct.image}" alt="image of ${matchingProduct.name}">
                            </div>
                            <div class="basic-info">
                                <div class="name">
                                    <p>${matchingProduct.name}</p>
                                    <button class="js-close-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                        Close</button>
                                </div>
                                <p class="category">category: <span class="category-content">${matchingProduct.category}</span></p>
                                <p class="price-container"><span class="price">price: </span>GhC <span class="price-content">${matchingProduct.price}</span></p>
                            </div>
                        </div>
                        <div class="product-details">
                            <div class="left">
                                <div class="usage">
                                    <p class="header">Description</p>
                                    <p class="content usage-content">${matchingProduct.description}</p>
                                </div>
                                <div class="dossage">
                                    <p class="header">Benefits</p>
                                    <p class="content dosage-content">${matchingProduct.usage}</p>
                                </div>
                            </div>

                            <div class="right">
                                <div class="condition">
                                    <p class="header">Prescription</p>
                                    <p class="content condition-content">${matchingProduct.prescription}</p>
                                </div>
                                <div class="disclaimer">
                                    <p class="header">Disclaimer</p>
                                    <p class="content disclaimer-content">${matchingProduct.disclaimer}</p>
                                </div>
                            </div>
                        </div>

                        <div class="product-review">
                            <div class="review-header">
                                Would you like to leave a review?
                            </div>
                            <div class="review-content">
                                <div class="input"><input type="text">
                                <button class="submit-review js-submit-review">submit</button>
                                </div>
                                <div class="reaction-buttons">
                                    <div class="liked">
                                        <button class="liked-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                                    </button>
                                    liked
                                    </div>
                                    <div class="disliked">
                                        <button class="disliked-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>
                                    </button>
                                    disliked
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    }
                }
            })
        })
    });
    
}
