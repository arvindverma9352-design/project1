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
    pointgourd: "images/pointgourd-परवल.png", tinda: "images/tinda.png", ginger: "images/ginger.png",
    broccli: "images/broccli.png", capsicum: "images/capsicum.png", corn: "images/corn.png",
    jackfruit: "images/jackfruit.png", masroom: "images/masroom.png", peas: "images/peas.png"
};
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

function getCurrentUser() {
    try {
        const rawUser = localStorage.getItem('vegetable-mart-current-user') || sessionStorage.getItem('vegetable-mart-current-user');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        return null;
    }
}
// ─── Delivery Area / Pincode Lock (Option 1) ─────────────────
// Aap in pincodes ko apne area ke hisaab se edit kar sakte hain
const DEFAULT_ALLOWED_PINCODES = [
    "301001"
];

function getAllowedPincodes() {
    try {
        const saved = localStorage.getItem('vegetable-mart-allowed-pincodes');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(p => String(p).trim());
            }
        }
    } catch (e) {}
    return DEFAULT_ALLOWED_PINCODES;
}

function checkPincodeAvailability(pincode) {
    const cleanPin = (pincode || '').toString().trim();
    const statusEl = document.getElementById('pincode-status-text');
    if (!statusEl) return false;

    if (cleanPin.length < 6) {
        statusEl.style.display = 'none';
        return false;
    }

    const allowed = getAllowedPincodes();
    const isAvailable = allowed.includes(cleanPin);

    if (isAvailable) {
        statusEl.textContent = '✅ Delivery is available in your area!';
        statusEl.className = 'pincode-status-text available';
        statusEl.style.display = 'block';
        return true;
    } else {
        statusEl.textContent = '❌ Sorry, hum abhi is pincode par deliver nahi karte.';
        statusEl.className = 'pincode-status-text unavailable';
        statusEl.style.display = 'block';
        return false;
    }
}

function initDeliveryForm() {
    const currentUser = getCurrentUser();
    const nameInput = document.getElementById("delivery-name");
    const mobileInput = document.getElementById("delivery-mobile");
    const pincodeInput = document.getElementById("delivery-pincode");
    const addressInput = document.getElementById("delivery-address");

    if (pincodeInput) {
        pincodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
            if (e.target.value.length === 6) {
                checkPincodeAvailability(e.target.value);
            } else {
                const statusEl = document.getElementById('pincode-status-text');
                if (statusEl) statusEl.style.display = 'none';
            }
        });
    }

    if (currentUser) {
        if (nameInput && !nameInput.value) nameInput.value = currentUser.name || '';
        if (mobileInput && !mobileInput.value) mobileInput.value = currentUser.mobile || '';
        if (pincodeInput && !pincodeInput.value && currentUser.pincode) {
            pincodeInput.value = currentUser.pincode;
            checkPincodeAvailability(currentUser.pincode);
        }
        if (addressInput && !addressInput.value) addressInput.value = currentUser.address || '';
    }
}

async function placeOrder() {
    if (cart.length === 0) return;

    // ── Store closed check ──────────────────────────
    if (localStorage.getItem('vegetable-mart-store-open') === 'false') {
      showStoreClosedPopup();
      return;
    }
    // ───────────────────────────────────────────────

    const orderMessage = document.getElementById("order-message");
    const currentUser = getCurrentUser();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const nameInput = document.getElementById("delivery-name");
    const mobileInput = document.getElementById("delivery-mobile");
    const pincodeInput = document.getElementById("delivery-pincode");
    const addressInput = document.getElementById("delivery-address");

    const customerName = (nameInput ? nameInput.value : '').trim() || currentUser?.name || '';
    const customerMobile = (mobileInput ? mobileInput.value : '').trim() || currentUser?.mobile || '';
    const customerPincode = (pincodeInput ? pincodeInput.value : '').trim();
    const customerAddress = (addressInput ? addressInput.value : '').trim() || currentUser?.address || '';

    if (!customerName) {
        showToast('Please enter your full name');
        orderMessage.innerText = 'Please enter your full name.';
        orderMessage.classList.add("is-visible");
        nameInput?.focus();
        return;
    }

    if (!customerMobile) {
        showToast('Please enter your mobile number');
        orderMessage.innerText = 'Please enter your mobile number.';
        orderMessage.classList.add("is-visible");
        mobileInput?.focus();
        return;
    }

    if (customerMobile.replace(/\D/g, '').length < 10) {
        showToast('Please enter a valid 10-digit mobile number');
        orderMessage.innerText = 'Please enter a valid 10-digit mobile number.';
        orderMessage.classList.add("is-visible");
        mobileInput?.focus();
        return;
    }

    // ── Pincode / Location Area Check ───────────────
    if (!customerPincode) {
        showToast('Please enter your area pincode');
        orderMessage.innerText = 'Please enter your 6-digit area pincode.';
        orderMessage.classList.add("is-visible");
        pincodeInput?.focus();
        return;
    }

    if (customerPincode.length !== 6) {
        showToast('Please enter a valid 6-digit pincode');
        orderMessage.innerText = 'Please enter a valid 6-digit pincode.';
        orderMessage.classList.add("is-visible");
        pincodeInput?.focus();
        return;
    }

    const isAreaServiceable = checkPincodeAvailability(customerPincode);
    if (!isAreaServiceable) {
        showToast('Delivery not available in your area');
        orderMessage.innerText = `Aapke area (Pincode: ${customerPincode}) me abhi delivery service uplabdh nahi hai. Kripya apna area check karein.`;
        orderMessage.classList.add("is-visible");
        pincodeInput?.focus();
        return;
    }
    // ───────────────────────────────────────────────

    if (!customerAddress) {
        showToast('Please enter your delivery address');
        orderMessage.innerText = 'Please enter your delivery address.';
        orderMessage.classList.add("is-visible");
        addressInput?.focus();
        return;
    }

    const fullDeliveryAddress = `${customerAddress} (Pincode: ${customerPincode})`;

    const orderItems = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        weight: item.weight
    }));

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer: customerName,
                mobile: customerMobile,
                address: fullDeliveryAddress,
                email: currentUser?.email || '',
                total,
                items: orderItems
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to place order');
        }

        const orderNumber = data.order?._id || data.order?.id || `VM${Math.floor(1000 + Math.random() * 9000)}`;

        // Sync order to local admin backup
        try {
            const adminOrders = JSON.parse(localStorage.getItem('vegetable-mart-admin-orders') || '[]');
            adminOrders.unshift({
                id: orderNumber,
                customer: customerName,
                mobile: customerMobile,
                address: fullDeliveryAddress,
                email: currentUser?.email || '',
                total,
                status: 'Packed',
                items: orderItems
            });
            localStorage.setItem('vegetable-mart-admin-orders', JSON.stringify(adminOrders));
        } catch (e) {
            console.warn('Unable to sync order to local admin storage', e);
        }

        // Update current user address if logged in
        if (currentUser) {
            currentUser.address = customerAddress;
            currentUser.mobile = customerMobile;
            currentUser.pincode = customerPincode;
            sessionStorage.setItem('vegetable-mart-current-user', JSON.stringify(currentUser));
            if (localStorage.getItem('vegetable-mart-current-user')) {
                localStorage.setItem('vegetable-mart-current-user', JSON.stringify(currentUser));
            }
        }

        orderMessage.innerText = `Order #${orderNumber} placed successfully! Delivery to: ${fullDeliveryAddress}`;
        orderMessage.classList.add("is-visible");
        showToast(`Order placed successfully!`);
        cart = [];
        saveCart();
        displayCart();
    } catch (error) {
        orderMessage.innerText = error.message || 'Unable to place order right now.';
        orderMessage.classList.add("is-visible");
        showToast('Unable to place order right now');
    }
}

displayCart();
initDeliveryForm();

/* ─── Store Closed Popup ─────────────────────────── */
function showStoreClosedPopup() {
  let overlay = document.getElementById('store-closed-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'store-closed-overlay';
    overlay.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; flex-direction:column;';
    overlay.innerHTML = `
      <div style="background:#fff; border-radius:16px; padding:40px 32px; max-width:420px; width:90%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <div style="font-size:3rem; margin-bottom:12px;">🔒</div>
        <h2 style="color:#dc3545; margin:0 0 10px; font-size:1.5rem;">Website Abhi Band Hai</h2>
        <p style="color:#555; margin:0 0 24px; line-height:1.6;">Humari website abhi orders ke liye band hai.<br>Thodi der baad try karein.</p>
        <button onclick="document.getElementById('store-closed-overlay').style.display='none'" style="background:#dc3545; color:#fff; border:none; padding:12px 28px; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer;">Theek Hai</button>
      </div>`;
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

// Fetch store status on cart page load
(async function fetchStoreStatusCart() {
  try {
    const res = await fetch('http://localhost:5000/api/settings/store-status');
    const data = await res.json();
    if (data && typeof data.isOpen === 'boolean') {
      localStorage.setItem('vegetable-mart-store-open', data.isOpen ? 'true' : 'false');
    }
  } catch (err) {
    // Backend unreachable — keep localStorage value as-is
  }
})();
