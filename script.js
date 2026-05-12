const stores = {
    1: {
        storeName: 'SRI BHARATH MART',
        storeLocation: 'SURUTUPALLI, Andhra Pradesh',
        storeWhatsapp: '918367687339',
        storeGoogleReview: 'https://g.page/r/CS0d0v8-RSErEBM/review',
        storeWebsite:'https://sribharathmart.netlify.app/',
        bg: 'mart.JPG' 
    },
    2: {
        storeName: 'SRI BHARATH METALS',
        storeLocation: 'UTHUKOTTAI, Tamil Nadu',
        storeWhatsapp: '917639867339',
        storeGoogleReview: 'https://g.page/r/CS3amTdgeF7UEBM/review',
        bg: 'metals.png'
    }
};

function init() {
    console.log("Script loaded and initializing...");
    const hash = window.location.hash.slice(1);
    
    if (!hash) {
        showError("Please scan the QR code to view product details.");
        return;
    }

    try {
        const standardBase64 = hash
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            + '==='.slice(0, (4 - hash.length % 4) % 4);
            
        const data = JSON.parse(decodeURIComponent(atob(standardBase64)));
        console.log("Decoded data:", data);

        // Fallback to Store 1 if storeId is missing
        const store = stores[data.storeId] || stores[1];
        render(data, store);
    } catch (e) {
        console.error("Decoding error:", e);
        showError("Invalid product link.");
    }
}

function render(data, store) {
    const root = document.getElementById("card-root");
    const msg = `Hi ${store.storeName}, I'm interested in ${data.name} (Price: ₹${data.price}).`;
    const waLink = `https://wa.me/${store.storeWhatsapp}?text=${encodeURIComponent(msg)}`;

    root.innerHTML = `
        <div class="page-container" style="background-image: url('${store.bg}')">
            <div class="content-wrapper">
                <header class="store-header">
                    <h1>${store.storeName}</h1>
                    <p>📍 ${store.storeLocation}</p>
                </header>

                <div class="card">
                    <div class="product-name">${data.name}</div>
                    <div class="price-row">
                        <span class="price">₹${data.price}</span>
                        <span class="original">₹${data.originalPrice}</span>
                        <span class="badge">${data.discount}% OFF</span>
                    </div>
                    <table class="specs">
                        ${data.specs.map(s => `
                            <tr><td class="spec-key">${s.key}</td><td class="spec-val">${s.value}</td></tr>
                        `).join("")}
                    </table>
                </div>

                <div class="action-grid">
                    <a href="${waLink}" class="btn btn-whatsapp" target="_blank">Order on WhatsApp</a>
                    <a href="${store.storeGoogleReview}" class="btn btn-review" target="_blank">Google Review</a>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    document.getElementById("card-root").innerHTML = `<div class="card"><p>${message}</p></div>`;
}

init();