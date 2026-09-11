const API_BASE = 'http://localhost:5000';
const wishlistItems = document.getElementById("wishlist-items");
const productLabels = {
    patato: "Potato (आलू)", tomato: "Tomato (टमाटर)", brownonion: "Brown Onion (सफेद प्याज़)", redonion: "Red Onion (लाल प्याज़)",
    ladyfinger: "Lady Finger (भिंडी)", greenchilli: "Green Chilli (हरी मिर्च)", spinch: "Spinach (पालक)", lauki: "Lauki (लौकी)",
    greencucumber: "Green Cucumber (हरा खीरा)", cucumber: "Cucumber (खीरा)", bittergourd: "Bitter Gourd (करेला)", carrot: "Carrot (गाजर)",
    pumkin: "Pumpkin (कद्दू)", cauliflower: "Cauliflower (फूलगोभी)", cabbage: "Cabbage (पत्तागोभी)", brinjal: "Brinjal (बैंगन)",
    fenugreekleaves: "Fenugreek Leaves (मेथी)", mustardgreens: "Mustard Greens (सरसों का साग)", corianderleaves: "Coriander Leaves (धनिया पत्ती)",
    mint: "Mint (पुदीना)", bathua: "Bathua (बथुआ)", radish: "Radish (मूली)", beetroot: "Beetroot (चुकंदर)", sweetpotato: "Sweet Potato (शकरकंद)",
    garlic: "Garlic (लहसुन)", pointgourd: "Pointed Gourd (परवल)", tinda: "Tinda (टिंडा)", ginger: "Ginger (अदरक)",
    broccli: "Broccoli (ब्रोकोली)", capsicum: "Capsicum (शिमला मिर्च)", corn: "Corn (मक्का)", jackfruit: "Jackfruit (कटहल)", masroom: "Mushroom (मशरूम)", peas: "Peas (मटर)"
};

function getCurrentUser() {
    try {
        const rawUser = localStorage.getItem('vegetable-mart-current-user') || sessionStorage.getItem('vegetable-mart-current-user');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        return null;
    }
}

function getWishlistStorage() {
    try {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch (error) {
        return [];
    }
}

function saveWishlistStorage(items) {
    localStorage.setItem("wishlist", JSON.stringify(items));
}

async function loadWishlist() {
    const currentUser = getCurrentUser();

    if (currentUser?.id) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/wishlist/${currentUser.id}`);
            const data = await response.json().catch(() => ({}));

            if (response.ok && Array.isArray(data.wishlist)) {
                saveWishlistStorage(data.wishlist);
                return data.wishlist;
            }
        } catch (error) {
            console.warn('Unable to load wishlist from backend:', error.message);
        }
    }

    return getWishlistStorage();
}

async function saveWishlist(items) {
    saveWishlistStorage(items);

    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
        return items;
    }

    try {
        const response = await fetch(`${API_BASE}/api/auth/wishlist/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wishlist: items })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Unable to sync wishlist');
        }

        return data.wishlist || items;
    } catch (error) {
        console.warn('Unable to sync wishlist with backend:', error.message);
        return items;
    }
}

async function renderWishlist() {
    if (!wishlistItems) {
        return;
    }

    const wishlist = await loadWishlist();

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-icon">♡</div>
                <h2>Your wishlist is waiting</h2>
                <p>Tap “Wishlist” on any vegetable to save it here.</p>
                <a href="Af-lo-sin-.html">Explore vegetables <span>→</span></a>
            </div>
        `;
        return;
    }

    wishlistItems.innerHTML = wishlist.map((item, index) => `
        <article class="wishlist-card">
            <div class="wishlist-image ${item.key || item.name}">
                <img src="${item.image || "images/logo.png"}" alt="${item.key || item.name}" onerror="this.src='images/logo.png'">
            </div>
            <div class="wishlist-info">
                <p class="item-label">Fresh pick</p>
                <h2>${productLabels[item.key || item.name] || item.title || item.name}</h2>
                <strong>₹${item.price}</strong>
            </div>
            <button class="remove-button" type="button" onclick="removeFromWishlist(${index})">Remove <span>×</span></button>
        </article>
    `).join("");
}

async function removeFromWishlist(index) {
    const wishlist = await loadWishlist();
    wishlist.splice(index, 1);
    await saveWishlist(wishlist);
    renderWishlist();
}

renderWishlist();
