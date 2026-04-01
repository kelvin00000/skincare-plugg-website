export function showErrorPopup({errorMsg, classList}){
    const popup = document.createElement('div');
    popup.className = 'popup error-popup';
    popup.innerHTML = `
        <span class="message">${errorMsg}</span>
        <button class="${classList?`${classList} js-close-popup`:`js-close-popup`}">
            <span class="${classList?`${classList} js-close-popup`:`js-close-popup`}">Got it</span>
        </button>
    `;
    
    document.body.appendChild(popup);
    popup.classList.add('show');

    popup.querySelector('.js-close-popup').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    });
}

export function showToasttip({title, classList, button=false}){
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toasttips';
    toastContainer.innerHTML = `
        <div class="toasttip user-toasttip">
            <p>${title}</p> 
            ${button?`<button class="${classList}">View</button>`:``}
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toasttip = document.querySelector(".user-toasttip");
    toasttip.classList.add('show-toast');

    setTimeout(() => {
        toasttip.classList.remove('show-toast')
        toastContainer.remove();
    }, 5000);
}