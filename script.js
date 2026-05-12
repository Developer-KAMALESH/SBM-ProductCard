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
    console.log("Decoding process started...");
    
    // 1. Get the hash and remove any potential trailing junk
    let hash = window.location.hash.slice(1).split('&')[0].trim();
    
    if (!hash) {
        showError("Please scan a valid QR code.");
        return;
    }

    try {
        // 2. Comprehensive Base64 cleanup
        // Replaces URL-safe characters and ensures proper padding
        let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
        
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
            
        // 3. Multi-layer Decoding
        // We first decode the Base64, then handle the URI component encoding
        const binaryString = atob(base64);
        
        // Some generators encode with escape(), others with encodeURIComponent()
        // This try/catch inside handles potential double-encoding
        let decodedData;
        try {
            decodedData = JSON.parse(decodeURIComponent(binaryString));
        } catch (innerError) {
            // Fallback for non-URI encoded strings
            decodedData = JSON.parse(binaryString);
        }
        
        console.log("Successfully Decoded:", decodedData);

        // 4. Store Selection (Fallback to Store 1)
        const store = stores[decodedData.storeId] || stores[1];
        
        render(decodedData, store);
    } catch (e) {
        console.error("Critical Decoding Error:", e);
        showError("Invalid product link. Please scan the QR code again.");
    }
}

function render(data, store) {
    const root = document.getElementById("card-root");
    
    // Safety check for keys (matching your Reliance Digital example)
    const pName = data.name || "Product";
    const pPrice = data.price || "0";
    const pOriginal = data.originalPrice || "0";
    const pDiscount = data.discount || "0";
    const pSpecs = data.specs || [];

    const msg = `Hi ${store.storeName}, I'm interested in ${pName} (Price: ₹${pPrice}).`;
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
                    <div class="price-row">
                        <span class="price">₹${pPrice}</span>
                        <span class="original">₹${pOriginal}</span>
                        <span class="badge">${pDiscount}% OFF</span>
                    </div>
                    <table class="specs">
                        ${pSpecs.map(s => `
                            <tr>
                                <td class="spec-key">${s.key}</td>
                                <td class="spec-val">${s.value}</td>
                            </tr>
                        `).join("")}
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
    document.getElementById("card-root").innerHTML = `
        <div class="card" style="text-align:center; margin-top: 20vh;">
            <p>${message}</p>
        </div>`;
}

init();