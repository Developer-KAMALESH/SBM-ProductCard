const stores = {
    1: {
        storeName: 'SRI BHARATH MART',
        storeLocation: 'SURUTUPALLI, Andhra Pradesh',
        storeWhatsapp: '+918367687339',
        storeWebsite: 'https://sribharathmart.netlify.app',
        storeGoogleReview: 'https://g.page/r/CS0d0v8-RSErEBM/review',
        bg: 'src\mart.JPG'
    },
    2: {
        storeName: 'SRI BHARATH METALS',
        storeLocation: 'UTHUKOTTAI, Tamil Nadu',
        storeWhatsapp: '+917639867339',
        storeGoogleReview: 'https://g.page/r/CS3amTdgeF7UEBM/review',
        bg: 'src\metals.JPG'
    }
};

function init() {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        showError("No product data provided.");
        return;
    }

    try {
        const standardBase64 = hash
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            + '==='.slice(0, (4 - hash.length % 4) % 4);
            
        const data = JSON.parse(decodeURIComponent(atob(standardBase64)));
        const store = stores[data.storeId];
        
        if (store) {
            render(data, store);
        } else {
            showError("Store not found.");
        }
    } catch (e) {
        showError("Invalid product data.");
    }
}

function render(data, store) {
    const root = document.getElementById("card-root");
    root.innerHTML = `
        <div class="card">
            <div class="store">${store.storeName}</div>
            <div class="product-name">${data.productName}</div>
            <div class="price-row">
                <span class="price">${data.productPrice}</span>
                <span class="original">${data.productOriginalPrice}</span>
                <span class="badge">${data.productDiscount}% OFF</span>
            </div>
            <table class="specs">
                ${Object.entries(data.specs).map(([key, value]) => `
                    <tr>
                        <td class="spec-key">${key}</td>
                        <td class="spec-val">${value}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

function showError(message) {
    document.getElementById("card-root").innerHTML = `<p>${message}</p>`;
}

// Start the app
init();