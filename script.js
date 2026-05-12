const stores = {
    1: {
        storeName: 'SRI BHARATH MART',
        storeLocation: 'SURUTUPALLI, Andhra Pradesh',
        storeWhatsapp: '918367687339',
        storeWebsite: 'https://sribharathmart.netlify.app',
        storeGoogleReview: 'https://g.page/r/CS0d0v8-RSErEBM/review',
        bg: 'src/mart.JPG' 
    },
    2: {
        storeName: 'SRI BHARATH METALS',
        storeLocation: 'UTHUKOTTAI, Tamil Nadu',
        storeWhatsapp: '917639867339',
        storeGoogleReview: 'https://g.page/r/CS3amTdgeF7UEBM/review',
        bg: 'src/metals.png'
    }
};

function init() {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        showError("Please scan a valid QR code.");
        return;
    }

    try {
        const base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
        const decodedString = atob(base64);
        const data = JSON.parse(decodeURIComponent(decodedString));
        
        const store = stores[data.storeId] || stores[1];
        render(data, store);
    } catch (e) {
        console.error("Decoding error:", e);
        showError("Invalid product link.");
    }
}

function render(data, store) {
    const root = document.getElementById("card-root");
    
    // Mapping keys from your Angular Qr Service
    const pName = data.productName || "Product";
    const pCode = data.productCode || "N/A"; // New: Product Code
    const pPrice = data.productPrice || "0";
    const pOriginal = data.productOriginalPrice || "0";
    const pDiscount = data.productDiscount || "0";
    
    const specsHTML = data.specs 
        ? Object.entries(data.specs).map(([key, value]) => `
            <tr>
                <td class="spec-key">${key}</td>
                <td class="spec-val">${value}</td>
            </tr>
        `).join("")
        : '<tr><td colspan="2">No specs available</td></tr>';

    const msg = `Hi ${store.storeName}, I'm interested in ${pName} (Code: ${pCode}, Price: ₹${pPrice}).`;
    const waLink = `https://wa.me/${store.storeWhatsapp}?text=${encodeURIComponent(msg)}`;

    root.innerHTML = `
        <div class="page-container" style="background-image: url('${store.bg}')">
            <div class="content-wrapper">
                <header class="store-header">
                    <h1>${store.storeName}</h1>
                    <p>📍 ${store.storeLocation}</p>
                </header>

                <div class="card">
                    <div class="product-name">${pName}</div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 10px;">Code: ${pCode}</div> <!-- Displayed Code -->
                    
                    <div class="price-row">
                        <span class="price">₹${pPrice}</span>
                        <span class="original">₹${pOriginal}</span>
                        <span class="badge">${pDiscount}% OFF</span>
                    </div>
                    
                    <table class="specs">
                        ${specsHTML}
                    </table>
                </div>

                <div class="action-grid">
                    <a href="${waLink}" class="btn btn-whatsapp" target="_blank">Order on WhatsApp</a>
                    <a href="${store.storeGoogleReview}" class="btn btn-review" target="_blank">Google Review</a>
                    ${store.storeWebsite ? `<a href="${store.storeWebsite}" class="btn btn-web" target="_blank">Visit Website</a>` : ''}
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    document.getElementById("card-root").innerHTML = `<div class="card"><p>${message}</p></div>`;
}

init();