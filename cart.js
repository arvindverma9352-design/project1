let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productImages = {
    patato: "images/patato.png", tomato: "images/tomato.png", brownonion: "images/brown-onion.png",
    redonion: "images/red-onion.png", ladyfinger: "images/lady-finger.png", greenchilli: "images/greenchilli.png",
    spinch: "images/spinch.png", lauki: "images/lauki.png", greencucumber: "images/greencucumber.png",
    cucumber: "images/cucumber.png", bittergourd: "images/bitter-gourd.png", carrot: "images/carrot.png",
    pumkin: "images/pumkin.png", cauliflower: "images/cauliflower.png", cabbage: "images/cabbage.png",
    brinjal: "images/brinjal.png", fenugreekleaves: "images/Fenugreek Leaves-मेथी.png",
    mustardgreens: "images/mustardgreens.png", corianderleaves: "images/corianderleaves.png",
    mint: "images/mint.png", bathua: "images/bathua.png", radish: "images/radish.png",
    beetroot: "images/beetroot.png", sweetpotato: "images/sweetpatato.png", garlic: "images/garlic.png",
    pointgourd: "images/pointgourd-परवल.png", tinda: "images/tinda.png", ginger: "images/ginger.png"
};
const productLabels = {
    patato: "Potato (आलू)", tomato: "Tomato (टमाटर)", brownonion: "Brown Onion (सफेद प्याज़)", redonion: "Red Onion (लाल प्याज़)",
    ladyfinger: "Lady Finger (भिंडी)", greenchilli: "Green Chilli (हरी मिर्च)", spinch: "Spinach (पालक)", lauki: "Lauki (लौकी)",
    greencucumber: "Green Cucumber (हरा खीरा)", cucumber: "Cucumber (खीरा)", bittergourd: "Bitter Gourd (करेला)", carrot: "Carrot (गाजर)",
    pumkin: "Pumpkin (कद्दू)", cauliflower: "Cauliflower (फूलगोभी)", cabbage: "Cabbage (पत्तागोभी)", brinjal: "Brinjal (बैंगन)",
    fenugreekleaves: "Fenugreek Leaves (मेथी)", mustardgreens: "Mustard Greens (सरसों का साग)", corianderleaves: "Coriander Leaves (धनिया पत्ती)",
    mint: "Mint (पुदीना)", bathua: "Bathua (बथुआ)", radish: "Radish (मूली)", beetroot: "Beetroot (चुकंदर)", sweetpotato: "Sweet Potato (शकरकंद)",
    garlic: "Garlic (लहसुन)", pointgourd: "Pointed Gourd (परवल)", tinda: "Tinda (टिंडा)", ginger: "Ginger (अदरक)"
};

function displayCart() {

    let cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let total = 0;

    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById("item-count").innerText = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🧺</div>
                <h2>Your cart is waiting</h2>
                <p>Add something fresh and delicious to get started.</p>
                <a href="Af-lo-sin-.html" class="empty-button">Browse vegetables →</a>
            </div>
        `;

        document.getElementById("total-price").innerText = "0";
        document.getElementById("payable-price").innerText = "0";
        document.getElementById("place-order").disabled = true;

        return;
    }

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const image = item.image || productImages[item.name] || "images/vegback.png";
        cartItems.innerHTML += `
            <article class="cart-item" style="--item-index: ${index}">
                <div class="item-visual"><img src="${image}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.classList.add('emoji-fallback'); this.parentElement.innerText='🥬'"></div>
                <div class="item-details">
                    <p class="item-label">Farm fresh</p>
                    <h3>${productLabels[item.name] || item.name.replace(/-/g, " ")}</h3>
                    <p class="item-price">₹${item.price} <span>per unit</span></p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control" aria-label="Quantity">
                        <button type="button" aria-label="Decrease quantity" onclick="decrease(${index})">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" aria-label="Increase quantity" onclick="increase(${index})">+</button>
                    </div>
                    <button class="remove-item" type="button" onclick="removeItem(${index})">Remove</button>
                </div>
                <strong class="item-subtotal">₹${item.price * item.quantity}</strong>
            </article>
        `;
    });

    document.getElementById("total-price").innerText = total;
    document.getElementById("payable-price").innerText = total;
    document.getElementById("place-order").disabled = false;
}


function increase(index) {

    cart[index].quantity++;

    saveCart();

    displayCart();
}


function decrease(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    saveCart();

    displayCart();
}


function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();
}


function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

}

function showCartToast(message) {
    const toast = document.getElementById("cart-toast");
    toast.innerHTML = `<span class="toast-check">✓</span><span>${message}</span>`;
    toast.classList.remove("toast-hide");
    toast.classList.add("toast-show");

    clearTimeout(window.cartToastTimer);
    window.cartToastTimer = setTimeout(() => {
        toast.classList.remove("toast-show");
        toast.classList.add("toast-hide");
    }, 2600);
}

function showToast(message) {
    showCartToast(message);
}

function placeOrder() {
    if (cart.length === 0) return;

    const orderMessage = document.getElementById("order-message");
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    orderMessage.innerText = `Order #VM${orderNumber} placed successfully! Your fresh picks are being packed.`;
    orderMessage.classList.add("is-visible");
    showToast(`Order #VM${orderNumber} successfully placed`);
    cart = [];
    saveCart();
    displayCart();
}


displayCart();