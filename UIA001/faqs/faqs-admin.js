import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "../../Javascript/Forms.js";


//// INTERFACES
const adminHeader = document.getElementById("js-header-container");
const allFaqsConatiner = document.getElementById("js-all-faqs-container");
const allPopupsContiner = document.getElementById("js-all-faq-popups");

//// POPUPS
const addNewFaqPopup = document.getElementById("js-add-new-faq-popup");
const updateFaqPopup = document.getElementById("js-faq-update-popup");
const confirmDeletePopup = document.getElementById("js-confirm-delete-popup-container");

const loader = document.getElementById("js-loader");
const loadingScreen = document.getElementById("js-loading-screen");
const popupScreen = document.getElementById("js-black-screen");

const failToast = document.getElementById("js-fail-toast");
const emptyFieldToast = document.getElementById("js-empty-field-toast");

loader.classList.add('show-loader');
loadingScreen.classList.add('show-loader');



//// RUNS ON PAGE LAOD TO FETCH FAQ DATA
async function fetchAndDisplayFaqs(){
    try{
        const snap = await getDocs(collection(db, 'faqs'));

        allFaqsConatiner.innerHTML='';
        snap.forEach(doc=>{
            const faq = doc.data();
            const faqId = doc.id;
            allFaqsConatiner.innerHTML+=
            `
                <div class="faq-container">
                    <div class="faq-card faq-card-selector" data-id="${faqId}">
                        <div class="question-container faq-card-selector" data-id="${faqId}">
                            Question
                            <div class="question-value faq-card-selector" data-id="${faqId}">${faq.question}</div>
                        </div>
                        <div class="answer-container faq-card-selector" data-id="${faqId}">
                            Answer
                            <div class="answer-value faq-card-selector" data-id="${faqId}">${faq.answer}</div>
                        </div>
                    </div>
                    <button class="js-open-confirmdelete-btn" data-id="${faqId}">
                        <svg class="js-open-confirmdelete-btn" data-id="${faqId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
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


//// CLICK TO OPEN AND UPDATE FAQ EVENT HANDLER
document.addEventListener('click', async element => {
    if (element.target.classList.contains('faq-card-selector')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');
        const faqId = element.target.dataset.id;
        await openUpdatePopup(faqId);
    }
});
async function openUpdatePopup(faqId) {
    try{
        const docSnap = await getDoc(doc(db, 'faqs', faqId));

        popupScreen.classList.add('show-loader');
        updateFaqPopup.classList.add('popup-show');

        updateFaqPopup.innerHTML=
        `
            <div class="padding">
                <div class="question-container">
                    Question
                    <textarea class="faq-question-input" name="faq-question" id="js-faq-question-input-value"></textarea>
                    <button class="update-faq-question-btn" data-id="${faqId}">
                        Update
                    </button>
                </div>

                <div class="answer-container">
                    Answer
                    <textarea class="faq-answer-input" name="faq-question" id="js-faq-answer-input-value"></textarea>
                    <button class="update-faq-asnwer-btn" data-id="${faqId}">
                        Update
                    </button>
                </div>

                <div class="bottom">
                    <button class="js-update-all-btn" data-id="${faqId}">
                        Update all
                    </button>
                    <button class="js-update-faq-close-popup-btn">
                        Close
                    </button>
                </div>
            </div>
        `
        
        document.getElementById("js-faq-question-input-value").value = docSnap.data().question;
        document.getElementById("js-faq-answer-input-value").value = docSnap.data().answer;

        loadingScreen.classList.remove('show-loader');
        loader.classList.remove('show-loader');
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

//// UPDATE FAQ
async function updateFaq(faqId){
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const questionValue = document.getElementById("js-faq-question-input-value").value.trim();
    const answerValue = document.getElementById("js-faq-answer-input-value").value.trim();

    if(!questionValue || !answerValue){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try{
        await updateDoc(doc(db, 'faqs', faqId), {
            question: questionValue,
            answer: answerValue
        });

        updateFaqPopup.classList.remove('popup-show');
        popupScreen.classList.remove('show-loader')
        await fetchAndDisplayFaqs();
        await openUpdatePopup(faqId);

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
document.addEventListener('click', async element => {
    if (element.target.classList.contains('update-faq-question-btn')) {
        const faqId = element.target.dataset.id;
        await updateFaq(faqId);
    }
});
document.addEventListener('click', async element => {
    if (element.target.classList.contains('update-faq-asnwer-btn')) {
        const faqId = element.target.dataset.id;
        await updateFaq(faqId);
    }
});
document.addEventListener('click', async element => {
    if (element.target.classList.contains('js-update-all-btn')) {
        const faqId = element.target.dataset.id;
        await updateFaq(faqId);
    }
});


//// ADD NEW FAQ
async function addFaq() {
    loader.classList.add('show-loader');
    loadingScreen.classList.add('show-loader');

    const questionValue = document.getElementById("js-add-new-faq-question-input-value").value.trim();
    const answerValue = document.getElementById("js-add-new-faq-answer-input-value").value.trim();

    if(!questionValue || !answerValue){
        loader.classList.remove('show-loader');
        loadingScreen.classList.remove('show-loader');

        emptyFieldToast.classList.add('show-toast');
        setTimeout(()=>{
            emptyFieldToast.classList.remove('show-toast')
        }, 5000);
        return;
    }

    try{
        const faqData = {
            question: questionValue,
            answer: answerValue
        };
        await addDoc(collection(db, "faqs"), faqData);

        await fetchAndDisplayFaqs();

        addNewFaqPopup.classList.remove('popup-show');
        popupScreen.classList.remove('show-loader')

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
document.getElementById("js-add-new-faq-card").addEventListener('click', ()=>{
    popupScreen.classList.add('show-loader');
    addNewFaqPopup.classList.add('popup-show');
});
document.getElementById("js-addnew-faq-btn").addEventListener('click', async ()=>{
    await addFaq()
})


//// CONFIRM DELETE POPUP
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-open-confirmdelete-btn')) {
        const faqId = element.target.dataset.id;
        popupScreen.classList.add('show-loader');
        confirmDeletePopup.classList.add('popup-show');
        confirmDeletePopup.innerHTML=
        `
            <div class="padding">
                Are You sure You want to delete this?
                <div class="ctas">
                    <button class="js-close-confirmdelete-popup-btn">
                        No, Exit
                    </button>
                    <button class="js-delete-faq-btn" data-id="${faqId}">
                        Continue
                        <svg class="js-delete-faq-btn" data-id="${faqId}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `
    }
});

//// DELETE FAQ
document.addEventListener('click', async element => {
    if (element.target.classList.contains('js-delete-faq-btn')) {
        loader.classList.add('show-loader');
        loadingScreen.classList.add('show-loader');
        const faqId = element.target.dataset.id;

        try{
            await deleteDoc(doc(db, 'faqs', faqId));
            popupScreen.classList.remove('show-loader');
            confirmDeletePopup.classList.remove('popup-show');
            await fetchAndDisplayFaqs();

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






//// CLOSE POPUP EVENT HANDLERS
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-close-confirmdelete-popup-btn')) {
        popupScreen.classList.remove('show-loader');
        confirmDeletePopup.classList.remove('popup-show');
    }
});
document.addEventListener('click', element => {
    if (element.target.classList.contains('js-update-faq-close-popup-btn')) {
        updateFaqPopup.classList.remove('popup-show');
        popupScreen.classList.remove('show-loader')
    }
});
popupScreen.addEventListener('click', ()=>{
    addNewFaqPopup.classList.remove('popup-show');
    confirmDeletePopup.classList.remove('popup-show');
    updateFaqPopup.classList.remove('popup-show');
    popupScreen.classList.remove('show-loader');
});




onAuthStateChanged(auth, async (user) => {
    if (user && user.email === 'ua-xys-admin-001@gmail.com')  {
        adminHeader.style.display = "flex";
        allFaqsConatiner.style.display = "grid";
        allPopupsContiner.style.display = "block";
        await fetchAndDisplayFaqs();
    } 
    else {
        adminHeader.style.display = "none";
        allFaqsConatiner.style.display = "none";
        allPopupsContiner.style.display = "none";
        window.location.href = `../index.html`
    }
});