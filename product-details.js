const productImages = {
  patato: "images/patato.png",
  tomato: "images/tomato.png",
  brownonion: "images/brown-onion.png",
  redonion: "images/red-onion.png",
  ladyfinger: "images/lady-finger.png",
  greenchilli: "images/greenchilli.png",
  spinch: "images/spinch.png",
  lauki: "images/lauki.png",
  greencucumber: "images/greencucumber.png",
  cucumber: "images/cucumber.png",
  bittergourd: "images/bitter-gourd.png",
  carrot: "images/carrot.png",
  pumkin: "images/pumkin.png",
  cauliflower: "images/cauliflower.png",
  cabbage: "images/cabbage.png",
  brinjal: "images/brinjal.png",
  fenugreekleaves: "images/Fenugreek Leaves-मेथी.png",
  mustardgreens: "images/mustardgreens.png",
  corianderleaves: "images/corianderleaves.png",
  mint: "images/mint.png",
  bathua: "images/bathua.png",
  radish: "images/radish.png",
  beetroot: "images/beetroot.png",
  sweetpotato: "images/sweetpatato.png",
  garlic: "images/garlic.png",
  pointgourd: "images/pointgourd-परवल.png",
  tinda: "images/tinda.png",
  ginger: "images/ginger.png",
  broccli: "images/broccli.png",
  capsicum: "images/capsicum.png",
  corn: "images/corn.png",
  jackfruit: "images/jackfruit.png",
  masroom: "images/masroom.png",
  peas: "images/peas.png"
};

const productCatalog = {
  patato: {
    title: "Potato (आलू)",
    subtitle: "Fresh, clean and kitchen-ready",
    description: "Soft, versatile potatoes perfect for curries, fries, sabzi and everyday cooking.",
    prices: { "250g": 40, "500g": 75, "1kg": 120 }
  },
  tomato: {
    title: "Tomato (टमाटर)",
    subtitle: "Juicy and naturally sweet",
    description: "Fresh tomatoes rich in flavour, ideal for sauces, salads, curries and soups.",
    prices: { "250g": 35, "500g": 60, "1kg": 110 }
  },
  brownonion: {
    title: "Brown Onion (सफेद प्याज़)",
    subtitle: "Everyday pantry staple",
    description: "Mild, crunchy onion with a balanced flavour that enhances Indian home cooking.",
    prices: { "250g": 30, "500g": 55, "1kg": 100 }
  },
  redonion: {
    title: "Red Onion (लाल प्याज़)",
    subtitle: "Bold, fresh and crisp",
    description: "Bright red onion perfect for salads, pickles, chaats and quick stir-fries.",
    prices: { "250g": 32, "500g": 58, "1kg": 105 }
  },
  ladyfinger: {
    title: "Lady Finger (भिंडी)",
    subtitle: "Tender and farm-fresh",
    description: "Healthy and delicious lady fingers that stay crisp and flavourful when cooked well.",
    prices: { "250g": 45, "500g": 80, "1kg": 150 }
  },
  greenchilli: {
    title: "Green Chilli (हरी मिर्च)",
    subtitle: "Spicy and vibrant",
    description: "Fresh green chillies for chutneys, tadkas, curries and spicy everyday meals.",
    prices: { "250g": 30, "500g": 50, "1kg": 90 }
  },
  spinch: {
    title: "Spinach (पालक)",
    subtitle: "Leafy greens with nutrition",
    description: "Tender spinach leaves packed with nutrients and ideal for saag, smoothies and stir-fries.",
    prices: { "250g": 28, "500g": 48, "1kg": 85 }
  },
  lauki: {
    title: "Lauki (लौकी)",
    subtitle: "Light, healthy and versatile",
    description: "Smooth and mild bottle gourd best suited for curries, soups and nutritious meals.",
    prices: { "250g": 30, "500g": 55, "1kg": 100 }
  },
  greencucumber: {
    title: "Green Cucumber (हरा खीरा)",
    subtitle: "Cool, crisp and refreshing",
    description: "Fresh green cucumber perfect for salads, juices and light summer snacks.",
    prices: { "250g": 28, "500g": 50, "1kg": 90 }
  },
  cucumber: {
    title: "Cucumber (खीरा)",
    subtitle: "Hydrating and crunchy",
    description: "Classic cucumber known for its crisp texture and refreshing taste.",
    prices: { "250g": 25, "500g": 45, "1kg": 80 }
  },
  bittergourd: {
    title: "Bitter Gourd (करेला)",
    subtitle: "Bittersweet and wholesome",
    description: "Bold in flavour, rich in taste and ideal for traditional desi recipes.",
    prices: { "250g": 35, "500g": 65, "1kg": 120 }
  },
  carrot: {
    title: "Carrot (गाजर)",
    subtitle: "Sweet, crunchy and colourful",
    description: "Fresh carrots loaded with sweetness and perfect for salads, soups and sabzi.",
    prices: { "250g": 28, "500g": 50, "1kg": 90 }
  },
  pumkin: {
    title: "Pumpkin (कद्दू)",
    subtitle: "Soft texture and rich flavour",
    description: "Naturally sweet pumpkin ideal for curries, soups, sweets and festive dishes.",
    prices: { "250g": 30, "500g": 55, "1kg": 100 }
  },
  cauliflower: {
    title: "Cauliflower (फूलगोभी)",
    subtitle: "Fresh florets, great texture",
    description: "Tender cauliflower with firm florets, ideal for curries, gravies and snacks.",
    prices: { "250g": 40, "500g": 70, "1kg": 130 }
  },
  cabbage: {
    title: "Cabbage (पत्तागोभी)",
    subtitle: "Crisp, clean and versatile",
    description: "High-quality cabbage used in salads, curries, stir-fries and slaws.",
    prices: { "250g": 25, "500g": 45, "1kg": 80 }
  },
  brinjal: {
    title: "Brinjal (बैंगन)",
    subtitle: "Smooth and flavour-packed",
    description: "Fresh brinjal with a meaty texture that works beautifully in curries and roasting.",
    prices: { "250g": 35, "500g": 60, "1kg": 110 }
  },
  fenugreekleaves: {
    title: "Fenugreek Leaves (मेथी)",
    subtitle: "Aromatic and wholesome",
    description: "Fresh methi leaves for parathas, sabzi, tadka and traditional Indian meals.",
    prices: { "250g": 25, "500g": 45, "1kg": 80 }
  },
  mustardgreens: {
    title: "Mustard Greens (सरसों का साग)",
    subtitle: "Peppery and nutritious",
    description: "Tender mustard greens with a slightly peppery taste, loved in authentic home cooking.",
    prices: { "250g": 25, "500g": 45, "1kg": 80 }
  },
  corianderleaves: {
    title: "Coriander Leaves (धनिया पत्ती)",
    subtitle: "Fresh herb for every meal",
    description: "Bright coriander leaves used in chutneys, garnishes, curries and sandwiches.",
    prices: { "250g": 20, "500g": 35, "1kg": 65 }
  },
  mint: {
    title: "Mint (पुदीना)",
    subtitle: "Refreshing and aromatic",
    description: "Fresh mint leaves ideal for chutneys, drinks, salads and seasonal recipes.",
    prices: { "250g": 20, "500g": 35, "1kg": 65 }
  },
  bathua: {
    title: "Bathua (बथुआ)",
    subtitle: "Seasonal green goodness",
    description: "Nutritious bathua leaves known for their earthy taste and traditional value.",
    prices: { "250g": 22, "500g": 40, "1kg": 70 }
  },
  radish: {
    title: "Radish (मूली)",
    subtitle: "Peppery and crunchy",
    description: "Fresh radishes that bring a crisp bite to salads, pickles and side dishes.",
    prices: { "250g": 22, "500g": 40, "1kg": 70 }
  },
  beetroot: {
    title: "Beetroot (चुकंदर)",
    subtitle: "Sweet, earthy and vibrant",
    description: "Colorful beetroot that adds sweetness, nutrition and taste to many recipes.",
    prices: { "250g": 30, "500g": 55, "1kg": 100 }
  },
  sweetpotato: {
    title: "Sweet Potato (शकरकंद)",
    subtitle: "Naturally sweet and filling",
    description: "Soft sweet potatoes with a rich taste, perfect for roasting, soups and snacks.",
    prices: { "250g": 35, "500g": 65, "1kg": 120 }
  },
  garlic: {
    title: "Garlic (लहसुन)",
    subtitle: "Strong aroma, rich flavour",
    description: "Fresh garlic cloves that build the base of countless flavorful dishes.",
    prices: { "250g": 25, "500g": 45, "1kg": 80 }
  },
  pointgourd: {
    title: "Pointed Gourd (परवल)",
    subtitle: "Tender and traditional",
    description: "Soft, mild pointed gourd favourite in everyday Indian kitchen cooking.",
    prices: { "250g": 30, "500g": 55, "1kg": 95 }
  },
  tinda: {
    title: "Tinda (टिंडा)",
    subtitle: "Light, subtle and healthy",
    description: "Fresh tinda with a gentle flavour and smooth texture for simple home recipes.",
    prices: { "250g": 32, "500g": 58, "1kg": 105 }
  },
  ginger: {
    title: "Ginger (अदरक)",
    subtitle: "Pungent, warm and aromatic",
    description: "Fresh ginger used for curries, tea, pickles and many comforting dishes.",
    prices: { "250g": 35, "500g": 60, "1kg": 110 }
  },
  broccli: {
    title: "Broccoli (ब्रोकोली)",
    subtitle: "Fresh and nutrient-rich",
    description: "Healthy broccoli heads packed with crunch, colour and excellent taste.",
    prices: { "250g": 45, "500g": 80, "1kg": 150 }
  },
  capsicum: {
    title: "Capsicum (शिमला मिर्च)",
    subtitle: "Sweet, colourful and crunchy",
    description: "Fresh capsicum for stir-fries, curries, wraps and vibrant salads.",
    prices: { "250g": 40, "500g": 70, "1kg": 130 }
  },
  corn: {
    title: "Corn (मक्का)",
    subtitle: "Sweet and naturally satisfying",
    description: "Tender corn cobs and kernels with a bright sweetness for snacks and meals.",
    prices: { "250g": 35, "500g": 60, "1kg": 110 }
  },
  jackfruit: {
    title: "Jackfruit (कटहल)",
    subtitle: "Unique texture and rich taste",
    description: "Fresh jackfruit pieces for savoury curries, kebabs and hearty meal preparations.",
    prices: { "250g": 50, "500g": 90, "1kg": 170 }
  },
  masroom: {
    title: "Mushroom (मशरूम)",
    subtitle: "Earthy, juicy and savoury",
    description: "Plump mushroom pieces perfect for gravies, stir-fries and special dinners.",
    prices: { "250g": 55, "500g": 95, "1kg": 180 }
  },
  peas: {
    title: "Peas (मटर)",
    subtitle: "Green, sweet and wholesome",
    description: "Fresh peas for curries, pulao, soups and healthy everyday meals.",
    prices: { "250g": 35, "500g": 60, "1kg": 110 }
  }
};

const fallbackKeys = Object.keys(productCatalog);

function getProductKey() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("product");
  return productCatalog[name] ? name : fallbackKeys[0];
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const countNode = document.getElementById("nav-cart-count");
  if (countNode) {
    countNode.textContent = totalItems;
  }
}

function showToast(message) {
  const toast = document.getElementById("cart-toast");
  if (!toast) return;

  toast.innerHTML = `<span class="toast-check">✓</span><span>${message}</span>`;
  toast.classList.remove("toast-hide");
  toast.classList.add("toast-show");

  clearTimeout(window.cartToastTimer);
  window.cartToastTimer = setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");
  }, 2600);
}

function addToCart(productKey, price, weightLabel) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.name === productKey && item.weight === weightLabel);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: productKey,
      price,
      image: productImages[productKey],
      quantity: 1,
      weight: weightLabel
    });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${productCatalog[productKey].title} (${weightLabel}) cart me add ho gaya`);
}

function getSavedProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem('vegetable-mart-admin-products') || 'null');
    return saved && saved.length ? saved : null;
  } catch (error) {
    return null;
  }
}

function getProductData(productKey) {
  const savedProducts = getSavedProducts();
  if (savedProducts) {
    const savedProduct = savedProducts.find((item) => item.key === productKey);
    if (savedProduct) {
      return {
        ...productCatalog[productKey],
        title: savedProduct.title || productCatalog[productKey].title,
        description: savedProduct.description || productCatalog[productKey].description,
        prices: savedProduct.prices || productCatalog[productKey].prices,
        available: savedProduct.available !== false,
        image: savedProduct.image || productImages[productKey]
      };
    }
  }

  return {
    ...productCatalog[productKey],
    available: true,
    image: productImages[productKey]
  };
}

function renderProductDetail() {
  const productKey = getProductKey();
  const product = getProductData(productKey);
  const detailContainer = document.getElementById("product-detail");

  if (!detailContainer || !product) {
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-visual-wrap">
      <div class="detail-visual">
        <img src="${product.image}" alt="${product.title}" />
      </div>
    </div>

    <div class="detail-copy">
      <p class="detail-kicker">Fresh vegetable</p>
      <h1>${product.title}</h1>
      <p class="detail-subtitle">${product.subtitle}</p>
      <p class="detail-description">${product.description}</p>

      <div class="detail-tags">
        <span>${product.available ? 'Available' : 'Not available'}</span>
        <span>Farm fresh</span>
        <span>Daily delivery</span>
      </div>

      <div class="price-grid">
        ${Object.entries(product.prices)
          .map(
            ([weight, price]) => `
              <div class="weight-card">
                <div class="weight-head">
                  <span>${weight}</span>
                  <strong>₹${price}</strong>
                </div>
                <button type="button" class="price-button" data-product="${productKey}" data-weight="${weight}" data-price="${price}">
                  Add to cart
                </button>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".price-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!product.available) {
        showToast(`${product.title} currently not available`);
        return;
      }
      addToCart(button.dataset.product, Number(button.dataset.price), button.dataset.weight);
    });
  });

  if (!product.available) {
    const priceGrid = document.querySelector('.price-grid');
    if (priceGrid) {
      priceGrid.innerHTML = `
        <div class="availability-card">
          <h3>Currently unavailable</h3>
          <p>This product is not available right now. Please check back later.</p>
        </div>
      `;
    }
  }
}

function renderRelatedProducts() {
  const productKey = getProductKey();
  const relatedContainer = document.getElementById("related-products");

  if (!relatedContainer) {
    return;
  }

  const keys = fallbackKeys.filter((key) => key !== productKey);
  const relatedKeys = [...keys].sort(() => Math.random() - 0.5).slice(0, 8);

  relatedContainer.innerHTML = relatedKeys
    .map((key) => {
      const product = productCatalog[key];
      return `
        <article class="related-card">
          <div class="related-image">
            <img src="${productImages[key]}" alt="${product.title}" />
          </div>
          <div class="related-copy">
            <h3>${product.title}</h3>
            <p>From ₹${product.prices["250g"]}</p>
          </div>
          <a href="product-details.html?product=${key}" class="related-link">View details</a>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProductDetail();
  renderRelatedProducts();
});
