import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, addDoc, setDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/auth.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const allPackagesContainer= document.getElementById("js-all-packages-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");

const failToast = document.getElementById("js-fail-toast");
const emptyFieldToast = document.getElementById("js-empty-field-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');

//// PACKAGES DISPLAY
async function fetchAndDisplayPackages(){
    try{
        const snap = await getDocs(collection(db, 'packages'));
        
        document.getElementById("js-all-packages-container").innerHTML='';
        snap.forEach(doc=>{
            const package_ = doc.data();
            const packageId = doc.id;

            document.getElementById("js-all-packages-container").innerHTML+=
            `
                <div class="package-container" style="background-image: url(${package_.imageUrl});">
                    <span class="package-name">${package_.packageName}</span>
                    <div class="ctas">
                        <button class="open-update-screen-btn" data-package-id="${packageId}">Update</button>
                        <button class="open-confirmdelete-popup js-confirmdelete-btn" data-package-id="${packageId}" data-image-public-id="${package_.imagePublicId}" data-delete-item-name="${package_.packageName}">
                            <svg class="js-confirmdelete-btn" data-package-id="${packageId}" data-image-public-id="${package_.imagePublicId}" data-delete-item-name="${package_.packageName}" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            <span class="js-confirmdelete-btn" data-package-id="${packageId}" data-image-public-id="${package_.imagePublicId}" data-delete-item-name="${package_.packageName}">Remove</span>
                        </button>
                    </div>
                </div>
            `
        })
        if(snap.empty) document.getElementById("js-all-packages-container").innerHTML='There are currently no packages';

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


//// IMAGE PREVIEW
const imageInput = document.getElementById('package-image-value');
const imagePreview = document.getElementById('image-preview');
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        imagePreview.src = url;
        imagePreview.style.display = 'block';
    }
});


//// PRODUCT SELECTION
let selectedProducts = [];
let tempProductData = [];

const selectedProductsRow = document.getElementById("js-selected-prodcts-row");
function renderSelectedProducts(){
    selectedProductsRow.innerHTML='';
    if(selectedProducts){
        selectedProducts.forEach(product=>{
            selectedProductsRow.innerHTML+=
            `
                <div class="selected-product">
                    <button class="remove-product" data-product-id="${product.productId}">
                        <svg class="remove-product" data-product-id="${product.productId}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </button>
                    <img src="${product.productImage}">
                    <span>${product.productName}</span>
                </div>
            `
        })
    }
}
document.getElementById("js-select-product").addEventListener('click', ()=>{
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    selectedProducts.push(tempProductData[0]);
    renderSelectedProducts();

    loader.classList.remove('show-loader');
    loadingScreen.classList.remove('show-loader');
})
// REMOVE SELECTION
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains("remove-product")){
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');

        const productId = e.target.dataset.productId;

        selectedProducts.forEach((product, index)=>{
            if(product.productId===productId){
                selectedProducts.splice(index, 1);
                renderSelectedProducts();
            }
        })

        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');
    }
})



//// PRODUCT SEARCH
const foundProductPreview = document.getElementById("js-found-product-preview")
document.getElementById("js-search-products-input").addEventListener('input', async (e) => {
    let product;
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const sectionSnap = await getDocs(collection(db, 'products'));
    sectionSnap.forEach(async doc=>{
        const sectionId = doc.id;

        const productSnap = await getDocs(collection(db, 'products', sectionId, 'items'));
        productSnap.forEach(async doc=>{
            const productName = doc.data().name.toLowerCase();
            if(productName.includes(e.target.value.toLowerCase())) {
                product = doc.data();
                const productData = {
                    'productId': product.id,
                    'sectionId': sectionId, 
                    'productName': product.name, 
                    'productImage': product.image,
                }
                tempProductData.push(productData);

                foundProductPreview.innerHTML=
                `
                    <img src="${product.image}">
                    <span>${product.name}</span>
                `;
            };
        })
    })

    if(e.target.value === ''){
        foundProductPreview.innerHTML=`Search To find Products`;
        tempProductData = [];
    }
    if(!product){
        foundProductPreview.innerHTML=`No results`;
        tempProductData = [];
    }

    loader.classList.remove('show-loader');
    loadingScreen.classList.remove('show-loader');
});


//// CLOUDINARY UPLOAD
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
//// INPUT FIELDS CLEAR
function clearFields(){
    document.getElementById("package-name-value").value = '';
    document.getElementById("image-preview").style.display = 'none';
    document.getElementById("image-preview").src = '';
    document.getElementById("package-description-value").value = '';
    document.getElementById("js-search-products-input").value='';
    foundProductPreview.innerHTML='';
    selectedProducts=[];
    tempProductData=[];
    renderSelectedProducts()
}


//// ADD NEW PACKAGE
async function addPackage(){
    const packageImage = document.getElementById("package-image-value").files[0];
    const packageName = document.getElementById("package-name-value").value.trim();
    const packageDescription = document.getElementById("package-description-value").value.trim();

    if(!packageName || !packageDescription || !packageImage || selectedProducts.length<2){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    const finalProducts = selectedProducts.map(({ productImage, productName, ...rest }) => rest);

    try{
        const { url: imageUrl, publicId: imagePublicId } = await uploadImageToCloudinary(packageImage);

        const packageRef = doc(collection(db, "packages"));

        await setDoc(packageRef, {
            imageUrl,
            imagePublicId,
            packageName,
            packageDescription,
            finalProducts
        })

        document.getElementById("js-package-details-screen").classList.remove('screen-show')
        await fetchAndDisplayPackages();

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
// EVENT LISTENERS
document.getElementById("js-add-package").addEventListener('click', async ()=>{
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');
    await addPackage();
})
document.getElementById("js-add-new-package-tab").addEventListener('click', ()=>{
    document.getElementById("js-package-details-screen").classList.add('screen-show')
    document.getElementById("js-update-package").style.display='none';
    document.getElementById("js-add-package").style.display='block'
})
document.getElementById("js-close-package-details-screen-btn").addEventListener('click', ()=>{
    document.getElementById("js-package-details-screen").classList.remove('screen-show')
    clearFields();
})


//// UPDATE PACKAGE
async function populateFields(packageId){
    try{
        const snap = await getDoc(doc(db, 'packages', packageId));

        document.getElementById("package-name-value").value = snap.data().packageName;
        document.getElementById("image-preview").style.display = 'block';
        document.getElementById("image-preview").src = snap.data().imageUrl;
        document.getElementById("package-description-value").value = snap.data().packageDescription;

        // UPDATE CTA ID SET
        document.getElementById("js-update-package").dataset.packageId = packageId;

        selectedProductsRow.innerHTML='';
        selectedProducts=[];
        snap.data().finalProducts.forEach(async product=>{
            const snap = await getDoc(doc(db, 'products', product.sectionId, 'items', product.productId));

            selectedProducts.push({
                'productId': product.productId, 
                'sectionId': product.sectionId,
                'productName': snap.data().name, 
                'productImage': snap.data().image,
            })

            selectedProductsRow.innerHTML+=
            `
                <div class="selected-product">
                    <button class="remove-product" data-product-id="${snap.data().id}">
                        <svg class="remove-product" data-product-id="${snap.data().id}" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </button>
                    <img src="${snap.data().image}">
                    <span>${snap.data().name}</span>
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
async function updatePackage(packageId) {
    const packageImage = document.getElementById("package-image-value").files[0];
    const packageName = document.getElementById("package-name-value").value.trim();
    const packageDescription = document.getElementById("package-description-value").value.trim();

    // IMAGE VALUE CHECK WAS REMOVED TO ALLOW UPDATING OTHER FIELDS EXLUDING THE IMAGE
    if(!packageName || !packageDescription || selectedProducts.length<2){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }
    const finalProducts = selectedProducts.map(({ productImage, productName, ...rest }) => rest);

    try{
        if(!packageImage){
            await updateDoc(doc(db, 'packages', packageId), {
                packageName,
                packageDescription,
                finalProducts
            });

            document.getElementById("js-package-details-screen").classList.remove('screen-show')
            await fetchAndDisplayPackages();

            loader.classList.remove('show-loader');
            loadingScreen.classList.remove('show-loader');
            return;
        }

        const { url: imageUrl, publicId: imagePublicId } = await uploadImageToCloudinary(packageImage);

        await updateDoc(doc(db, 'packages', packageId), {
            imageUrl,
            imagePublicId,
            packageName,
            packageDescription,
            finalProducts
        });

        document.getElementById("js-package-details-screen").classList.remove('screen-show')
        await fetchAndDisplayPackages();
        
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
// EVENT LISTENERS
document.addEventListener('click', async (e)=>{
    if(e.target.classList.contains("open-update-screen-btn")){
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');
        document.getElementById("js-package-details-screen").classList.add('screen-show');
        document.getElementById("js-add-package").style.display='none'
        document.getElementById("js-update-package").style.display='block';

        const packageId = e.target.dataset.packageId;
        await populateFields(packageId);
    }
})
document.getElementById("js-update-package").addEventListener('click', async ()=>{
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const packageId = document.getElementById("js-update-package").dataset.packageId;
    await updatePackage(packageId);
})



//// CONFIRM DELETE POPUP
const popupScreen = document.getElementById("js-black-screen");
const confirmDeletePopup = document.getElementById("js-confirm-delete-popup-container");
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-confirmdelete-btn')) {
        const packageId = element.target.dataset.packageId;
        const imagePublicId = element.target.dataset.imagePublicId;
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
                    <button class="js-delete-btn" data-package-id="${packageId}" data-image-public-id="${imagePublicId}">
                        Continue
                        <svg class="js-delete-btn" data-package-id="${packageId}" data-image-public-id="${imagePublicId}"
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
    if (element.target.classList.contains('js-delete-btn')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');

        const packageId = element.target.dataset.packageId;
        const imagePublicId = element.target.dataset.imagePublicId;

        try{
            await Promise.all([
                await deleteImageFromCloudinary(imagePublicId),
                await deleteDoc(doc(db, 'packages', packageId))
            ])

            await fetchAndDisplayPackages();

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
async function deleteImageFromCloudinary(publicId) {
    const response = await fetch('https://us-central1-scincare-plugg.cloudfunctions.net/deleteImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId })
    });
    
    return await response.json();
}


onAuthStateChanged(auth, async (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminHeader.style.display = "flex";
        allPackagesContainer.style.display = "grid";
        await fetchAndDisplayPackages();
    } 
    else {
        adminHeader.style.display = "none";
        allPackagesContainer.style.display = 'none';
        window.location.href = `../index.html`
    }
});