const wishlistItems = document.getElementById("wishlist-items");

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
                <h2>${item.name}</h2>
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
