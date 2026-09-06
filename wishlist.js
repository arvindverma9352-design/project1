const wishlistItems = document.getElementById("wishlist-items");
const productLabels = {
    patato: "Potato (आलू)", tomato: "Tomato (टमाटर)", brownonion: "Brown Onion (सफेद प्याज़)", redonion: "Red Onion (लाल प्याज़)",
    ladyfinger: "Lady Finger (भिंडी)", greenchilli: "Green Chilli (हरी मिर्च)", spinch: "Spinach (पालक)", lauki: "Lauki (लौकी)",
    greencucumber: "Green Cucumber (हरा खीरा)", cucumber: "Cucumber (खीरा)", bittergourd: "Bitter Gourd (करेला)", carrot: "Carrot (गाजर)",
    pumkin: "Pumpkin (कद्दू)", cauliflower: "Cauliflower (फूलगोभी)", cabbage: "Cabbage (पत्तागोभी)", brinjal: "Brinjal (बैंगन)",
    fenugreekleaves: "Fenugreek Leaves (मेथी)", mustardgreens: "Mustard Greens (सरसों का साग)", corianderleaves: "Coriander Leaves (धनिया पत्ती)",
    mint: "Mint (पुदीना)", bathua: "Bathua (बथुआ)", radish: "Radish (मूली)", beetroot: "Beetroot (चुकंदर)", sweetpotato: "Sweet Potato (शकरकंद)",
    garlic: "Garlic (लहसुन)", pointgourd: "Pointed Gourd (परवल)", tinda: "Tinda (टिंडा)", ginger: "Ginger (अदरक)"
};

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(items) {
    localStorage.setItem("wishlist", JSON.stringify(items));
}

function renderWishlist() {
    const wishlist = getWishlist();

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
            <div class="wishlist-image ${item.name}">
                <img src="${item.image || "images/logo.png"}" alt="${item.name}" onerror="this.src='images/logo.png'">
            </div>
            <div class="wishlist-info">
                <p class="item-label">Fresh pick</p>
                <h2>${productLabels[item.name] || item.name}</h2>
                <strong>₹${item.price}</strong>
            </div>
            <button class="remove-button" type="button" onclick="removeFromWishlist(${index})">Remove <span>×</span></button>
        </article>
    `).join("");
}

function removeFromWishlist(index) {
    const wishlist = getWishlist();
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    renderWishlist();
}

renderWishlist();
