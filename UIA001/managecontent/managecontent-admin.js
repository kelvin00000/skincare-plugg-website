import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, addDoc, setDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/Forms.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const productSections = document.getElementById("js-product-sections-screen");

//// POPUPS
const confirmDeletePopup = document.getElementById("js-confirm-delete-popup-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");
const popupScreen = document.getElementById("js-black-screen");

const failToast = document.getElementById("js-fail-toast");
const emptyFieldToast = document.getElementById("js-empty-field-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');


const productSectionsGrid = document.getElementById("js-product-sections-grid");
async function fetchAndDisplayProductSections(){
    try{
        const snap = await getDocs(collection(db, 'products'));

        productSectionsGrid.innerHTML='';
        snap.forEach(doc=>{
            const productSec = doc.data().title;
            const productSecImage = doc.data().image;
            const productSecId = doc.id;
            productSectionsGrid.innerHTML+=
            `
                <div class="section-container">
                    <div class="section-card open-section" data-section-id="${productSecId}" data-section-title="${productSec}">
                        <div class="left open-section" data-section-id="${productSecId}" data-section-title="${productSec}">
                            <img src="${productSecImage}">
                        </div>
                        <div class="right open-section" data-section-id="${productSecId}" data-section-title="${productSec}">
                            <div class="section-name">${productSec}</div>
                        </div>
                    </div>

                    <button class="js-confirmdelete-btn" data-section-id="${productSecId}" data-delete-item-name="${productSec}">
                        <svg class="js-confirmdelete-btn" data-section-id="${productSecId}" data-delete-item-name="${productSec}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
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

//// PRODUCT SECTION SEARCH LOGIC
document.getElementById("js-search-sections-input").addEventListener('input', async (e) => {
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    let productSection, sectionId;

    const snap = await getDocs(collection(db, 'products'));
    snap.forEach(async doc=>{
        const sectionName = doc.data().title.toLowerCase();
        if(sectionName.includes(e.target.value.toLowerCase())) {
            productSection = doc.data();
            sectionId = doc.id;
        };

        if(productSectionsGrid){
            productSectionsGrid.innerHTML = '';
            productSectionsGrid.innerHTML+=`
                <div class="section-container">
                    <div class="section-card open-section" data-section-id="${sectionId}" data-section-title="${productSection.title}">
                        <div class="left open-section" data-section-id="${sectionId}" data-section-title="${productSection.title}">
                            <img src="${productSection.image}">
                        </div>
                        <div class="right open-section" data-section-id="${sectionId}" data-section-title="${productSection.title}">
                            <div class="section-name">${productSection.title}</div>
                        </div>
                    </div>

                    <button class="js-confirmdelete-section-btn" data-section-id="${sectionId}">
                        <svg class="js-confirmdelete-section-btn" data-section-id="${sectionId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                </div>
            `;
        }
        
    })

    if(e.target.value === '') await fetchAndDisplayProductSections()

    if(!productSection || productSectionsGrid.innerHTML===''){
        productSectionsGrid.innerHTML='No Results'
    }

    loader.classList.remove('show-loader');
    loadingScreen.classList.remove('show-loader');
});

//// ADD NEW SECTION
const addNewSectionScreen = document.getElementById("js-add-new-product-section-screen")
document.getElementById("js-add-new-section-tab").addEventListener('click', ()=>{
    addNewSectionScreen.classList.add('screen-show');
})
function closeAddNewSectionScreen(){
    addNewSectionScreen.classList.remove('screen-show');
    sectionImageInput.value = ''
    sectionImagePreview.src = '';
    sectionImagePreview.style.display = 'none';
    sectionProductImageInput.value = '';
    sectionProductImagePreview.src = '';
    sectionProductImagePreview.style.display = 'none';
}
document.getElementById("close-add-new-section-screen-btn").addEventListener('click', ()=>{
    closeAddNewSectionScreen();
})
document.getElementById("create-new-section-popup-btn").addEventListener('click', async ()=>{
    await addNewProductSection()
})
// IMAGE PREVIEWS
const sectionImageInput = document.getElementById('add-new-section-image-value');
const sectionImagePreview = document.getElementById('add-new-section-image-preview');
sectionImageInput.addEventListener('change', (e) => {
    previewImage(sectionImagePreview, e);
});

const sectionProductImageInput = document.getElementById('add-new-section-product-image-value');
const sectionProductImagePreview = document.getElementById('add-new-section-product-image-preview');
sectionProductImageInput.addEventListener('change', (e) => {
    previewImage(sectionProductImagePreview, e);
});
function previewImage(element, e){
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        element.src = url;
        element.style.display = 'block';
    }
}
// FUNCTIONS
async function addNewProductSection(){
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const sectionID = document.getElementById("add-new-section-id-value").value.trim();
    const sectionTitle = document.getElementById("add-new-section-title-value").value.trim();
    const sectionImage = document.getElementById("add-new-section-image-value").files[0];
    const sectionProductImage = document.getElementById("add-new-section-product-image-value").files[0];
    const sectionProductName = document.getElementById("add-new-section-product-name-value").value.trim();
    const sectionProductCategory = document.getElementById("add-new-section-product-category-value").value.trim();
    const sectionProductPrice_temp = document.getElementById("add-new-section-product-price-value").value.trim();
    const sectionProductDescription = document.getElementById("add-new-section-product-description-value").value.trim();
    const sectionProductBenefit = document.getElementById("add-new-section-product-benefit-value").value.trim();
    const sectionProductPrescription = document.getElementById("add-new-section-product-prescription-value").value.trim();
    const sectionProductDisclaimer = document.getElementById("add-new-section-product-disclaimer-value").value.trim();

    const sectionProductPrice = Number(sectionProductPrice_temp); 

    if(!sectionID || !sectionTitle || !sectionImage || !sectionProductImage || !sectionProductName || !sectionProductCategory || !sectionProductPrice || typeof(sectionProductPrice) !== 'number' || !sectionProductDescription || !sectionProductBenefit || !sectionProductPrescription || !sectionProductDisclaimer){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try{
        const { url: sectionImageUrl, publicId: sectionImagePublicId } = await uploadImageToCloudinary(sectionImage);
        const { url: productImageUrl, publicId: productImagePublicId } = await uploadImageToCloudinary(sectionProductImage);

        await createSectionAndAddDocToFirestore(sectionID, sectionTitle, sectionImageUrl, sectionImagePublicId);
        await addProductToCreatedSection(sectionID, productImageUrl, productImagePublicId, sectionProductName, sectionProductCategory, sectionProductPrice, sectionProductDescription, sectionProductBenefit, sectionProductPrescription, sectionProductDisclaimer);

        closeAddNewSectionScreen();
        await fetchAndDisplayProductSections()
        
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
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'xoxoskincare_products');
    formData.append('folder', 'xoxoskincare/products');
    
    try {
        const response = await fetch(
            'https://api.cloudinary.com/v1_1/dnn8wbubn/image/upload',
            {
                method: 'POST',
                body: formData
            }
        );
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        return {
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}
async function createSectionAndAddDocToFirestore(Id, title, image, imagePublicId){
    try{
        const sectionData = {
            image,
            imagePublicId,
            title
        };
        await setDoc(doc(db, "products", Id), sectionData);
    }
    catch(err){
        console.error(err);
        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast')
        }, 5000);
    }
}
async function addProductToCreatedSection(sectionId, image, imagePublicId, name, category, price, description, benefit, prescription, disclaimer){

    const keywords = generateKeyWords(name, category, benefit, prescription, description);
    console.log(keywords);

    try{
        const productRef = doc(collection(db, "products", sectionId, "items"));
        const productId = productRef.id;

        await setDoc(productRef, {
            id: productId,
            image,
            imagePublicId,
            name,
            category,
            price,
            description,
            usage: benefit,
            prescription,
            disclaimer,
            keywords
        })
    }
    catch(err){
        console.error(err);
        failToast.classList.add('show-toast');
        setTimeout(()=>{
            failToast.classList.remove('show-toast')
        }, 5000);
    }
}
function generateKeyWords(name, category, benefit, prescription, description){
    const keywords = new Set();

    function addWords(text){
        if(!text) return;

        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length>2);

        words.forEach(word=>keywords.add(word));

        // words.forEach(word=>{
        //     for(let i=3; i<=word.length; i++){
        //         keywords.add(word.substring(0, i))
        //     }
        // });
    }

    if(name) keywords.add(name.toLowerCase());
    if(category) keywords.add(category.toLowerCase());

    addWords(name);
    addWords(benefit);
    addWords(description);
    addWords(prescription);

    return Array.from(keywords);
}


//// PRODUCTS SCREEN DISPLAY / UPDATE SECTION SCREEN
const productsScreen = document.getElementById("js-products-screen");
const productsGrid = document.getElementById("js-product-grid");

document.addEventListener('click', async element => {
    if (element.target.classList.contains('open-section')) {
        productSections.style.display = 'none';
        productsScreen.style.display = 'block';

        const sectionId = element.target.dataset.sectionId;
        const sectionTitle = element.target.dataset.sectionTitle;

        //SECTION TITLE SET
        document.getElementById("js-product-section-name").innerHTML = sectionTitle;
        await fetchAndDisplayProducts(sectionId);
    }
});
async function fetchAndDisplayProducts(sectionId){
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    try{
        const sectionSnap = await getDoc(doc(db, 'products', sectionId));
        document.getElementById("js-update-section-title-value").value = sectionSnap.data().title;
    }
    catch(err){
        console.error(err);
    }

    // DATA-VALUE SET
    document.getElementById("js-update-section-btn").dataset.sectionId = sectionId;
    document.getElementById("js-search-products-input").dataset.sectionId = sectionId;
    document.getElementById("add-new-product-screen-btn").dataset.sectionId = sectionId;

    try{
        const snap = await getDocs(collection(db, 'products', sectionId, 'items'));

        productsGrid.innerHTML='';
        snap.forEach(doc=>{
            const product = doc.data();
            const productId = doc.id;
            productsGrid.innerHTML+=
            `
                <div class="product-container">
                    <div class="product-card open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                        <div class="left open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                            <img src="${product.image}">
                        </div>
                        <div class="right open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                            <div class="product-name">${product.name}</div>
                        </div>
                    </div>

                    <button class="js-confirmdelete-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-delete-item-name="${product.name}">
                        <svg class="js-confirmdelete-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-delete-item-name="${product.name}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
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
document.getElementById("js-close-products-screen-btn").addEventListener('click', ()=>{
    productSections.style.display = 'block';
    productsScreen.style.display = 'none';
})
// PRODUCT SEARCH LOGIC
document.getElementById("js-search-products-input").addEventListener('input', async (e) => {
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const sectionId = document.getElementById("js-search-products-input").dataset.sectionId;
    let product, productId;

    const snap = await getDocs(collection(db, 'products', sectionId, 'items'));
    snap.forEach(async doc=>{
        const productName = doc.data().name.toLowerCase();
        if(productName.includes(e.target.value.toLowerCase())) {
            product = doc.data();
            productId = doc.id;
        };

        if(productsGrid){
            productsGrid.innerHTML = '';
            productsGrid.innerHTML+=`
                <div class="product-container">
                    <div class="product-card open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                        <div class="left open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                            <img src="${product.image}">
                        </div>
                        <div class="right open-product" data-section-id="${sectionId}" data-product-id="${productId}">
                            <div class="product-name">${product.name}</div>
                        </div>
                    </div>

                    <button class="js-confirmdelete-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-delete-item-name="${product.name}">
                        <svg class="js-confirmdelete-btn" data-section-id="${sectionId}" data-product-id="${productId}" data-delete-item-name="${product.name}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                </div>
            `;
        }
        
    })

    if(e.target.value === '') await fetchAndDisplayProducts(sectionId)

    if(!product || productsGrid.innerHTML===''){
        productsGrid.innerHTML='No Results'
    }

    loader.classList.remove('show-loader');
    loadingScreen.classList.remove('show-loader');
});
// UPDATE PRODUCT SECTION TITLE
document.getElementById("js-update-section-btn").addEventListener('click', async ()=>{
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');
    const sectionId = document.getElementById("js-update-section-btn").dataset.sectionId;

    const sectionTitle = document.getElementById("js-update-section-title-value").value.trim();
    if(!sectionTitle){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try{
        await updateDoc(doc(db, 'products', sectionId), {
            title: sectionTitle
        });

        document.getElementById("js-product-section-name").innerHTML = sectionTitle;

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
})
// ADD NEW PRODUCT 
const addNewProductScreen = document.getElementById("js-add-new-product-screen")
document.getElementById("js-add-new-product-tab").addEventListener('click', ()=>{
    addNewProductScreen.classList.add('screen-show');
})
async function addNewProduct(sectionId){
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const productImage = document.getElementById("add-new-product-image-value").files[0];
    const productName = document.getElementById("add-new-product-name-value").value.trim();
    const productCategory = document.getElementById("add-new-product-category-value").value.trim();
    const productPrice_temp = document.getElementById("add-new-product-price-value").value.trim();
    const productDescription = document.getElementById("add-new-product-description-value").value.trim();
    const productBenefit = document.getElementById("add-new-product-benefit-value").value.trim();
    const productPrescription = document.getElementById("add-new-product-prescription-value").value.trim();
    const productDisclaimer = document.getElementById("add-new-product-disclaimer-value").value.trim();

    const productPrice = Number(productPrice_temp); 

    if(!sectionId || !productImage || !productName || !productCategory || !productPrice || typeof(productPrice) !== 'number' || !productDescription || !productBenefit || !productPrescription || !productDisclaimer){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try{
        const { url: productImageUrl, publicId: productImagePublicId } = await uploadImageToCloudinary(productImage);

        // REUSED ADD NEW PRODUCT TO SECTION FUNCTION THUS THE NAME
        await addProductToCreatedSection(sectionId, productImageUrl, productImagePublicId, productName, productCategory, productPrice, productDescription, productBenefit, productPrescription, productDisclaimer);

        closeAddNewProductScreen();
        await fetchAndDisplayProducts(sectionId)
        
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
document.getElementById("add-new-product-screen-btn").addEventListener('click', ()=>{
    const sectionId = document.getElementById("add-new-product-screen-btn").dataset.sectionId;
    addNewProduct(sectionId);
})

// IMAGE PREVIEW
const addNewProductImageInput = document.getElementById('add-new-product-image-value');
const addNewProductImagePreview = document.getElementById('js-add-new-product-image-preview');
addNewProductImageInput.addEventListener('change', (e) => {
    previewImage(addNewProductImagePreview, e);
});
// CLOSE SCREEN 
function closeAddNewProductScreen(){
    addNewProductScreen.classList.remove('screen-show');
    addNewProductImageInput.value = ''
    addNewProductImagePreview.src = '';
    addNewProductImagePreview.style.display = 'none';
}
document.getElementById("js-close-add-new-product-screen-btn").addEventListener('click', ()=>{
    closeAddNewProductScreen();
})



//// UPDATE PRODUCT
const updateProductScreen = document.getElementById("js-update-product-screen");

document.addEventListener('click', async element => {
    if (element.target.classList.contains('open-product')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');
        updateProductScreen.classList.add('screen-show');

        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;

        document.getElementById("js-update-product-screen-btn").dataset.sectionId = sectionId;
        document.getElementById("js-update-product-screen-btn").dataset.productId = productId;
        updateProductScreenFn(sectionId, productId)
    }
});
async function updateProductScreenFn (sectionId, productId) {
    try{
        const productSnap = await getDoc(doc(db, 'products', sectionId, 'items', productId));

        document.getElementById("js-update-product-name").innerHTML = productSnap.data().name;
        document.getElementById("update-product-image-preview").style.display = 'block'
        document.getElementById("update-product-image-preview").src = productSnap.data().image;
        document.getElementById("update-product-name-value").value = productSnap.data().name;
        document.getElementById("update-product-category-value").value = productSnap.data().category;
        document.getElementById("update-product-price-value").value = productSnap.data().price;
        document.getElementById("update-product-description-value").value = productSnap.data().description;
        document.getElementById("update-product-benefit-value").value = productSnap.data().usage;
        document.getElementById("update-product-prescription-value").value = productSnap.data().prescription;
        document.getElementById("update-product-disclaimer-value").value = productSnap.data().disclaimer;
        
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
document.getElementById("js-update-product-screen-btn").addEventListener('click', ()=>{
    const sectionId = document.getElementById("js-update-product-screen-btn").dataset.sectionId;
    const productId = document.getElementById("js-update-product-screen-btn").dataset.productId;
    updateProduct(sectionId, productId);
})
async function updateProduct(sectionId, productId){
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const productImage = document.getElementById("update-product-image-value").files[0];
    const productName = document.getElementById("update-product-name-value").value.trim();
    const productCategory = document.getElementById("update-product-category-value").value.trim();
    const productPrice_temp = document.getElementById("update-product-price-value").value.trim();
    const productDescription = document.getElementById("update-product-description-value").value.trim();
    const productBenefit = document.getElementById("update-product-benefit-value").value.trim();
    const productPrescription = document.getElementById("update-product-prescription-value").value.trim();
    const productDisclaimer = document.getElementById("update-product-disclaimer-value").value.trim();

    const productPrice = Number(productPrice_temp); 

    // IMAGE VALUE CHECK WAS REMOVED TO ALLOW UPDATING OTHER FIELDS EXLUDING THE IMAGE
    if(!productName || !productCategory || !productPrice || typeof(productPrice) !== 'number' || !productDescription || !productBenefit || !productPrescription || !productDisclaimer){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    const keywords = generateKeyWords(productName, productCategory, productBenefit, productPrescription, productDescription);
    console.log(keywords);

    try{
        if(!productImage){
            await updateDoc(doc(db, 'products', sectionId, 'items', productId), {
                name: productName,
                category: productCategory,
                price: productPrice,
                description: productDescription,
                usage: productBenefit,
                prescription: productPrescription,
                disclaimer: productDisclaimer,
                keywords
            });

            loader.classList.remove('show-loader');
            loadingScreen.classList.remove('show-loader');
            return;
        }

        const { url: productImageUrl, publicId: productImagePublicId } = await uploadImageToCloudinary(productImage);

        await updateDoc(doc(db, 'products', sectionId, 'items', productId), {
            image: productImageUrl,
            imagePublicId: productImagePublicId,
            name: productName,
            category: productCategory,
            price: productPrice,
            description: productDescription,
            usage: productBenefit,
            prescription: productPrescription,
            disclaimer: productDisclaimer,
            keywords
        });

        await updateProductScreenFn(sectionId, productId)
        
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
// IMAGE PREVIEW
const updateProductImageInput = document.getElementById('update-product-image-value');
const updateProductImagePreview = document.getElementById('update-product-image-preview');
updateProductImageInput.addEventListener('change', (e) => {
    previewImage(updateProductImagePreview, e);
});
// CLOSE SCREEN
document.getElementById("js-close-update-product-screen-btn").addEventListener('click', ()=>{
    updateProductScreen.classList.remove('screen-show');
})




//// CONFIRM DELETE POPUP
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-confirmdelete-btn')) {
        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;
        const deleteItemName = element.target.dataset.deleteItemName;

        popupScreen.classList.add('show-loader');
        confirmDeletePopup.classList.add('screen-show');
        confirmDeletePopup.innerHTML=
        `
            <div class="padding">
                "${deleteItemName}"<br>
                Are You sure You want to delete this?
                <div class="ctas">
                    <button class="js-close-confirmdelete-popup-btn">
                        No, Exit
                    </button>
                    <button class="js-delete-btn" data-section-id="${sectionId}" ${productId? `data-product-id="${productId}"`: ''}>
                        Continue
                        <svg class="js-delete-btn" data-section-id="${sectionId} ${productId? `data-product-id="${productId}"`: ''} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
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
    if (element.target.classList.contains('js-delete-btn')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');

        const sectionId = element.target.dataset.sectionId;
        const productId = element.target.dataset.productId;

        try{
            if(!sectionId) return;

            if(sectionId && productId){
                await deleteDoc(doc(db, 'products', sectionId, 'items', productId));
                await fetchAndDisplayProducts();
            }
            else if(sectionId){
                await deleteDoc(doc(db, 'products', sectionId));
                await fetchAndDisplayProductSections();
            }

            popupScreen.classList.remove('show-loader');
            confirmDeletePopup.classList.remove('screen-show');

            await fetchAndDisplayProductSections();

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
        productSections.style.display = "block";
        await fetchAndDisplayProductSections();
    } 
    else {
        adminHeader.style.display = "none";
        productSections.style.display = "block";
        window.location.href = `../index.html`
    }
});