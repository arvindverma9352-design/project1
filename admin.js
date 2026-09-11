const productCatalog = {
  patato: { title: 'Potato (???)', subtitle: 'Fresh, clean and kitchen-ready', description: 'Soft, versatile potatoes perfect for curries, fries, sabzi and everyday cooking.', image: 'images/patato.png', prices: { '250g': 40, '500g': 75, '1kg': 120 } },
  tomato: { title: 'Tomato (?????)', subtitle: 'Juicy and naturally sweet', description: 'Fresh tomatoes rich in flavour, ideal for sauces, salads, curries and soups.', image: 'images/tomato.png', prices: { '250g': 35, '500g': 60, '1kg': 110 } },
  brownonion: { title: 'Brown Onion (???? ??????)', subtitle: 'Everyday pantry staple', description: 'Mild, crunchy onion with a balanced flavour that enhances Indian home cooking.', image: 'images/brown-onion.png', prices: { '250g': 30, '500g': 55, '1kg': 100 } },
  redonion: { title: 'Red Onion (??? ??????)', subtitle: 'Bold, fresh and crisp', description: 'Bright red onion perfect for salads, pickles, chaats and quick stir-fries.', image: 'images/red-onion.png', prices: { '250g': 32, '500g': 58, '1kg': 105 } },
  ladyfinger: { title: 'Lady Finger (?????)', subtitle: 'Tender and farm-fresh', description: 'Healthy and delicious lady fingers that stay crisp and flavourful when cooked well.', image: 'images/lady-finger.png', prices: { '250g': 45, '500g': 80, '1kg': 150 } },
  greenchilli: { title: 'Green Chilli (??? ?????)', subtitle: 'Spicy and vibrant', description: 'Fresh green chillies for chutneys, tadkas, curries and spicy everyday meals.', image: 'images/greenchilli.png', prices: { '250g': 30, '500g': 50, '1kg': 90 } },
  spinch: { title: 'Spinach (????)', subtitle: 'Leafy greens with nutrition', description: 'Tender spinach leaves packed with nutrients and ideal for saag, smoothies and stir-fries.', image: 'images/spinch.png', prices: { '250g': 28, '500g': 48, '1kg': 85 } },
  lauki: { title: 'Lauki (????)', subtitle: 'Light, healthy and versatile', description: 'Smooth and mild bottle gourd best suited for curries, soups and nutritious meals.', image: 'images/lauki.png', prices: { '250g': 30, '500g': 55, '1kg': 100 } },
  greencucumber: { title: 'Green Cucumber (??? ????)', subtitle: 'Cool, crisp and refreshing', description: 'Fresh green cucumber perfect for salads, juices and light summer snacks.', image: 'images/greencucumber.png', prices: { '250g': 28, '500g': 50, '1kg': 90 } },
  cucumber: { title: 'Cucumber (????)', subtitle: 'Hydrating and crunchy', description: 'Classic cucumber known for its crisp texture and refreshing taste.', image: 'images/cucumber.png', prices: { '250g': 25, '500g': 45, '1kg': 80 } },
  bittergourd: { title: 'Bitter Gourd (?????)', subtitle: 'Bittersweet and wholesome', description: 'Bold in flavour, rich in taste and ideal for traditional desi recipes.', image: 'images/bitter-gourd.png', prices: { '250g': 35, '500g': 65, '1kg': 120 } },
  carrot: { title: 'Carrot (????)', subtitle: 'Sweet, crunchy and colourful', description: 'Fresh carrots loaded with sweetness and perfect for salads, soups and sabzi.', image: 'images/carrot.png', prices: { '250g': 28, '500g': 50, '1kg': 90 } },
  pumkin: { title: 'Pumpkin (?????)', subtitle: 'Soft texture and rich flavour', description: 'Naturally sweet pumpkin ideal for curries, soups, sweets and festive dishes.', image: 'images/pumkin.png', prices: { '250g': 30, '500g': 55, '1kg': 100 } },
  cauliflower: { title: 'Cauliflower (???????)', subtitle: 'Fresh florets, great texture', description: 'Tender cauliflower with firm florets, ideal for curries, gravies and snacks.', image: 'images/cauliflower.png', prices: { '250g': 40, '500g': 70, '1kg': 130 } },
  cabbage: { title: 'Cabbage (?????????)', subtitle: 'Crisp, clean and versatile', description: 'High-quality cabbage used in salads, curries, stir-fries and slaws.', image: 'images/cabbage.png', prices: { '250g': 25, '500g': 45, '1kg': 80 } },
  brinjal: { title: 'Brinjal (?????)', subtitle: 'Smooth and flavour-packed', description: 'Fresh brinjal with a meaty texture that works beautifully in curries and roasting.', image: 'images/brinjal.png', prices: { '250g': 35, '500g': 60, '1kg': 110 } },
  fenugreekleaves: { title: 'Fenugreek Leaves (????)', subtitle: 'Aromatic and wholesome', description: 'Fresh methi leaves for parathas, sabzi, tadka and traditional Indian meals.', image: 'images/Fenugreek Leaves-????.png', prices: { '250g': 25, '500g': 45, '1kg': 80 } },
  mustardgreens: { title: 'Mustard Greens (????? ?? ???)', subtitle: 'Peppery and nutritious', description: 'Tender mustard greens with a slightly peppery taste, loved in authentic home cooking.', image: 'images/mustardgreens.png', prices: { '250g': 25, '500g': 45, '1kg': 80 } },
  corianderleaves: { title: 'Coriander Leaves (????? ?????)', subtitle: 'Fresh herb for every meal', description: 'Bright coriander leaves used in chutneys, garnishes, curries and sandwiches.', image: 'images/corianderleaves.png', prices: { '250g': 20, '500g': 35, '1kg': 65 } },
  mint: { title: 'Mint (??????)', subtitle: 'Refreshing and aromatic', description: 'Fresh mint leaves ideal for chutneys, drinks, salads and seasonal recipes.', image: 'images/mint.png', prices: { '250g': 20, '500g': 35, '1kg': 65 } },
  bathua: { title: 'Bathua (????)', subtitle: 'Seasonal green goodness', description: 'Nutritious bathua leaves known for their earthy taste and traditional value.', image: 'images/bathua.png', prices: { '250g': 22, '500g': 40, '1kg': 70 } },
  radish: { title: 'Radish (????)', subtitle: 'Peppery and crunchy', description: 'Fresh radishes that bring a crisp bite to salads, pickles and side dishes.', image: 'images/radish.png', prices: { '250g': 22, '500g': 40, '1kg': 70 } },
  beetroot: { title: 'Beetroot (??????)', subtitle: 'Sweet, earthy and vibrant', description: 'Colorful beetroot that adds sweetness, nutrition and taste to many recipes.', image: 'images/beetroot.png', prices: { '250g': 30, '500g': 55, '1kg': 100 } },
  sweetpotato: { title: 'Sweet Potato (??????)', subtitle: 'Naturally sweet and filling', description: 'Soft sweet potatoes with a rich taste, perfect for roasting, soups and snacks.', image: 'images/sweetpatato.png', prices: { '250g': 35, '500g': 65, '1kg': 120 } },
  garlic: { title: 'Garlic (?????)', subtitle: 'Strong aroma, rich flavour', description: 'Fresh garlic cloves that build the base of countless flavorful dishes.', image: 'images/garlic.png', prices: { '250g': 25, '500g': 45, '1kg': 80 } },
  pointgourd: { title: 'Pointed Gourd (????)', subtitle: 'Tender and traditional', description: 'Soft, mild pointed gourd favourite in everyday Indian kitchen cooking.', image: 'images/pointgourd-????.png', prices: { '250g': 30, '500g': 55, '1kg': 95 } },
  tinda: { title: 'Tinda (?????)', subtitle: 'Light, subtle and healthy', description: 'Fresh tinda with a gentle flavour and smooth texture for simple home recipes.', image: 'images/tinda.png', prices: { '250g': 32, '500g': 58, '1kg': 105 } },
  ginger: { title: 'Ginger (????)', subtitle: 'Pungent, warm and aromatic', description: 'Fresh ginger used for curries, tea, pickles and many comforting dishes.', image: 'images/ginger.png', prices: { '250g': 35, '500g': 60, '1kg': 110 } },
  broccli: { title: 'Broccoli (????????)', subtitle: 'Fresh and nutrient-rich', description: 'Healthy broccoli heads packed with crunch, colour and excellent taste.', image: 'images/broccli.png', prices: { '250g': 45, '500g': 80, '1kg': 150 } },
  capsicum: { title: 'Capsicum (????? ?????)', subtitle: 'Sweet, colourful and crunchy', description: 'Fresh capsicum for stir-fries, curries, wraps and vibrant salads.', image: 'images/capsicum.png', prices: { '250g': 40, '500g': 70, '1kg': 130 } },
  corn: { title: 'Corn (?????)', subtitle: 'Sweet and naturally satisfying', description: 'Tender corn cobs and kernels with a bright sweetness for snacks and meals.', image: 'images/corn.png', prices: { '250g': 35, '500g': 60, '1kg': 110 } },
  jackfruit: { title: 'Jackfruit (????)', subtitle: 'Unique texture and rich taste', description: 'Fresh jackfruit pieces for savoury curries, kebabs and hearty meal preparations.', image: 'images/jackfruit.png', prices: { '250g': 50, '500g': 90, '1kg': 170 } },
  masroom: { title: 'Mushroom (?????)', subtitle: 'Earthy, juicy and savoury', description: 'Plump mushroom pieces perfect for gravies, stir-fries and special dinners.', image: 'images/masroom.png', prices: { '250g': 55, '500g': 95, '1kg': 180 } },
  peas: { title: 'Peas (???)', subtitle: 'Green, sweet and wholesome', description: 'Fresh peas for curries, pulao, soups and healthy everyday meals.', image: 'images/peas.png', prices: { '250g': 35, '500g': 60, '1kg': 110 } }
};

const STORAGE_KEYS = {
  products: 'vegetable-mart-admin-products',
  orders: 'vegetable-mart-admin-orders'
};

const API_BASE = 'http://localhost:5000';

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const orderList = document.getElementById('order-list');
const productCount = document.getElementById('product-count');
const productSearchInput = document.getElementById('product-search');
const productSortInput = document.getElementById('product-sort');
const categoryFilterInput = document.getElementById('category-filter');
const bulkDeleteButton = document.getElementById('bulk-delete');
const exportProductsButton = document.getElementById('export-products');
const selectedProductIds = new Set();

function normalizeProduct(product, key) {
  return {
    id: product.id || key,
    key: key || product.key || product.id,
    title: product.title || '',
    description: product.description || '',
    image: product.image || 'images/vegback.png',
    category: product.category || 'Vegetables',
    available: typeof product.available === 'boolean' ? product.available : true,
    prices: {
      '250g': Number(product.prices?.['250g']) || 0,
      '500g': Number(product.prices?.['500g']) || 0,
      '1kg': Number(product.prices?.['1kg']) || 0
    }
  };
}

function getSavedProducts() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || 'null');

  if (saved && saved.length) {
    return saved.map((product, index) => normalizeProduct(product, product.key || product.id || index));
  }

  return Object.entries(productCatalog).map(([key, product]) => normalizeProduct({ ...product, category: 'Vegetables' }, key));
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

async function loadProductsFromBackend() {
  try {
    const data = await apiRequest('/api/products');

    if (Array.isArray(data.products) && data.products.length) {
      const normalizedProducts = data.products.map((product, index) => normalizeProduct(product, product.key || product.id || index));
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(normalizedProducts));
      return normalizedProducts;
    }
  } catch (error) {
    console.warn('Unable to sync products from backend:', error.message);
  }

  return getSavedProducts();
}

async function syncProductToBackend(product, method = 'POST') {
  if (!product) return;

  try {
    const endpoint = method === 'POST' ? '/api/products' : `/api/products/${product.id}`;

    const options = {
      method,
      ...(method === 'POST' || method === 'PUT'
        ? { body: JSON.stringify(product) }
        : {})
    };

    await apiRequest(endpoint, options);
  } catch (error) {
    console.warn('Unable to sync product with backend:', error.message);
  }
}

function getSavedOrders() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || 'null');
  return saved && saved.length ? saved : [
    { id: 'VM1001', customer: 'Anjali', total: 320, status: 'Packed' },
    { id: 'VM1002', customer: 'Rohit', total: 245, status: 'Out for delivery' },
    { id: 'VM1003', customer: 'Meera', total: 190, status: 'Delivered' }
  ];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function buildCategoryOptions(products) {
  const categories = [...new Set(products.map((product) => product.category || 'Vegetables'))].sort((a, b) => a.localeCompare(b));
  const currentValue = categoryFilterInput?.value || 'all';

  categoryFilterInput.innerHTML = '<option value="all">All categories</option>' + categories.map((category) => `
    <option value="${category}">${category}</option>
  `).join('');

  categoryFilterInput.value = categories.includes(currentValue) ? currentValue : 'all';
}

function getFilteredProducts() {
  let products = getSavedProducts();
  const term = (productSearchInput?.value || '').trim().toLowerCase();
  const categoryValue = categoryFilterInput?.value || 'all';
  const sortValue = productSortInput?.value || 'az';

  if (term) {
    products = products.filter((product) => {
      const searchableText = `${product.title || ''} ${product.key || ''} ${product.description || ''}`.toLowerCase();
      return searchableText.includes(term);
    });
  }

  if (categoryValue !== 'all') {
    products = products.filter((product) => (product.category || 'Vegetables') === categoryValue);
  }

  products = [...products].sort((a, b) => a.title.localeCompare(b.title));

  if (sortValue === 'za') {
    products.reverse();
  }

  return products;
}

function renderProducts() {
  const products = getSavedProducts();
  const filteredProducts = getFilteredProducts();

  buildCategoryOptions(products);
  productCount.textContent = `${filteredProducts.length} / ${products.length} items`;

  bulkDeleteButton.disabled = selectedProductIds.size === 0;

  if (!filteredProducts.length) {
    productList.innerHTML = '<div class="empty-state">No matching products found.</div>';
    return;
  }

  productList.innerHTML = filteredProducts.map((product) => `
    <div class="product-item ${selectedProductIds.has(product.id) ? 'selected' : ''}">
      <div class="product-thumb-wrap">
        <input
          type="checkbox"
          class="select-checkbox"
          data-id="${product.id}"
          ${selectedProductIds.has(product.id) ? 'checked' : ''}
        />
        <div class="product-thumb">
          <img src="${product.image || 'images/vegback.png'}" alt="${product.title}" />
        </div>
      </div>

      <div class="product-meta">
        <h3>${product.title}</h3>
        <p>${product.description || 'Fresh product from Vegetable Mart.'}</p>
        <p class="product-category">Category: ${product.category || 'Vegetables'}</p>
        <div class="product-status ${product.available === false ? 'not-available' : 'available'}">
          ${product.available === false ? 'Not available' : 'Available'}
        </div>
        <div class="product-prices">
          <span>250g: ?${product.prices['250g'] || 0}</span>
          <span>500g: ?${product.prices['500g'] || 0}</span>
          <span>1kg: ?${product.prices['1kg'] || 0}</span>
        </div>
      </div>

      <div class="product-actions">
        <button type="button" class="action-btn" data-action="edit" data-id="${product.id}">Edit</button>
        <button type="button" class="action-btn delete" data-action="delete" data-id="${product.id}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderOrders() {
  const orders = getSavedOrders();

  if (!orders.length) {
    orderList.innerHTML = '<div class="empty-state">No orders yet.</div>';
    return;
  }

  orderList.innerHTML = orders.map((order) => `
    <div class="order-item">
      <div class="order-meta">
        <h3>${order.id}</h3>
        <p>Customer: ${order.customer}</p>
        <small>Total: ?${order.total}</small>
      </div>
      <span class="order-status">${order.status}</span>
    </div>
  `).join('');
}

function populateForm(product) {
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-key').value = product.key || '';
  document.getElementById('product-title').value = product.title || '';
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-image').value = product.image || '';
  document.getElementById('product-category').value = product.category || 'Vegetables';
  document.getElementById('product-availability').value = product.available === false ? 'not-available' : 'available';
  document.getElementById('price-250').value = product.prices?.['250g'] || '';
  document.getElementById('price-500').value = product.prices?.['500g'] || '';
  document.getElementById('price-1000').value = product.prices?.['1kg'] || '';
}

function resetForm() {
  productForm.reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-availability').value = 'available';
  document.getElementById('product-category').value = 'Vegetables';
}

async function handleSubmit(event) {
  event.preventDefault();

  const products = getSavedProducts();
  const id = document.getElementById('product-id').value || document.getElementById('product-key').value;
  const key = document.getElementById('product-key').value.trim();
  const title = document.getElementById('product-title').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const image = document.getElementById('product-image').value.trim() || 'images/vegback.png';
  const category = document.getElementById('product-category').value.trim() || 'Vegetables';

  if (!key || !title) {
    alert('Product key and title are required.');
    return;
  }

  const existingIndex = products.findIndex((product) => product.id === id || product.key === key);

  const newProduct = {
    id: id || key,
    key,
    title,
    description,
    image,
    category,
    available: document.getElementById('product-availability').value === 'available',
    prices: {
      '250g': Number(document.getElementById('price-250').value) || 0,
      '500g': Number(document.getElementById('price-500').value) || 0,
      '1kg': Number(document.getElementById('price-1000').value) || 0
    }
  };

  if (existingIndex >= 0) {
    products[existingIndex] = newProduct;
    await syncProductToBackend(newProduct, 'PUT');
  } else {
    products.unshift(newProduct);
    await syncProductToBackend(newProduct, 'POST');
  }

  saveProducts(products);
  renderProducts();
  resetForm();
}

async function handleProductListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const products = getSavedProducts();
  const product = products.find((item) => item.id === button.dataset.id);

  if (!product) return;

  if (button.dataset.action === 'edit') {
    populateForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (button.dataset.action === 'delete') {
    const updatedProducts = products.filter((item) => item.id !== product.id);
    selectedProductIds.delete(product.id);
    saveProducts(updatedProducts);
    await syncProductToBackend(product, 'DELETE');
    renderProducts();
  }
}

function handleSelectionChange(event) {
  const checkbox = event.target.closest('.select-checkbox');
  if (!checkbox) return;

  if (checkbox.checked) {
    selectedProductIds.add(checkbox.dataset.id);
  } else {
    selectedProductIds.delete(checkbox.dataset.id);
  }

  renderProducts();
}

async function handleBulkDelete() {
  if (!selectedProductIds.size) return;

  const products = getSavedProducts().filter((product) => !selectedProductIds.has(product.id));
  const deletedIds = [...selectedProductIds];
  selectedProductIds.clear();
  saveProducts(products);

  for (const id of deletedIds) {
    try {
      await apiRequest(`/api/products/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Unable to delete product from backend:', error.message);
    }
  }

  renderProducts();
}

function handleExportProducts() {
  const products = getSavedProducts();
  const payload = JSON.stringify(products, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'vegetable-products.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

productForm.addEventListener('submit', handleSubmit);
document.getElementById('reset-form').addEventListener('click', resetForm);
productList.addEventListener('click', handleProductListClick);
productList.addEventListener('change', handleSelectionChange);
productSearchInput?.addEventListener('input', renderProducts);
productSortInput?.addEventListener('change', renderProducts);
categoryFilterInput?.addEventListener('change', renderProducts);
bulkDeleteButton?.addEventListener('click', handleBulkDelete);
exportProductsButton?.addEventListener('click', handleExportProducts);

async function initializeAdminPage() {
  await loadProductsFromBackend();
  renderProducts();
  renderOrders();
}

initializeAdminPage();
