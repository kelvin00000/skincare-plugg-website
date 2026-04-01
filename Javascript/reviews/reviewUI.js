import { showInputError } from "../authUI.js";
import { publishReview } from "./reviews.js";


///////////////////////////REVIEW FUNCTIONS//////////////////////////////
document.addEventListener('click', async element => {
    if (element.target.classList.contains('js-submit-review')) {
        let reviewMessageContent = document.getElementById('user-review-message').value;
        document.getElementById('user-review-message').value='';
        
        if(reviewMessageContent===''){
            showInputError('user-review-message')
            return;
        }

        const productId = element.target.dataset.productId;
        const sectionId = element.target.dataset.sectionId;

        await publishReview(sectionId, productId, reviewMessageContent);
    }
});