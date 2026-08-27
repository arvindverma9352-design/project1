let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {

    let cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = "<h2>Cart Empty 🛒</h2>";

        document.getElementById("total-price").innerText = "0";

        return;
    }

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price}</p>

                <button onclick="decrease(${index})">−</button>

                <span>${item.quantity}</span>

                <button onclick="increase(${index})">+</button>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

                <p>
                    Subtotal:
                    ₹${item.price * item.quantity}
                </p>

            </div>
        `;
    });

    document.getElementById("total-price").innerText = total;
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


displayCart();